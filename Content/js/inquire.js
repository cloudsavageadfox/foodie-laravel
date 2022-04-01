function initMap() {

    var pos = { lat: 14.549658, lng: 121.056205 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: pos
    });
    var marker = new google.maps.Marker({
        position: pos,
        map: map
    });
}

$(document).ready(function () {
    $("#submit-careers").click(function (e) {
        e.preventDefault();

        sendCareersMessage();
    });

    $("#submit-franchise").click(function (e) {
        e.preventDefault();

        sendFranchiseMessage();
    });

    $("#submit-customer-care").click(function (e) {
        e.preventDefault();

        sendCustomerCareMessage();
    });

    $("body").on("change", "#file-01", function () {
        $("#file-01-name").val($('#file-01').val().split('\\').pop());
    });

    /*$("body").on("change", "#file-02", function () {
        $("#file-02-name").val($('#file-02').val().split('\\').pop());
    });*/

    $("body").on("change", "#file-11", function () {
        $("#file-11-name").val($('#file-11').val().split('\\').pop());
    });

    $("body").on("change", "#file-12", function () {
        $("#file-12-name").val($('#file-12').val().split('\\').pop());
    });
});

var sendCustomerCareUrl;
var sendFranchiseUrl;
var sendCareersUrl;

function init(url1, url2, url3) {
    sendCareersUrl = url1;
    sendFranchiseUrl = url2;
    sendCustomerCareUrl = url3;
}

function sendCustomerCareMessage() {
    var form_data = new FormData();

    var helpTopic = $("#cities").val();
    var complaints = "";
    var subject = "";
    if (helpTopic == "Complaints") {
        complaints = $("#complaints").val();
    } else {
        subject = $("#customer-care-subject").val().trim();
        if (subject == "") {
            alert("Please enter a subject!");

            return;
        }
    }

    var name = $("#customer-care-name").val();
    var lastName = $("#customer-care-last-name").val();
    var email = $("#customer-care-email").val();
    var phone = $("#customer-care-phone").val();
    var message = $("#customer-care-message").val();
    form_data.append("Name", name);
    form_data.append("LastName", lastName);
    form_data.append("Email", email);
    form_data.append("Subject", subject);
    form_data.append("Message", message);
    form_data.append("HelpTopic", helpTopic);
    form_data.append("Phone", phone);
    form_data.append("Complaints", complaints);

    var files = form_data;
    var sucees = false;
    $.ajax({
        url: sendCustomerCareUrl,
        type: 'POST',
        data: files,
        processData: false,
        contentType: false,
        success: function () {
            
            debugger
            sucees = true;
            $("#customer-care-name").val('');
            $("#customer-care-last-name").val('');
            $("#customer-care-email").val('');
            $("#customer-care-phone").val('');
            $("#customer-care-message").val('');          
            var listView = '#cities-list-view';
            var select = '#cities';           
            $("#h5Cust").text('Select a help topic');
            $("#brandFranchise").text('Brands Dropdown');
            $("#h5brand").text('Brands Dropdown');
            $("#customer-care-name").attr("style", "border:#cdcdcd 2px double");
            $("#customer-care-last-name").attr("style", "border:#cdcdcd 2px double");
            $("#customer-care-email").attr("style", "border:#cdcdcd 2px double");
            $("#customer-care-phone").attr("style", "border:#cdcdcd 2px double");
            $("#customer-care-message").attr("style", "border:#cdcdcd 2px double");

            $("#compls-list-view").attr("style", "display:none");

            $("#compls-list-view").attr("style", "display:none");
            $("#div_subject").attr("style", "display:block !important");

            $("#loadingDiv").removeClass("clsshow");
            $("#loadingDiv").addClass("clshide");
          //  $("#submit-customer-care").attr("disabled", "false");

        },
        error: function (response) {
            debugger;
            alert('eror');
            $("#loadingDiv").addClass("clshide");
            $("#loadingDiv").removeClass("clsshow");
        }
    });

   
    // $("#submit-customer-care").attr("disabled", "disabled");
    $("#loadingDiv").removeClass("clshide");
    $("#loadingDiv").addClass("clsshow");
   // alert("The mail is being sent, please wait");

    return false;
}

