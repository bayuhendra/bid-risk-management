$.ajaxSetup({
    beforeSend: function (xhr) {
        xhr.setRequestHeader("JXID", getJxid());
    }
});

/* General Functions */
var formatNull = function (value, row, index) {
    if (value == null || value == '') {
        return '-';
    }
    return value;
}

const setMessage = function (message, level) {
    if (!level) {
        level = 'success'
    }

    var messageHtml =
       `<div class="alert alert-${level} alert-dismissable">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">${message}</button>&times;
        </div>`;
    
    $('.alert-dismissable').remove();

    $('section.content').prepend(messageHtml);
}

const sessionIsExpired = data => {
    if (data.status == 1) {
        return false;
    }
    if (!data.message) {
        return false;
    }
    var message = data.message;

    if (!message.authorization) {
        return false;
    }

    if (message.authorization.toLowerCase() != 'invalid request') {
        return false;
    }
    if (message.authentication.toLowerCase() != 'invalid request') {
        return false;
    }
    return true;
}

const postRequest = function (url, data, success, options) {

    var successWrapper = data => {
        if (sessionIsExpired(data)) {
            window.location.href = "/web-jdc-project-management/login.html";
            return;
        }
        if (success) {
            success(data);
        }
    }

    var ajaxOptions = {
        type: 'POST',
        url: url,
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: successWrapper
    };

    if (options != null) {
        for (property in options) {
            ajaxOptions[property] = options[property];
        }
    }
    if (data) {
        if (typeof data == 'object') {
            data = JSON.stringify(data);
        }
        ajaxOptions.data = data;
    }
    $.ajax(ajaxOptions);
}


const loadSelect = function (selectId, selectName, selectElement, options) {

    var processResult = function (res) {
        var optionHtml = `<option value="">-- Select ${selectName} --</option>`;
        var valueField = 'commonkey';
        var textField = 'commdesc1';
        if (options) {
            if (options.valueField) {
                valueField = options.valueField;
            }
            if (options.textField) {
                textField = options.textField;
            }
        }

        if (res.data) {

            var data = res.data;
            data = data.map(datum => `<option value="${datum[valueField]}">${datum[textField]}</option>`);
            optionHtml += data.join('');
            $(selectElement).html(optionHtml);
        }
        ;
    };

    if (typeof selectId == 'object') {
        selectId = JSON.stringify(selectId);
    }

    var ajaxOptions = {
        type: 'POST',
        url: '/svc-jdc-foundation/rest/jdc/fnd001/get-data-settings',
        contentType: 'application/json',
        dataType: 'json',
        data: selectId,
        async: false,
        success: processResult
    };

    if (options) {
        for (property in options) {
            ajaxOptions[property] = options[property];
        }
    }

    $.ajax(ajaxOptions);
};

/* User stuffs */

var userData = {};

const renderUserDetail = data => {
    if (data.data) {
        data = data.data;
    }
    if (data.forEach) {
        data = data[0];
        userData = data;
    }
    $(".user-fullname").text(data.fullname);
    $(".user-npk").text(data.npk);
    $(".user-avatar").attr("src", `https://ui-avatars.com/api/?name=${data.fullname}`);
};

const loadUserData = function () {
    let email = localStorage.email;
    if (!email) {
        window.location = "login.htm";
    }

    var url = "/svc-jdc-user-management/rest/jdc/uam001/get-all";
    var data = {
        search: {
            any: email
        }
    };
    postRequest(url, data, renderUserDetail, {async: true});
};

var logout = function () {
    let processSuccess = data => {
        if (data.status == "1") {
            localStorage.clear();
            document.cookie = "JXID=;expires=Thu, 01 JAN 1970 00:00:01 GMT; path=/;";
            window.location = "login.html";
        }
    };

    let url = "/svc-jdc-dashboard/rest/jdc/dsh000/logout";
    postRequest(url, null, processSuccess);
}

/* Task List */


const renderTaskList = data => {
    if (data.data) {
        data = data.data;
    }

    let length = data.length;

    if (length == 0) {
        return;
    }

    let showMore = false;

    if (length > 5) {
        data = data.slice(0, 5);
        showMore = true;
    }

    $('#tasklist-button').append(`<span class="label label-warning">${length}</span>`);

    let taskListContainer = $('#tasklist-items');

    taskListContainer.empty();
    let message = `You have ${length} notification`;

    if (length > 1) {
        message += "s";
    }
    taskListContainer.append(`<li class="header">${message}</li>`);

    let taskListItemsElement = $(`<li><ul class="menu"></ul></li>`).appendTo(taskListContainer);

    let taskListMenu = taskListItemsElement.find('.menu');

    data.forEach(datum => {
        let taskListItemElement = $('<li></li>').appendTo(taskListMenu);
        let taskListLink = $(
                `<a href="#">
            <i class="fa fa-users text-aqua"></i>${datum.taskDesc}
        </a>`).appendTo(taskListItemElement);
        taskListLink.on('click', loadPage.bind(this, 'JDCFND003', {idTask: datum.idTask}));
    });

    let taskListItemElement = $('<li class="footer"></li>').appendTo(taskListContainer);
    let taskListLink = $('<a href="#">View All</a>').appendTo(taskListItemElement);
    taskListLink.on('click', loadPage.bind(this, 'JDCFND003', null));

    taskListContainer.append(taskListItemElement);
}

const loadTaskList = function () {
    let url = "/svc-jdc-project-management/rest/jdc/pmg000/search-task-list";
    let data = {search: {"=email": localStorage.email}};
    postRequest(url, data, renderTaskList);
}

const findBootstrapEnvironment = function () {
    var envs = ['xs', 'sm', 'md', 'lg'];
    
    var $el = $('<div>');
    $el.appendTo($('body'));

    for (var i = envs.length - 1; i >= 0; i--) {
        var env = envs[i];

        $el.addClass('hidden-' + env);
        if ($el.is(':hidden')) {
            $el.remove();
            return env;
        }
    }
}

var projectTypes = {
    'PM': '001',
    'PRJ': '001',
    'OM': '002',
    'OPR': '002'
};

var getProjectType = function () {
    return projectTypes[localStorage.projectUserRole];
}

var showModalMessage = function (text, buttons) {
    var defaultAction = function () {
        $('#modal-message').modal('hide');
    };
    if (!buttons) {
        buttons = [{text: 'OK'}];
    }
    $('#modal-message-text').html(text);
    var modalMessageButtonsElement = $('#modal-message-buttons');
    modalMessageButtonsElement.empty();

    buttons.forEach(button => {
        var buttonElement = $(`<button type="button" class="btn btn-default btn-primary large-button"/>`);
        buttonElement.text(button.text);
        if (button.action) {
            buttonElement.on('click', function () {
                button.action();
                defaultAction();
            });
        } else {
            buttonElement.on('click', defaultAction);
        }
        modalMessageButtonsElement.append(buttonElement);
    });
    $('#modal-message').modal('show');
};