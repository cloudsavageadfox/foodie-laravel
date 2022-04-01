function setFileUploader(fileInputId, uploadUrl, fileInputName, fileOriginalInputName, imgId, appendImage, appendable) {
    $("body").on("change", fileInputId, function () {
        var file_data = $(fileInputId).prop("files")[0]; // Getting the properties of file from file field
        var form_data = new FormData();
        form_data.append("file", file_data);
        var file = form_data;
        $.ajax({
            url: uploadUrl,
            data: file,
            processData: false,
            contentType: false,
            dataType: 'json',
            type: 'POST',
            success: function (res) {
                if (fileInputName != "") {
                    $("input[name='" + fileInputName + "']").val(res.file);
                    $("input[name='" + fileOriginalInputName + "']").val(res.originalName);
                }
                $(imgId).html("<img src='" + res.fileUrl + "?w=150&h=150&mode=crop'/>");
            }
        });
    });
}

function setInquireFormUploader(fileInputId, uploadUrl, fileInputName, fileOriginalInputName, imgId, appendImage, appendable) {
    $("body").on("change", fileInputId, function () {
        var file_data = $(fileInputId).prop("files")[0]; // Getting the properties of file from file field
        var form_data = new FormData();
        form_data.append("file", file_data);
        var file = form_data;
        $.ajax({
            url: uploadUrl,
            data: file,
            processData: false,
            contentType: false,
            dataType: 'json',
            type: 'POST',
            success: function (res) {
                if (res.result) {
                    if (fileInputName != "") {
                        $("input[name='" + fileInputName + "']").val(res.file);
                        $("input[name='" + fileOriginalInputName + "']").val(res.originalName);
                    }
                    $(imgId).html("<img src='" + res.fileUrl + "?w=150&h=150&mode=crop'/>");
                } else {
                    alert(res.message);
                }
            }
        });
    });
}

function setBranchImageUploader(fileInputId, uploadUrl, fileInputName, fileOriginalInputName, imgId, appendImage, appendable) {
    $("body").on("change", fileInputId, function () {
        var file_data = $(fileInputId).prop("files")[0]; // Getting the properties of file from file field
        var form_data = new FormData();
        form_data.append("file", file_data);
        var file = form_data;
        $.ajax({
            url: uploadUrl,
            data: file,
            processData: false,
            contentType: false,
            dataType: 'json',
            type: 'POST',
            success: function (res) {
                if (fileInputName != "") {
                    $("input[name='" + fileInputName + "']").val(res.file);
                    $("input[name='" + fileOriginalInputName + "']").val(res.originalName);
                }
                $(imgId).children("img").attr("src", res.fileUrl + "?w=150&h=150&mode=crop");
                $(imgId).children("img").css("display", "block");
            }
        });
    });
}

function setSliderUploader(fileInputId, uploadUrl, imgId, isVideo, gridItemSelector) {
    $("body").on("change", fileInputId, function () {
        var file_data = $(fileInputId).prop("files")[0]; // Getting the properties of file from file field
        var form_data = new FormData();
        form_data.append("file", file_data);
        var file = form_data;
        $.ajax({
            url: uploadUrl,
            data: file,
            processData: false,
            contentType: false,
            dataType: 'json',
            type: 'POST',
            success: function (res) {
                if (!isVideo) {
                    $newItem = $("<div class=\"text-center updateable grid-item\" data-id=\"" + res.id + "\"><img class=\"card-display\" src='" + res.fileUrl + "?w=100&h=100&mode=crop'/></div>");
                    $(imgId).append($newItem);
                    $("#add-slider-modal").isotope('insert', $newItem);
                    $("#add-slider-modal").isotope("layout");
                    $(gridItemSelector).off();
                    $(gridItemSelector).click(function () {
                        selected($(this));
                    });
                } else {
                    $newItem = $("<div class=\"text-center updateable grid-item\" data-id=\"" + res.id + "\">" +
                                    "<video class=\"card-display\" width=\"100%\">" +
                                        "<source src=\"" + res.fileUrl + "\" type=\"" + res.videoType + "\">" +
                                        "Your browser does not support the video tag." +
                                    "</video>" +
                                "</div>");
                    $(imgId).append($newItem);
                    $("#add-slider-modal").isotope('insert', $newItem);
                    $("#add-slider-modal").isotope("layout");
                    $(gridItemSelector).off();
                    $(gridItemSelector).click(function () {
                        selected($(this));
                    });
                }
            }
        });
    });
}

function initDeleteModal(modalTitle, modalBodyStart, modalBodyFinish, deleteUrl, getName) {
    $(".del").click(function () {
            var id = $(this).attr("data-id");
            var element = $(this).parent().parent();
            var name = getName ? $(this).parent().parent().children(".name").text() : "";
            $(".modal-body").html(modalBodyStart + name + modalBodyFinish);
            $(".modal-title").text(modalTitle);
            $('#modalBox').modal('show');
			$(".delete").off();
            $(".delete").click(function () {
            $("#modalBox").modal('hide');
            $.post(deleteUrl, { id }, function() {
                element.hide();
            });
        });
    });
}

function selected(element) {
    var $el = $(element);
    $el.hasClass("selected") ? $el.removeClass("selected") : $el.addClass("selected");
}

function removeFromServer(removeUrl) {
    $(".selected").each(function () {
        var elem = $(this);
        $.post(
            removeUrl,
            { id: parseInt($(this).attr("data-id")) },
            function () {
                elem.remove();
                $("#add-slider-modal").isotope("remove", $(this)).isotope("layout");
                $("#add-slider-modal").isotope("layout");
            }
        );
    });
}

function toggleMob() {
    var nav = document.getElementsByClassName("mob-nav")[0];
    if (nav.style.maxHeight) {
        nav.style.maxHeight = null;
    } else {
        nav.style.maxHeight = nav.scrollHeight + "px";
    }
}