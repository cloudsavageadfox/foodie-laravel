function init(deleteUrl, imageUploadUrl, videoUploadUrl, addVideoUrl, youtubeIconUrl) {
	$("#remove-from-slider").click(function () {
            $("#slider-grid").children(".selected").each(function () {
                var itemId = $(this).children(".media-id-input").attr("value");
                $("#add-slider-modal").children("div[data-id='" + itemId + "']").css("display", "block");
                $(this).remove();
                $("#slider-grid").isotope("remove", $(this)).isotope("layout");
            });
            $("#add-slider-modal").isotope("layout");
            $("#slider-grid").isotope("layout");
            $(".grid-item").off();
            $(".grid-item").click(function () {
                selected($(this));
            });
        });

        $("#add-to-slider").click(function () {
            $("#add-slider-modal").children(".selected").each(function () {
                var itemId = $(this).attr("data-id");
                $(this).removeClass("selected");
                $(this).css("display", "none");
                $newItem = $(this).clone().css("display", "block").append("<input type=\"hidden\" value=\"" + itemId + "\" class=\"media-id-input\" name=\"SliderMediaIds\" />");
                $("#slider-grid").append($newItem);
                $("#slider-grid").isotope('insert', $newItem);
            });
            $("#add-slider-modal").isotope("layout");
            $("#slider-grid").isotope("layout");
            $(".grid-item").off();
            $(".grid-item").click(function () {
                selected($(this));
            });
        });

        $("#remove-from-server").click(function () {
            removeFromServer(deleteUrl);
        });

        $(".grid-item").click(function () {
            selected($(this));
        });

        setSliderUploader("#photo", imageUploadUrl, "#add-slider-modal", false, ".grid-item");
        setSliderUploader("#video", videoUploadUrl, "#add-slider-modal", true, ".grid-item");

		$("#slider-grid").imagesLoaded(function () {
			$("#add-slider-modal").isotope({
				itemSelector: ".grid-item",
				layoutMode: "fitRows"
			});

			$("#slider-grid").isotope({
				itemSelector: ".grid-item",
				layoutMode: "fitRows"
			});
			
			$("#add-slider-modal").isotope("layout");
			$("#slider-grid").isotope("layout");
		});

        $('#choose-media-modal').on('shown.bs.modal', function () {
            $("#add-slider-modal").isotope("layout");
        });

        $("#video-url-btn").click(function () {
            var videoLink = $("#video-url").val();
            $("#video-url").val("");
            $("#add-video-url-modal").modal("hide");
            $.post(
                    addVideoUrl,
                    { url: videoLink },
                    function (res) {
                        $newItem = $("<div class=\"text-center updateable grid-item\" data-id=\"" + res.id + "\"><img class=\"card-display\" src='" + res.thumbnail + "?w=100&h=100&mode=crop'/>" + 
                            "<img src=\"" + youtubeIconUrl + "\" class=\"play-icon\" /></div>");
                        $("#add-slider-modal").append($newItem);
                        $("#add-slider-modal").isotope('insert', $newItem);
                        $("#add-slider-modal").isotope("layout");
                        $(".grid-item").off();
                        $(".grid-item").click(function () {
                            selected($(this));
                        });
                    }
            );
        });
}