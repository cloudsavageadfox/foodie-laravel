#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <vector>
#include <chrono>
#include <mach/mach.h>
#include <mach-o/loader.h>
#include <mach-o/swap.h>
#include <mach-o/fat.h>

using namespace std;

/*
vector<string> getStringsFromPattern(string pattern) {
    int i;
    vector<int> indexes;
    vector<string> result;
    for (i = 0; i < pattern.length(); ++i) {
        if (pattern[i] == '?') {
            pattern[i] = '0';
            indexes.push_back(i);
        }
    }
    do {
        for (i = 0, result.push_back(pattern);
             i < indexes.size() && pattern[indexes[i]] == 'F';
             pattern[indexes[i++]] = '0');
    } while (i != indexes.size() && (pattern[indexes[i]] == '9' &&
                                     (pattern[indexes[i]] = '@'), ++pattern[indexes[i]] || 1));
    return result;
}
*/

uint32_t read_magic(FILE *obj_file, int offset) {
    uint32_t magic;
    fseek(obj_file, offset, SEEK_SET);
    fread(&magic, sizeof(uint32_t), 1, obj_file);
    return magic;
}

int is_magic_64(uint32_t magic) {
    return magic == MH_MAGIC_64 || magic == MH_CIGAM_64;
}

int should_swap_bytes(uint32_t magic) {
    return magic == MH_CIGAM || magic == MH_CIGAM_64 || magic == FAT_CIGAM;
}

int is_fat(uint32_t magic) {
    return magic == FAT_MAGIC || magic == FAT_CIGAM;
}

struct _cpu_type_names {
    cpu_type_t cputype;
    const char *cpu_name;
};

mach_vm_address_t load_bytes(FILE *obj_file, int offset, int size) {
    mach_vm_address_t buf = (mach_vm_address_t)calloc(1, size);
    fseek(obj_file, offset, SEEK_SET);
    fread((void*)buf, size, 1, obj_file);
    return buf;
}

void dump_segment_commands(FILE *obj_file, int offset, int is_swap, uint32_t ncmds, mach_vm_address_t &fo, uint64_t &fs) {
    int actual_offset = offset;
    for (int  i = 0; i < ncmds; i++) {
        struct load_command *cmd = (struct load_command*) load_bytes(obj_file, actual_offset, sizeof(struct load_command));
        if (is_swap) {
            swap_load_command(cmd, NX_UnknownByteOrder);
        }
        
        if (cmd->cmd == LC_SEGMENT_64) {
            struct segment_command_64 *segment = (struct segment_command_64*)load_bytes(obj_file, actual_offset, sizeof(struct segment_command_64));
            if (is_swap) {
                swap_segment_command_64(segment, NX_UnknownByteOrder);
            }
            
            if (strstr(segment->segname, "TEXT") != 0 || strstr(segment->segname, "text") != 0) {
                fo = segment->fileoff;
                fs = segment->filesize;
            }
            free(segment);
        }
        actual_offset += cmd->cmdsize;
        
        free(cmd);
    }
}

void dump_mach_header(FILE *obj_file, int offset, int is_64, int is_swap, mach_vm_address_t &fo, uint64_t &fs) {
    uint32_t ncmds;
    int load_commands_offset = offset;
    
    if (is_64) {
        int header_size = sizeof(struct mach_header_64);
        struct mach_header_64 *header = (struct mach_header_64*)load_bytes(obj_file, offset, header_size);
        if (is_swap) {
            swap_mach_header_64(header, NX_UnknownByteOrder);
        }
        ncmds = header->ncmds;
        load_commands_offset += header_size;
        
        free(header);
    } else {
        int header_size = sizeof(struct mach_header);
        struct mach_header *header = (struct mach_header*)load_bytes(obj_file, offset, header_size);
        if (is_swap) {
            swap_mach_header(header, NX_UnknownByteOrder);
        }
        
        ncmds = header->ncmds;
        load_commands_offset += header_size;
        
        free(header);
    }
    
    dump_segment_commands(obj_file, load_commands_offset, is_swap, ncmds, fo, fs);
}

