
$(function () {

    $('[data-parallax="scroll"]').parallax();
    var slickNext = "<a type='button' class='slick-next'><img src='/Content/images/icons/rightArrow.png' alt=''></a>";
    var slickPrev = "<a type='button' class='slick-prev'><img src='/Content/images/icons/leftArrow.png' alt=''></a>";

   $(".slider").slick({
       autoplay: true,
       arrows: false,
       draggable: false,
       fade: true,
       speed: 5000
   });
    playVideos("slider-video");

    $("input[type='file']").on('change', function () {
    	checkFile(this, ['pdf', 'docx'], 25*1024*1024);
    });


    $('.to-top').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });

    $(".director-slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        draggable: false
    });

    $(".director-thumbs").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: slickPrev,
        nextArrow: slickNext
    });

    $(".branches-slider").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: slickPrev,
        nextArrow: slickNext,
    });
    $(".branch-slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        draggable: false
    });
    $(".branch-image-slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        draggable: false,
        accessibility: false
    });

    $(".inquire-slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        accessibility: false,
        arrows: false,
        fade: true,
        adaptiveHeight: true,
        draggable: false
    });

    var hiddenAbout = $("#hidden-about"), dots = $("#dots");
    if (hiddenAbout.length != 0) {
        var height = dots.position().top - hiddenAbout.offset().top + dots.height() + "px";
        hiddenAbout.css("max-height", height);
    }

    var rtime;
    var timeout = false;
    var delta = 200;

    function resizeend() {
        if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
        } else {
            timeout = false;
            $("#gallery-grid").isotope('layout');
        }
    }

    var galleryGrid = document.getElementById("gallery-grid");
    if (galleryGrid != null) {
        $("#gallery-grid").imagesLoaded(function () {
            $("#gallery-grid").isotope({
                itemSelector: ".grid-item",
                layoutMode: "fitRows"
            });
        });

        $(window).resize(function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(resizeend, delta);
            }
        });
    }

});

function endsWith(str) {
	var position = subjectString.length;
	position -= searchString.length;
	var lastIndex = subjectString.indexOf(searchString, position);
	return lastIndex !== -1 && lastIndex === position;
}

var fileFormatsMap = {docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", pdf: "application/pdf"};

function checkFile(file, ext_arr, maxsize)
{
 
    var good_ext = false;
    var good_size = false;
    var iSize = 0;
    var $file = $(file);

    // IE
    if(/*@cc_on!@*/false || !!document.documentMode)
    {
        var objFSO = new ActiveXObject("Scripting.FileSystemObject");
        var sPath = $(file)[0].value;
        var objFile = objFSO.getFile(sPath);
        iSize = objFile.size;
    }
    else
    {
        iSize = $file[0].files[0].size;
    }

    if(maxsize > iSize)
    {
        good_size = true;
    }

    for(i in ext_arr)
    {

        if(fileFormatsMap[ext_arr[i]] === $file[0].files[0].type)
        {

            good_ext = true; 
        }
    }

  
    if(!good_ext)
    {
      
        makeInputSpanAlert($file.parents(".input-parent"),"Invalid file extension! Use .pdf or .docx files." );
        $file.val("");
        return false;
    }


    if(!good_size)
    {
    	makeInputSpanAlert($file.parents(".input-parent"),"Invalid file size! Use no more than 25 MB file." )
        $file.val("");
        return false;
    }

    return false;
}

function makeInputSpanAlert(where, text) {
	var span = $("<span class='col-8 margin-none col-md-12'>"+text+"</span>");
	span.css({backgroundColor: "#DC4C46", position:"absolute", color: "white", padding: "10px", zIndex: 10, left: 0, top: 0, lineHeight: 2, height: "50px"})
		.mouseover(function () {
			$(this).fadeOut({complete: function () {
				$(this).remove();
			}})
		});
	where.prepend(span);
}

function scrollToAnchor(elem) {
    var aTag = $(elem);
    if (aTag.length)
        $('html,body').animate({ scrollTop: aTag.offset().top }, 'slow');
}

// for iPhones (autoplay not working)
function playVideos(videoClass) {
    var videos = document.getElementsByClassName(videoClass);
    for (var i = 0; i< videos.length; i++){
        videos[i].muted = true;
        videos[i].loop = true;
        if (videos[i].paused)
            videos[i].play();
    }
}

function openMenu(menu, source) {
    if (menu === undefined)
        $("#mob-nav-wrapper").fadeIn();
    else{
        var $newMenu = $("#"+menu), $oldMenu = $("#"+source);
        $oldMenu.removeClass("mob-nav-active");
        $newMenu.addClass("mob-nav-active");
    }
}
function closeMenu() {
    var $mainMenu = $("#mob-nav-main");
    if ($mainMenu.hasClass("mob-nav-active"))
        $("#mob-nav-wrapper").hide();
    else{
        var $oldMenu = $(".mob-nav-active");
        $oldMenu.removeClass("mob-nav-active");
        $mainMenu.addClass("mob-nav-active");
    }
}

function showHiddenAbout() {
    $("#hidden-about").css("max-height", "100%");
    $("#dots").remove();
    var $this = $(this);
    $this.addClass('animated bounceOutLeft');
    $this.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $this.remove();
    });
}

