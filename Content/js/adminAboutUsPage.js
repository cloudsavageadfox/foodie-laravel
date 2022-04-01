function fillEditInfoModal(element) {
    var itemId = element.parent().children(".grid-inner").children(".media-id-input").val();
    $("#edit-id").val(itemId);
    var name = element.parent().children(".grid-inner").children(".media-name-input").val();
    $("#edit-name").val(name);
    var surname = element.parent().children(".grid-inner").children(".media-surname-input").val();
    $("#edit-surname").val(surname);
    var role = element.parent().children(".grid-inner").children(".media-role-input").val();
    $("#edit-role").val(role);
    var paragraph = element.parent().children(".grid-inner").children(".media-paragraph-input").val();
    $("#edit-paragraph").val(paragraph);
    var facebook = element.parent().children(".grid-inner").children(".media-facebook-input").val();
    $("#edit-facebook").val(facebook);
    var twitter = element.parent().children(".grid-inner").children(".media-twitter-input").val();
    $("#edit-twitter").val(twitter);
    var instagram = element.parent().children(".grid-inner").children(".media-instagram-input").val();
    $("#edit-instagram").val(instagram);
    var website = element.parent().children(".grid-inner").children(".media-website-input").val();
    $("#edit-website").val(website);

    $("#edit-info-modal").modal("show");
}

function init(uploadUsualImageUrl, uploadSliderImageUrl, deleteImageUrl) {
    $('.edit-info').on('click', function () {
        fillEditInfoModal($(this));
    });

    $("#save-info").click(function () {
        var itemId = $("#edit-id").val();
        var item = $("input[value='" + itemId + "']").parent();
        var name = $("#edit-name").val();;
        item.children(".media-name-input").val(name);
        var surname = $("#edit-surname").val();
        item.children(".media-surname-input").val(surname);
        var role = $("#edit-role").val();
        item.children(".media-role-input").val(role);
        var paragraph = $("#edit-paragraph").val();
        item.children(".media-paragraph-input").val(paragraph);
        var facebook = $("#edit-facebook").val();
        item.children(".media-facebook-input").val(facebook);
        var twitter = $("#edit-twitter").val();
        item.children(".media-twitter-input").val(twitter);
        var instagram = $("#edit-instagram").val();
        item.children(".media-instagram-input").val(instagram);
        var website = $("#edit-website").val();
        item.children(".media-website-input").val(website);
        item.children("h3").text(name + " " + surname);
        item.children("h4").text(role);
        $("#edit-info-modal").modal("hide");
    });

    setFileUploader("#background1", uploadUsualImageUrl, "BackgroundImage1", "BackgroundOriginalName1", "#background1-img", false);
    setFileUploader("#background2", uploadUsualImageUrl, "BackgroundImage2", "BackgroundOriginalName2", "#background2-img", false);

    setSliderUploader("#photo", uploadSliderImageUrl, "#add-slider-modal", false, ".grid-inner");

    $("#remove-from-slider").click(function () {
        $("#slider-grid").children().each(function () {
            var divChild = $(this).children("div");
            if (!divChild.hasClass("selected")) {
                return;
            }
            var itemId = $(this).children(".media-id-input").attr("value");
            $("#add-slider-modal").children("div[data-id='" + itemId + "']").css("display", "block");
            $(this).remove();
            $("#slider-grid").isotope("remove", $(this)).isotope("layout");
        });
        $("#add-slider-modal").isotope("layout");
        $("#slider-grid").isotope("layout");
        $(".grid-inner").off();
        $(".grid-inner").click(function () {
            selected($(this));
        });
    });

    $("#add-to-slider").click(function () {
        $("#add-slider-modal").children(".selected").each(function () {
            var itemId = $(this).attr("data-id");
            $(this).removeClass("selected");
            $(this).css("display", "none");
            var imgSrc = $(this).children("img").attr("src");
            $newItem = $("<div class=\"text-center updateable grid-item\"></div>")
                .append($("<div class=\"text-center updateable grid-inner\"></div>").append("<img class=\"card-display\" src=\"" + imgSrc + "\" />" +
                "<input type=\"hidden\" value=\"" + itemId + "\" class=\"media-id-input\" name=\"SliderMediaIds\" />" +
                "<input type=\"hidden\" value=\"\" class=\"media-name-input\" name=\"SliderMediaNames\" />" +
                "<input type=\"hidden\" value=\"\" class=\"media-surname-input\" name=\"SliderMediaSurnames\" />" +
                "<input type=\"hidden\" value=\"\" class=\"media-role-input\" name=\"SliderMediaRoles\" />" +
                "<input type=\"hidden\" value=\"\" class=\"media-paragraph-input\" name=\"SliderMediaParagraphs\" />" +
                "<input type=\"hidden\" value=\"\" class=\"media-facebook-input\" name=\"SliderMediaFacebookLinks\" />" +
                "<input type=\"hidden\" value=\"\" class=\"media-twitter-input\" name=\"SliderMediaTwitterLinks\" />" +
                "<input type=\"hidden\" value=\"\" class=\"media-instagram-input\" name=\"SliderMediaInstagramLinks\" />" +
                "<input type=\"hidden\" value=\"\" class=\"media-website-input\" name=\"SliderMediaWebsiteLinks\" />" +
                "<h3></h3>" +
                "<h4></h4>"))
                .append("<a href=\"#\" class=\"edit-info\">Edit Info</a>");
            $("#slider-grid").append($newItem);
            $("#slider-grid").isotope('insert', $newItem);
            $(".edit-info").off();
            $(".edit-info").click(function () {
                fillEditInfoModal($(this));
            });
        });
        $("#add-slider-modal").isotope("layout");
        $("#slider-grid").isotope("layout");
        $(".grid-inner").off();
        $(".grid-inner").click(function () {
            selected($(this));
        });
    });

    $("#remove-from-server").click(function () {
        removeFromServer(deleteImageUrl);
    });

    $(".grid-inner").click(function () {
        selected($(this));
    });

    $(".grid-inner").imagesLoaded(function () {
        $("#add-slider-modal").isotope({
            itemSelector: ".grid-item",
            layoutMode: "fitRows"
        });

        $("#slider-grid").isotope({
            itemSelector: ".grid-item",
            layoutMode: "fitRows"
        });

        $("#add-slider-modal").isotope("layout");
        $("slider-grid").isotope("layout");
    });

    $('#choose-media-modal').on('shown.bs.modal', function () {
        $("#add-slider-modal").isotope("layout");
    });
}