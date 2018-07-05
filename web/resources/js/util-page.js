var directPages = [];
var pageParameters = {};

const loadDirectPages = function (data) {
    directPages = ['404', 'admin-welcome', 'dashboard'];
    if (!data) {
        postRequest("/svc-jdc-dashboard/rest/jdc/dsh000/menu-role", 'ADM', loadDirectPages);
        return;
    }

    data = data.data;
    data.forEach(datum => {
        directPages.push(datum.vid);
    });
}

const isDirectPage = function (page) {
    var result = false;
    directPages.forEach(directPage => {
        if (page.includes(directPage)) {
            result = true
        }
    });
    return result;
}

const loadPage = (page, parameters) => {
    $('#loader').fadeIn();
    pageParameters = {};
    var newUrl = window.location.href;
    newUrl = newUrl.replace(/index\.html.*/, `index.html#/${page}`)

    if (!page) {
        page = 'dashboard';
    }

    //Object Based Parameter
    if (parameters) {
        pageParameters = parameters;
        var paramString = [];
        for (var property in pageParameters) {
            if (pageParameters.hasOwnProperty(property)) {
                paramString.push(`${property}=${pageParameters[property]}`);
            }
        }
        newUrl += '?' + paramString.join('&');
    }

    //String Based Parameter
    if (page.match(/\?/)) {
        var paramString = page.replace(/.*\?/, '');
        var paramPairs = paramString.split('&');
        paramPairs.forEach(paramPair => {
            paramPair = paramPair.split("=");
            pageParameters[paramPair[0]] = paramPair[1];
        });
        page = page.replace(/\?.*/, '');
    }

    //Check whether or not the page can bypass dashboard.
    if (!isDirectPage(page)) {
        if (!localStorage.getItem("projectNumber")) {
            page = 'dashboard';
            pageParameters = {message: "You have to select a project first."};
        } else {
            $('#menuitem-dashboard').show();
            loadMenu(localStorage.projectUserRole);
        }
    } else {
        loadMenu(localStorage.userRole);
    }

    if (page != 'dashboard') {
        $("#menu-container").show();
        $("#menu-toggler").show();
    } else {
        $("#menu-container").hide();
        $("#menu-toggler").hide();
    }

    let renderPage = function (data) {
        $('#page').html(data);
        window.history.pushState(null, null, newUrl);
        if (window.readyFunction) {
            window.readyFunction();

            $(".project-name").text(localStorage.projectName);
            $(".project-number").text(localStorage.projectNumber);
            $(".project-name").show();

            $('#loader').fadeOut();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            callLov()
        } else {
            $('#loader').fadeOut();
        }

        if ($('#menu-container').is(':visible')) {
            $("#menu-toggler,#menu-container,#menu-project-name").fadeIn();
            if (findBootstrapEnvironment() != 'xs') {
                $('#page').css("margin-left", 230);
            }
        }

        if (localStorage.projectName) {
            $('#menuitem-dashboard').show();
        }
    }

    let ajaxOptions = {
        url: 'pages/' + page + '.html'
        , success: renderPage
        , error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.status == 404) {
                loadPage('404');
            }
        }
    }

    $.ajax(ajaxOptions);
}

var downloadPmgTemplate = function () {
    if (!window.pmgTemplateUrl) {
        console.error('Please define download template URL first!');
        return;
    }

    if (!localStorage.projectNumber) {
        console.error('Cannot find project number!');
        return;
    }

    var processResult = function (result) {
        if (!result.data) {
            console.error('Error in getting download link');
            return;
        }
        var data = result.data;
        if (data.length == 0) {
            console.error('Error in getting download link');
            return;
        }
        console.log(data[0]);
        window.open(`${window.origin}/${data[0]}`, '_blank');
    }

    var payload = {
        dataList: [],
        search: {
            "=projectNumber": localStorage.projectNumber,
            "=projectType": getProjectType()
        }
    }
    postRequest(pmgTemplateUrl, payload, processResult);
}