function showPreviousYearNews(url, year, previousNewsExistUrl) {
    var moreNews = false;
    $.post(
        previousNewsExistUrl,
        {
            currentYear: year
        },
        function (res) {
            moreNews = res.exist;

            $.post(
    url,
    {
        year: year
    },
    function (res) {
        $("#news-section").append(res);
        if (moreNews) {
            $("#news-section").append($("#read-more"));
        } else {
            $("#read-more").remove();
        }
    }
);
        }
    );
}



function showDirector() {
    $(".director-slider").slick("slickGoTo", +this.getAttribute("data-slick-index"));
}

function showBranch() {
    var $slider = $(".branch-slider");
    $slider.css("height", "100%");
    $slider.slick("slickGoTo", +this.parentNode.getAttribute("data-slick-index"));
}

function toSlide(index, slider) {
    $("."+slider).slick("slickGoTo", +index);
}

function toggleListView(parent) {
    var $listView = $(parent).find(".list-view-content");
    var $listArrow = $(parent).find(".list-view-arrow");
    if ($listView.css("display") === "none") {
        $listView.css("display", "flex");
        $listArrow.css("transform", "rotateZ(90deg)");
    }
    else {
        $listView.css("display", "none");
        $listArrow.css("transform", "none");
    }
}

function inquireActive(element){
    var $el = $(element);
    var active= "control-active";
    var $oldEl = $el.siblings("."+active);
    if(!$el.hasClass(active)){
        $oldEl.removeClass(active);
        $el.addClass(active);
        toSlide($el.attr("data-slick-index"), "inquire-slider");
        scrollToAnchor(".inquire-slider");
    }
}

function clickFile(inputId) {
    $("#"+inputId).click();
}

var searchOpened = false;
function openSearch() {
    var $s = $("#search");
    if(searchOpened) {
        $s.css("display", "none");
    }
    else {
        $s.removeAttr("style");
    }
    searchOpened = !searchOpened;
}

function openSearchMob() {
    closeMenu();
    if (!searchOpened){
        openSearch();
    }
}

function selectOption(elem, select, listView) {
    var $this = $(elem);
    var ind = $this.attr("data-option-index");
    $(select).find("option[data-option-index="+ind+"]").attr("selected", "selected");
    $(".list-view-heading").text($this.text());
    toggleListView(listView);
}

function isComplaints(flag) {
    if(flag){
        $(".compls").show();
        $(".non-compls").hide();
    }else{
        $(".non-compls").show();
        $(".compls").hide();
    }
}