function sendFranchiseMessage() {
    var file_data = $("#file-11").prop("files")[0]; // Getting the properties of file from file field
    var form_data = new FormData();
    form_data.append("Application", file_data);

    file_data = $("#file-12").prop("files")[0]; // Getting the properties of file from file field
    form_data.append("Letter", file_data);

    var name = $("#franchise-name").val();
    var lastName = $("#franchise-last-name").val();
    var email = $("#franchise-email").val();
    var phone = $("#franchise-phone").val();
    var brand = $("#brands").val();
    var message = $("#franchise-message").val();
    form_data.append("Name", name);
    form_data.append("LastName", lastName);
    form_data.append("Email", email);
    form_data.append("Brand", brand);
    form_data.append("Message", message);
    form_data.append("Phone", phone);

    var files = form_data;
    $.ajax({
        url: sendFranchiseUrl,
        type: 'POST',
        data: files,
        processData: false,
        contentType: false,
        success: function (res) {
            $("#loadingDiv").removeClass("clsshow");
            $("#loadingDiv").addClass("clshide");
            $("#h5Cust").text('Select a help topic');
            $("#brandFranchise").text('Brands Dropdown');
            $("#h5brand").text('Brands Dropdown');
             $("#franchise-name").val('');
             $("#franchise-last-name").val('');
             $("#franchise-email").val('');
             $("#franchise-phone").val('');
             $("#brands").val('');
            $("#franchise-message").val('');
        },
        error: function (response) {
            debugger;
            alert('eror');
            $("#loadingDiv").addClass("clshide");
            $("#loadingDiv").removeClass("clsshow");
        }
    });

    $("#submit-franchise").attr("disabled", "disabled");

    $("#loadingDiv").removeClass("clshide");
    $("#loadingDiv").addClass("clsshow");

    return false;
}

function sendCareersMessage() {
    var file_data = $("#file-01").prop("files")[0]; // Getting the properties of file from file field
    var form_data = new FormData();
    form_data.append("Resume", file_data);

    /*file_data = $("#file-02").prop("files")[0]; // Getting the properties of file from file field
    form_data.append("Letter", file_data);*/
    var brand = $("#brandsCareers").val();
    
    
    var name = $("#careers-name").val();
    var lastName = $("#careers-last-name").val();
    var email = $("#careers-email").val();
    var phone = $("#careers-phone").val();
    var position = $("#careers-position").val();
    var message = $("#careers-message").val();
    form_data.append("Brand", brand);
    form_data.append("Name", name);
    form_data.append("LastName", lastName);
    form_data.append("Email", email);
    form_data.append("Position", position);
    form_data.append("Message", message);
    form_data.append("Phone", phone);

    var files = form_data;
    
    $.ajax({
        url: sendCareersUrl,
        type: 'POST',
        data: files,
        processData: false,
        contentType: false,
        success: function (res) {
            $("#loadingDiv").removeClass("clsshow");
            $("#loadingDiv").addClass("clshide");
            $("#h5Cust").text('Select a help topic');
            $("#brandFranchise").text('Brands Dropdown');
            $("#h5brand").text('Brands Dropdown');
             $("#careers-name").val('');
             $("#careers-last-name").val('');
             $("#careers-email").val('');
             $("#careers-phone").val('');
             $("#careers-position").val('');
             $("#careers-message").val('');
        },
        error: function (response) {
            debugger;
            alert('eror');
            $("#loadingDiv").addClass("clshide");
            $("#loadingDiv").removeClass("clsshow");
        }
    });

    $("#submit-careers").attr("disabled", "disabled");

    $("#loadingDiv").removeClass("clshide");
    $("#loadingDiv").addClass("clsshow");

    return false;
}