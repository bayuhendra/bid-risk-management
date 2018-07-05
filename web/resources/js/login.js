//var baseURL = "/jdcdsmun000-rest/rest";

function recursive_menu(menu_obj, array_data, html_string) {
    var menu_childs = new Array();
    html_string += '<ul style="display: none;">';
    $.each(array_data, function (key, value) {
        if (value.vparent == menu_obj.menuId) {
            var menu_child_obj = new Object();
            menu_child_obj.menuId = value.vid;
            menu_child_obj.menuName = value.vtitle;
            if (value.vapplicationId == "null") {
                html_string += '<li class="menu treeview transition">' +
                        '<a>' +
                        '<i class="glyphicon glyphicon-eye-open"></i> <span>' + value.vtitle + '</span>' +
                        '<i class="glyphicon glyphicon-chevron-down icon-menu-expand" style="float:right"></i>' +
                        '</a>';
                html_string = recursive_menu(menu_child_obj, array_data, html_string);
                html_string += '</li>';
            } else {
                html_string += '<li class="menu transition">' +
                        '<a data-formid="' + value.vurl + '">' +
                        '<i class="glyphicon glyphicon-circle-o">' +
                        '</i>' + value.vtitle +
                        '</a>' +
                        '</li>';
            }

            menu_childs.push(menu_child_obj);

        }
    });
    if (menu_childs.length > 0) {
        menu_obj.menuChilds = menu_childs;
    }
    html_string += '</ul>';
    return html_string;
}

function login(event) {
    event.preventDefault();
    var user = $('#username').val();
    var password = $('#password').val();

    $('#alert-error').hide();
    $('button[type=submit]').html(
            '<svg width="20px"  height="20px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;">' +
            '<circle cx="50" cy="50" fill="none" stroke="#a5a6a0" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
            '<animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform> ' +
            '</circle> ' +
            '</svg>'
            );

    var ajaxOptions = {
        type: "POST",
        url: "/svc-jdc-dashboard/rest/jdc/dsh000/login",
        contentType: "application/json",
        dataType: 'json',
        headers: {
            "Authorization": "Basic " + btoa(user + ":" + password)
        },
        data: JSON.stringify({})
    };

    var processResult = function (data) {
        $('button[type=submit]').html('Sign In');
        if (data.status === "1") {
            var message = data.message;
            
            localStorage.setItem("role", message.role);
            localStorage.setItem("fullname", message.fullname);
            localStorage.setItem("message", message.message);
            localStorage.setItem("email", message.email);
            localStorage.setItem("username", message.username);
            
            if(message.role=='ADM'){                
                window.location = "index.html#/admin-welcome";
            } else {
                window.location = "index.html#/dashboard";
            }            
        } else {
            $('#alert-error').show();
        }
    };

    $.ajax(ajaxOptions).done(processResult);
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function emailvalidation() {
    $("#resultjdcCandidate012p01email").text("");
    $("#resultjdcCandidate012p01password").text("");
    var email = $("#username").val();
    var password = $("#password").val();

    if (email == "") {

        $("#resultjdcCandidate012p01email").text("Mohon masukan email anda");
        $("#resultjdcCandidate012p01email").css("color", "red");
        document.getElementById("username").style.border = "1px solid red";
        $('#error-login').hide();

    } else if (email != "" && (validateEmail(email) == false)) {
        $("#resultjdcCandidate012p01email").text("email tidak valid");
        $("#resultjdcCandidate012p01email").css("color", "red");
        document.getElementById("username").style.border = "1px solid red";
        $('#error-login').hide();
    }

    if (password == "") {
        $("#resultjdcCandidate012p01password").text("Mohon masukan password anda");
        $("#resultjdcCandidate012p01password").css("color", "red");
        document.getElementById("password").style.border = "1px solid red";
        $('#error-login').hide();
    } else if (password != "" && email == "") {
        $("#resultjdcCandidate012p01email").text("Mohon masukan email anda");
        $("#resultjdcCandidate012p01email").css("color", "red");
        document.getElementById("username").style.border = "1px solid red";
        $('#error-login').hide();
    } else {
        $('#error-login').slideDown();
        document.getElementById("username").style.border = "1px solid red";
        document.getElementById("password").style.border = "1px solid red";
    }
}