function callLov() {
    $('.lookup').each(function () {
        var isBindFunc = false;
        var thisLookup = $(this);
        var obj = $(this).parent();
        var url = $(this).data("url");
        var data_func = $(this).data("lookup-pre-func");
        var data_func_change = $(this).data("lookup-change-func");
        var data_bind_func = $(this).data('lookup-bind-func');
        if (data_bind_func != undefined) {
            if (data_bind_func != '') {
                var data_bind_func_f = window[data_bind_func];
                if (typeof (data_bind_func_f) == 'function') {
                    isBindFunc = true;
                }
            }
        }
        var tableId = generateUUID();
        var htmlVal = "<div class='lookup-form'><table id=" + tableId + " data-method='post' data-url=" + url + " data-content-type='application/json' data-data-type='json' data-query-params-type='limit' data-query-params='" + data_func + "' data-response-handler='loadData' data-side-pagination='server' data-pagination='true'>	<thead>	<tr>";
        var data_callback = $(this).data("callback");
        var columns = $(this).data("columns");

        $.each(columns, function (index, element) {
            htmlVal += "<th data-field='" + element.id + "' data-sortable='" + element.sortable + "' data-visible='" + element.visible + "'>" + element.name + "</th>";
        });
        obj.append(htmlVal);

        if ($(this).find('.input-lookup').attr('id') == undefined) {
            $(this).find('.input-lookup').attr('id', generateUUID());
        }


        $('#' + tableId).bootstrapTable();
        var firstTime = true;
        var fromButton = false;
        $('#' + tableId).on('post-body.bs.table', function (e) {
            if (!isBindFunc) {
                var value_changed = false;
                if (!firstTime && !fromButton) {
                    var data = $('#' + tableId).bootstrapTable('getData', 'useCurrentPage');
                    //console.log(data);
                    if (data.length == 1) {
                        $.each(data_callback, function (key, val) {
                            if ($(':input[name="' + key + '"]').length > 1) {

                                $.each($(':input[name="' + key + '"]'), function (i, v) {
                                    if (data.data != undefined && data.data != null) {
                                        if (data.data.length > 0) {
                                            if ($(this).val() == data.data[0][val]) {
                                                $(this).attr('checked', true);
                                            }
                                        }

                                    }

                                });
                            } else {
                                if (data.data != undefined && data.data != null) {
                                    if (data.data.length > 0) {
                                        if ($('#' + key).val() != data.data[0][val]) {
                                            value_changed = true;
                                        }
                                    }
                                    $('#' + key).val(data.data[0][val]);
                                }
                            }
                        });
                        $(obj).find('.lookup-form').slideDown();

                    } else if (data.length == 0) {
                        $(obj).find('.lookup-form').slideDown();
                        $.each(data_callback, function (key, val) {
                            value_changed = true;
                            $('#' + key).val('');
                        });

                    } else {
                        $(obj).find('.lookup-form').slideDown();
                    }
                }
                if (value_changed) {
                    var data_func_change_f = window[data_func_change];
                    if (typeof (data_func_change_f) == 'function') {
                        data_func_change_f();
                    }
                }
            } else {
                if (!firstTime && !fromButton) {
                    $(obj).find('.lookup-form').slideDown();
                }
            }
        });

        $(this).find('.input-lookup').keyup(function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                firstTime = false;
                fromButton = false;
                $('#' + tableId).bootstrapTable('refresh');

            }, 500);

        })

        $(this).find('.btn-lookup').click(function () {
            clearTimeout(timeout);
            firstTime = false;
            fromButton = true;
            if ($(obj).find('.lookup-form').is(":visible")) {
                $(obj).find('.lookup-form').slideUp();
            } else {
                $('#' + tableId).bootstrapTable('refresh');
                $(obj).find('.lookup-form').slideDown();
            }


        })


        $('#' + tableId).on('click-row.bs.table', function (e, row, $element) {
            if (!isBindFunc) {
                $(obj).find('.lookup-form').slideUp();
                var value_changed = false;
                $.each(data_callback, function (key, val) {
                    if ($('input[name="' + key + '"]').length > 1) {
                        $.each($('input[name="' + key + '"]'), function (i, v) {
                            if ($(this).val() == row[val]) {
                                $(this).attr('checked', true);
                            }
                        });
                    } else {
                        if ($('#' + key).val() != row[val]) {
                            value_changed = true;
                        }

                        $('#' + key).val(row[val]);
                    }
                });
                if (value_changed) {
                    var data_func_change_f = window[data_func_change];
                    if (typeof (data_func_change_f) == 'function') {
                        data_func_change_f();
                    }
                }
            } else {
                data_bind_func_f(row);
                var inputLookup = thisLookup.find('.input-lookup');
                //console.log(inputLookup.val());
                var valLength = inputLookup.val().length * 2;
                inputLookup[0].setSelectionRange(valLength, valLength);
            }

        })
    });
}

const linkRangedDatePickers = function (id) {

    var startPicker = $(`#${id}-start`);
    var endPicker = $(`#${id}-end`);

    startPicker.on("dp.change", function (e) {
        if (e.date === null || e.date === '') {
            endPicker.data("DateTimePicker").minDate(new Date(-8640000000000000));
        } else {
            endPicker.data("DateTimePicker").minDate(e.date);
        }
    });

    endPicker.on("dp.change", function (e) {
        if (e.date === null || e.date === '') {
            startPicker.data("DateTimePicker").maxDate(new Date(8640000000000000));
        } else {
            startPicker.data("DateTimePicker").maxDate(e.date);
        }
    });
}

const returnToDashboard = function () {
    loadPage('dashboard', {
        projectNumber: localStorage.projectNumber,
        projectType: localStorage.projectType
    });
}