void dump_fat_header(FILE *obj_file, int is_swap, mach_vm_address_t &fo, uint64_t &fs) {
    int header_size = sizeof(struct fat_header);
    int arch_size = sizeof(struct fat_arch);
    
    struct fat_header *header = (struct fat_header*)load_bytes(obj_file, 0, header_size);
    if (is_swap) {
        swap_fat_header(header, NX_UnknownByteOrder);
    }
    
    int arch_offset = header_size;
    for (int i = 0; i < header->nfat_arch; i++) {
        struct fat_arch *arch = (struct fat_arch*)load_bytes(obj_file, arch_offset, arch_size);
        
        if (is_swap) {
            swap_fat_arch(arch, 1, NX_UnknownByteOrder);
        }
        
        int mach_header_offset = arch->offset;
        free(arch);
        arch_offset += arch_size;
        
        uint32_t magic = read_magic(obj_file, mach_header_offset);
        int is_64 = is_magic_64(magic);
        int is_swap_mach = should_swap_bytes(magic);
        dump_mach_header(obj_file, mach_header_offset, is_64, is_swap_mach, fo, fs);
        fo = (uint64_t) fo + mach_header_offset;
    }
    free(header);
}

void dump_segments(FILE *obj_file, mach_vm_address_t &fo, uint64_t &fs) {
    uint32_t magic = read_magic(obj_file, 0);
    int is_64 = is_magic_64(magic);
    int is_swap = should_swap_bytes(magic);
    int fat = is_fat(magic);
    if (fat) {
        dump_fat_header(obj_file, is_swap, fo, fs);
    } else {
        dump_mach_header(obj_file, 0, is_64, is_swap, fo, fs);
    }
}

vector<unsigned long> signToAddr(string sign) {
    vector<unsigned long> v;
    char *str = (char*)sign.c_str();
    char *pEnd = str;
    while (pEnd-str < strlen(str)) {
        v.push_back(strtoul(pEnd, &pEnd, 0));
    }
    return v;
}

struct sign_offsets {
    mach_vm_address_t disk;
    mach_vm_address_t memory;
};

sign_offsets find_first_signature(FILE* file, string signature) {
    mach_vm_address_t offset, text_seg, text_seg_it;
    uint64_t size;
    
    dump_segments(file, offset, size);
    text_seg = load_bytes(file, offset, size);
    
    
    int i;
    vector<int> indexes;
    //vector<string> result;
    for (i = 0; i < signature.length(); ++i) {
        if (signature[i] == '?') {
            signature[i] = '0';
            indexes.push_back(i);
        }
    }
    do {
        vector<unsigned long> v = signToAddr(signature);
        char *arr = (char*)calloc(v.size(), sizeof(char));
        size_t i = 0;
        for (unsigned long x : v) {
            arr[i++] = (char) x;
        }
        for (text_seg_it = text_seg; text_seg_it < text_seg + size; text_seg_it+= i) {
            if (!memcmp((void*)text_seg_it, (void*)arr, i)) {
                return {text_seg_it - text_seg + offset, text_seg_it};
            }
        }
        for (i = 0;
             i < indexes.size() && signature[indexes[i]] == 'F';
             signature[indexes[i++]] = '0');
        free(arr);
    } while (i != indexes.size() && (signature[indexes[i]] == '9' &&
                                     (signature[indexes[i]] = '@'), ++signature[indexes[i]] || 1));
    free(text_seg);
    return {NULL,NULL};

}

int main(int argc, char *argv[]) {
    const char *filename = "/Users/sergeysustov/Downloads/test/Tiny Tower";
    //string signature = "0xF0 0x01 0x8D 0x41 0xF9 0xE0 0x03";
    string signature = "0x68 0x20 0x00 0x?0 0x08 0x?1 0x8? 0xB9 0x00 0x68 0x68 0xB8 0xC0 0x03 0x5F 0xD6 0x68 0x20 0x00 0x?0 0x08 0x?9 0x8? 0xB9 0x00 0x68 0x68 0xB8 0xC0 0x03 0x5F 0xD6";
    FILE *obj_file = fopen(filename, "rb");
    std::chrono::high_resolution_clock::time_point t1 = std::chrono::high_resolution_clock::now();
    sign_offsets offsets = find_first_signature(obj_file, signature);
    std::chrono::high_resolution_clock::time_point t2 = std::chrono::high_resolution_clock::now();
    
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>( t2 - t1 ).count();
    
    cout << duration;
    
    printf("DISK OFFSET: %p\nMEMORY OFFSET: %p\n", offsets.disk, offsets.memory);
    fclose(obj_file);
    return 0;
}