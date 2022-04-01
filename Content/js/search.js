var query;

function init(q) {
    query = q;
}

var searchOut = document.getElementById("search-field-out");
searchOut.onkeyup = function (e) {
    var event = e || window.event;
    var charCode = event.which || event.keyCode;

    if (charCode == '13') {
        $(".google-search input.gsc-search-button").click();
        return false;
    } else {
        $(".google-search input[name='search']").val(searchOut.value);
    }
};
$("#search-button").click(function () {
    $(".google-search input.gsc-search-button").click();
});

window.__gcse = {
    callback: function () {
        $(".google-search input[name='search']").val(query);
        $(".google-search input.gsc-search-button").click();
    }
}