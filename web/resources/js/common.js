var form_path = "forms/";
var form_ext = ".htm";
var form_change_password = "change_pass";
var timeout;
var username;
var token;
var updateData = [];
var lastRequest;

var baseColorBookmark = new Array('#888888', '#888888', '#888888', '#888888', '#888888');
var bookmarkSameBaseColor = 4;
var bookmarkedApps = [];
var MAX_VALUE_DATE = 8640000000000000;
var MIN_VALUE_DATE = -8640000000000000;
var post_form_wc = false;

console.log('CONNECTED');

$(document).ajaxSend(function (event, request, settings) {
    $('div.modal').each(function () {
        if ($(this).is(':visible')) {
            $(this).find('.modal-content').before('<div id="container_ajax_loader"></div>');
        }
    });

    $('#loading-indicator').show();
});

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
$(document).ajaxComplete(
        function (event, request, settings) {
            $('#loading-indicator').hide();
            $('div#container_ajax_loader').remove();

            var popUpHtm = $(location).attr('href').split("/");
            if (popUpHtm[popUpHtm.length - 1].indexOf('dashboard.htm') === -1) {
                var responseText = request.responseJSON;
                var resText = false;
                if (request.responseJSON !== undefined) {
                    responseText = request.responseJSON;
                } else {
                    responseText = request.responseText;
                    resText = true;
                }

                if (responseText !== undefined) {
                    if (isJson(responseText)) {
                        if (resText) {
                            responseText = JSON.parse(responseText);
                        }


                        if ((responseText.status === '0') && (responseText.message.authentication === "Invalid Request")) {

                            if ((getParameterByName('page') == 'daftar_pekerjaan' || getParameterByName('page') == '')) {
                                var urlIndex = false;
                                if (typeof settings.data !== 'undefined' && settings.data.length > 0 && settings.data != '' && isJson(settings.data)) {
                                    var dataJsonCheck = JSON.parse(settings.data);
                                    if (typeof dataJsonCheck.urlIndex !== 'undefined') {
                                        urlIndex = dataJsonCheck.urlIndex;
                                    }
                                }
                                if (urlIndex == false) {
                                    var queryString = '';
                                    if (getParameterByName('VA')) {
                                        queryString = '?VA=' + getParameterByName('VA');
                                    }
                                    localStorage.setItem("expiredSess", "true");
                                    window.location = window.location.origin + "/index.htm" + queryString;
                                } else {
                                    $('header').find('.login-outer').slideDown();
                                    lastRequest = settings;
                                }

                            } else {
                                $('header').find('.login-outer').slideDown();
                                lastRequest = settings;
                            }

                        }
                    }
                }

            } else {
                var responseText = request.responseJSON;
                if (responseText != undefined) {

                    if ((responseText.status == '0') && (responseText.message.authentication == "Invalid Request")) {
                        $('.jdc .login-outer').slideDown();
                        lastRequest = settings;
                    }
                }
            }
        }
);

$(document).mouseup(
        function (e) {
            var slideUp = true;
            var lookupVisible = $('.lookup-form:visible');
            var lookupWrapperVisible = $('.lookup-wrapper:has(.lookup-form:visible)');

            if ($(e.target).closest('.lookup-form').hasClass('lookup-form')) {
                if (lookupVisible.length > 0) {
                    if ($(e.target).closest('.lookup-form').is(lookupVisible)) {
                        slideUp = false;
                    }

                }
            }

            if ($(e.target).hasClass('input-lookup')) {
                if (lookupWrapperVisible.length > 0) {
                    if ($(e.target).is($('.input-lookup', lookupWrapperVisible))) {
                        slideUp = false;
                    }
                }

            }
            /*
             if($(e.target).hasClass('btn-lookup') && $(e.target) == $('.btn-lookup', lookupVisible)){
             slideUp = false;
             }*/

            if (slideUp) {
                $('.lookup-form').slideUp();
            }
        }
);

function search_prepare() {
    $('.mainmenu > ul li').each(function () {
        $(this).data('keys', $(this).text().toLowerCase().replace(/[\s\r\n]+/g, '|'));
    });
    $('.mainmenu-search input.form-control').keyup(search_crawl);
}

function search_crawl() {
    var key = $('.mainmenu-search input.form-control').val().toLowerCase();
    if (key == '') {
        $('.mainmenu li.treeview').removeClass('active');
        $('.mainmenu li.treeview a').children('.icon-menu-expand').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        $('.mainmenu li.treeview').show();
        $('.mainmenu ul.treeview-menu').hide();
        $('.mainmenu > ul li').show();
    } else {
        $('.mainmenu li.treeview').addClass('active');
        $('.mainmenu li.treeview a').children('.icon-menu-expand').addClass('glyphicon-chevron-up').removeClass('glyphicon-chevron-down');
        $('.mainmenu > ul li').hide();
        $('.mainmenu > ul li:contains("' + key + '"), .mainmenu ul.treeview-menu').children('.icon-menu-expand').addClass('glyphicon-chevron-up').removeClass('glyphicon-chevron-down');
        $('.mainmenu > ul li:contains("' + key + '"), .mainmenu ul.treeview-menu').show();
    }
}

$.expr[":"].contains = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

function listener_tabNav() {
    if ($('.nav-tabs-container .nav-tabs')[0] != undefined) {
        var ww = $('.nav-tabs-container .nav-tabs')[0].scrollWidth;
        if (ww > $('.nav-tabs-container .nav-tabs').width()) {
            $('.nav-tabs-container .nav-tabs').css('margin-right', '65px');
            $('.nav-tabs-scroller').show();
        } else {
            $('.nav-tabs-container .nav-tabs').css('margin-right', '0');
            $('.nav-tabs-scroller').hide();
        }
    }
}

function scrollTabNav(dir) {
    var obj = $('.nav-tabs-container .nav-tabs');
    obj.animate({
        scrollLeft: (dir == 'left' ? '-=100' : '+=100')
    });
}

function removeTab(obj) {
    var li = $(obj).closest('li');
    var prevli = li.prev();
    var siblingli = li.siblings();
    var hasActive = false;
    $.each(siblingli, function () {
        if ($(this).hasClass('active')) {
            hasActive = true;
        }
    })
    if (!hasActive) {
        prevli.addClass('active');
        var prevFormId = prevli.data('formid');
        if (prevFormId != null) {
            $('#tabpanel_' + prevFormId).addClass('active');
        } else {
            $('#default_home').addClass('active');
        }
    }

    var id = li.data('formid');
    $('#tabpanel_' + id + ', #tablink_' + id).remove();
}

function menu_collapse(obj) {
    $('body').toggleClass('collapsed');
    $('.icon-toolbar', obj).toggleClass('flipX');
    return false;
}

function edit_custom_action(obj) {
    var hasEdit = false;

    var editAction;

    if ($(obj).data("custom-action") != undefined) {
        var cusAction = $(obj).data("custom-action").split(",");
        for (i = 0; i < cusAction.length; i++) {
            if (cusAction[i].trim() == 'edit') {
                editAction = $(obj).data("edit-func");
                if (editAction != undefined) {
                    hasEdit = true;
                }
            }
        }
    }
    if (hasEdit) {
        $('thead tr', obj).append('<th data-field="action" data-formatter="actionEditFormatter" data-events="actionEvents">Action</th>');
    }
}

function view_custom_action(obj) {
    var hasEdit = false;
    var editAction;

    if ($(obj).data("custom-action2") != undefined) {
        var cusAction = $(obj).data("custom-action2").split(",");
        for (i = 0; i < cusAction.length; i++) {
            if (cusAction[i].trim() == 'view') {
                editAction = $(obj).data("view-func");
                if (editAction != undefined) {
                    hasEdit = true;
                }
            }
        }
    }
    if (hasEdit) {
        $('thead tr', obj).append('<th data-field="action" data-formatter="actionViewFormatter" data-events="actionEvents">Action</th>');
    }
}

function add_custom_action(obj) {
    var hasAdd = false;
    //var hasDel = false;

    var addAction;
    //var delAction;
    if ($(obj).data("custom-action") != undefined) {
        var cusAction = $(obj).data("custom-action").split(",");
        for (i = 0; i < cusAction.length; i++) {
            if (cusAction[i].trim() == 'add') {
                addAction = $(obj).data("add-func");

                if (addAction != undefined) {
                    hasAdd = true;
                }
            }
            /*if (cusAction[i].trim() == 'delete') {
             delAction = $(obj).data("delete-func");
             if (delAction != undefined) {
             hasDel = true;
             }
             }*/

        }
    }/*
     if (hasDel) {
     $('.fixed-table-toolbar', tableObj).append('<div class="columns columns-right btn-group pull-right"><button class="btn btn-default small-button" onclick="' + delAction + '">Delete Selected Items</button></div>');
     }*/

    if (hasAdd) {
        $('thead tr', obj).append('<th data-field="action" data-formatter="actionAddFormatter" data-events="actionEvents">Action</th>');

        //$('.fixed-table-toolbar', tableObj).append('<div class="columns columns-right btn-group pull-right"><button class="btn btn-default small-button" onclick="' + addAction + '">Add</button></div>');
    }


}

function actionAddFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:;" title="Pilih" data-dismiss="modal">',
        '<i class="glyphicon glyphicon-check"></i>',
        '</a>'
    ].join('');

}

function actionViewFormatter(value, row, index) {
    return [
        '<a class="view ml10" href="javascript:;" title="Detail">',
        '<i class="glyphicon glyphicon-list-alt"></i>&nbsp;Detail',
        '</a><br/>'
    ].join('');
}

function actionEditFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:;" title="Edit">',
        '<i class="glyphicon glyphicon-edit"></i>&nbsp;Edit',
        '</a><br/>'
    ].join('');
}

function actionRemoveFormatter(value, row, index) {
    return [
        '<a class="remove ml10" href="javascript:;" title="Remove">',
        '<i class="glyphicon glyphicon-remove" style="color:red"></i>&nbsp;remove',
        '</a><br/>'
    ].join('');
}

function totalTextFormatter(data) {
    return 'Total';
}

function totalFormatter(data) {
    return data.length;
}

function sumFormatter(data) {
    field = this.field;
    return data.reduce(function (sum, row) {
        return sum + (+row[field]);
    }, 0);
}

function avgFormatter(data) {
    return sumFormatter.call(this, data) / data.length;
}
function nullFormat(value, row, index) {
    if (value == null || value == '') {
        return '-';
    }
    return value;
}
function numberFormat(value, row, index) {
    if (value == null || value == '') {
        return '<span class="format_number">-</span>';
    }
    return  '<span class="format_number">' + value + '</span>';
}
function numberFormatRight(value, row, index) {
    if ((value == null || value == '') && value != 0) {
        return '<span class="format_number_right">-</span>';
    }
    return  '<span class="format_number_right">' + value + '</span>';
}
function numberFormatSalary(value, row, index) {
    if (value == null || value == '') {
        return '<span class="format_number_right">-</span>';
    }
    return  '<span class="format_number_right">' + formatRupiahDash(value, 'Rp. ') + '</span>';
}
window.actionEvents = {
    'click .view': function (e, value, row, index) {
        var viewAction = $(e.target).closest('table').data('view-func');
        var args = new Array();
        args.push(e.target);
        args.push(row);
        args.push(index);

        window[viewAction](e.target, row, index);

    },
    'click .edit': function (e, value, row, index) {
        var editAction = $(e.target).closest('table').data('edit-func');
        var args = new Array();
        args.push(e.target);
        args.push(row);
        args.push(index);

        window[editAction](e.target, row, index);

    },
    'click .remove': function (e, value, row, index) {

        var sourceId = $(e.target).closest('table').data('source-id');
        var obj = $(e.target).closest('table');
        var sourceObj = $('#' + sourceId);

        var objUniqueId = sourceObj.data('unique-id');
        var tblTempUniqueId = obj.data('unique-id');

        sourceObj.bootstrapTable('uncheckBy', {
            field: objUniqueId,
            values: [row[objUniqueId]]
        });
        obj.bootstrapTable('remove', {
            field: tblTempUniqueId,
            values: [row[tblTempUniqueId]]
        });
    }
};
function get_form(obj) {
    var id = $(obj).data("formid");
    var menuid = $(obj).data("menuid");
    var menuicon = $(obj).data("form-icon");
    var ctab = $('#tabpanel_' + id);
    var title = $(obj).text();
    if (ctab.length <= 0) {
        // create tab
        ctab = $('<div role="tabpanel" class="tab-pane" data-formid="' + id + '" id="tabpanel_' + id + '">Loading...</div>').appendTo($('.maincontent_containers.tab-content'));
        $('<li role="presentation" data-formid="' + id + '" id="tablink_' + id + '" ><a href="#tabpanel_' + id + '" class="tablink" aria-controls="' + title + '" role="tab" data-toggle="tab"><span class="' + menuicon + '"></span>' + title + ' </a><a class="closetabLink" onclick="removeTab(this);"><span class="glyphicon glyphicon glyphicon-remove" aria-hidden="true"></span></a></li>').appendTo($('.nav-tabs-container .nav-tabs'));
    }
    $('#tablink_' + id + ' a.tablink').click();
    listener_tabNav();
    var postData = new Object();
    postData.menuvid = '' + menuid;
    postData.appid = id;
    _fw_post('/svc-jdc-dashboard/rest/jdc/dsh000/appinfo', postData, function (data) {
        if (data.status == '1') {

            $.get(form_path + id + form_ext, {
                'cb': (new Date).getTime()
            }, function (data) {
                var tabPanel = $('#tabpanel_' + id);
                $('#tabpanel_' + id).html('<div class="main-app">' + data + '</div>');
                $('input:text', $('#tabpanel_' + id)).attr('autocomplete', 'off');
                $('.btn-lookup', tabPanel).addClass('btn-primary').html('<span class="glyphicon glyphicon-search"></span>');

//                if ($.inArray(id, bookmarkedApps) == -1) {
//                    $('#tabpanel_' + id).prepend('<div class="app-info"><div class="app-button"></button></div><ol class="breadcrumb"><li class="active"><span>' + title + '</span></li></ol></div>');
//                } else {
//                    $('#tabpanel_' + id).prepend('<div class="app-info"><div class="app-button"></button></div><ol class="breadcrumb"><li class="active"><span>' + title + '</span></li></ol></div>');
//                }

                var appVer = $('#' + id).data('version');
                $('#tabpanel_' + id).append('<div class="page-footer">' + id + ' - Ver. ' + appVer + '</div>');
                $('#datetimepicker1').datetimepicker({
                    locale: 'id'
                });
                $('.panel-control .panel-button', tabPanel).prepend('<a class="panel-control-button" onclick="toggleMonitoring(this)"><span class="glyphicon glyphicon-chevron-left trasition"></span></a>');
                $('table', tabPanel).each(function () {
                    edit_custom_action(this);
                    view_custom_action(this);
                    if ($(this).attr('id') != 'jdcrms027psychologicalTableS1' && $(this).attr('id') != 'jdcrms027psychologicalTableD3IT' && $(this).attr('id') != 'jdcrms027psychologicalTableD3Teknik' && $(this).attr('id') != 'jdcrms027psychologicalTableD3NonTeknik' && $(this).attr('id') != 'jdcrms027psychologicalTableSLTA' && $(this).attr('id') != 'jdcrms027psychologyTableS1' && $(this).attr('id') != 'jdcrms027psychologyTableD3' && $(this).attr('id') != 'jdcrms027psychologyTableSLTA' && $(this).attr('id') != 'jdcrms027psychologyTableS1' && $(this).attr('id') != 'jdcrms027searchTableSelection' && $(this).attr('id') != 'jdcrms025viewTableApplicationJob' && $(this).attr('id') != 'jdcrms040p01SearchTable' && $(this).attr('id') != 'jdcrms052viewTableApplicationJob') {
                        $(this).bootstrapTable();
                    }
                });

                $('table', tabPanel).each(function () {
                    add_custom_action(this);
                });


                //onkey enter
                $(':input:not([type="button"],[type="submit"],button)', tabPanel).keydown(function (e) {
                    if (e.keyCode == 13) {
                        $('.btn.default:first', tabPanel).click();
                    }
                });




                $.each($('table', tabPanel), function () {

                    //checkbox table event oncheck all
                    $(this).on('check-all.bs.table', function (e, rows) {
                        var tblTempId = $(e.target).data('checkbox-table');

                        var objTblTemp = $('#' + tblTempId);

                        var tblTempUniqueId = objTblTemp.data('unique-id');
                        var objUniqueId = $(e.target).data('unique-id');

                        if (objTblTemp != undefined && tblTempId != undefined && objUniqueId != undefined) {
                            $.each(rows, function (i, v) {
                                var duplicate = false;
                                $.each(objTblTemp.bootstrapTable('getData'), function (index, val) {
                                    if (v != undefined && val != undefined) {
                                        if (v[objUniqueId] == val[tblTempUniqueId]) {
                                            duplicate = true;
                                        }
                                    }
                                });
                                if (!duplicate) {
                                    var dataDel = objTblTemp.bootstrapTable('getData');

                                    objTblTemp.bootstrapTable('insertRow', {
                                        index: dataDel.length,
                                        row: v
                                    });

                                }
                            });
                        }

                    });

                    //checkbox table event oncheck
                    $(this).on('check.bs.table ', function (e, row) {
                        var tblTempId = $(e.target).data('checkbox-table');
                        var objTblTemp = $('#' + tblTempId);

                        var tblTempUniqueId = objTblTemp.data('unique-id');
                        var objUniqueId = $(e.target).data('unique-id');

                        if (objTblTemp != undefined) {
                            var duplicate = false;
                            $.each(objTblTemp.bootstrapTable('getData'), function (i, v) {
                                if (v != undefined && row != undefined) {
                                    if (v[objUniqueId] == row[tblTempUniqueId]) {
                                        duplicate = true;
                                    }
                                }

                            });

                            if (!duplicate) {
                                var dataDel = objTblTemp.bootstrapTable('getData');

                                objTblTemp.bootstrapTable('insertRow', {
                                    index: dataDel.length,
                                    row: row
                                });
                            }
                        }
                    });

                    //checkbox table event uncheck
                    $(this).on('uncheck.bs.table', function (e, row) {
                        var tblTempId = $(e.target).data('checkbox-table');
                        var objTblTemp = $('#' + tblTempId);

                        var tblTempUniqueId = objTblTemp.data('unique-id');
                        var objUniqueId = $(e.target).data('unique-id');

                        $.each(objTblTemp.bootstrapTable('getData'), function (i, v) {
                            if (v != undefined && row != undefined) {
                                if (v[objUniqueId] == row[tblTempUniqueId]) {
                                    objTblTemp.bootstrapTable('remove', {
                                        field: tblTempUniqueId,
                                        values: [v[tblTempUniqueId]]
                                    });
                                }
                            }
                        });

                    });

                    //checkbox table event uncheck all
                    $(this).on('uncheck-all.bs.table', function (e, rows) {
                        var tblTempId = $(e.target).data('checkbox-table');
                        var objTblTemp = $('#' + tblTempId);

                        var tblTempUniqueId = objTblTemp.data('unique-id');
                        var objUniqueId = $(e.target).data('unique-id');

                        $.each(rows, function (i, v) {
                            var delFound = false;
                            $.each(objTblTemp.bootstrapTable('getData'), function (index, val) {
                                if (v != undefined && val != undefined) {
                                    if (v[objUniqueId] == val[tblTempUniqueId]) {
                                        delFound = true;
                                    }
                                }
                            });
                            if (delFound) {
                                objTblTemp.bootstrapTable('remove', {
                                    field: tblTempUniqueId,
                                    values: [v[tblTempUniqueId]]
                                });
                            }
                        })

                    });

                    //checkbox table event preserve checkbox
                    $(this).on('post-body.bs.table', function (e) {
                        var tblTempId = $(e.target).data('checkbox-table');
                        var objTblTemp = $('#' + tblTempId);

                        var tblTempUniqueId = objTblTemp.data('unique-id');
                        var objUniqueId = $(e.target).data('unique-id');

                        var data = $(e.target).bootstrapTable('getData');
                        $.each(data, function (index, val) {
                            $.each(objTblTemp.bootstrapTable('getData'), function (i, v) {
                                if (v != undefined) {
                                    if (v[objUniqueId] == val[tblTempUniqueId]) {
                                        $(e.target).bootstrapTable('check', index);
                                    }
                                }
                            });
                        });
                    });
                });



                //lookup
                $('.lookup', tabPanel).each(function () {
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

                    /*
                     $(this).find('.input-lookup').focusout(function() {
                     if($( document.activeElement ).attr('id') != $(obj).find('.lookup-form').attr('id')){
                     $(obj).find('.lookup-form').slideUp();
                     }
                     
                     });*/

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
                                /*
                                 if($('#'+key).val() != row[val]){
                                 value_changed = true;
                                 }
                                 $('#'+key).val(row[val]);*/
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
            });
        }
    });

}

function _fw_subpage(obj, id, row) {
    _fw_setMessage(obj);
    var parent = $(obj).closest('.div-app');
    if (parent.html() == undefined) {
        parent = $(obj).closest('.tab-pane');
    }
    $('.subpage.subpage-default', parent).removeClass('subpage-default');
    var targetSubpage = $('#' + id);
    _fw_validation_clear(targetSubpage);
    $(targetSubpage).addClass('subpage-default');

    //----------------control breadcrumb-----------------------

    var tpath = targetSubpage.attr('data-path').split('/');

    var tabObj = $(obj).closest('.main-app').prev();
    var breadcrumb = $('ol.breadcrumb', tabObj);
    var listLI = $('li', breadcrumb);

    var lengthListLI = listLI.length;

    while (lengthListLI < tpath.length) {
        breadcrumb.append('<li><a></a></li>');
        lengthListLI++;
    }

    lengthListLI = $('li', breadcrumb).length;
    while (lengthListLI > tpath.length) {
        listLI[listLI.length - 1].remove();
        lengthListLI--;
    }

    var path = '';
    listLI = $('li', breadcrumb);
    $.each(listLI, function (i, v) {
        $(this).removeClass('active')
        if (i == 0) {
            path += tpath[i];
        } else {
            path += '/' + tpath[i];
        }
        console.log(path);

        if (i < listLI.length - 1) {
            $(this).html('<a onclick="_fw_breadcrumb(this, \'' + $.trim(path) + '\');return false">' + $.trim(tpath[i]) + '</a>');
        } else if (i == listLI.length - 1) {
            $(this).addClass('active');
            $(this).html('<span>' + $.trim(tpath[i]) + '</span>');
        }
    });
    //-----------end breadcrumb-------------
    automaticFill(row, targetSubpage);


}

function automaticFill(row, targetSubpage) {
    if (row != undefined || row != null) {
        $.each($(':input', targetSubpage).not('input[type="radio"]', targetSubpage), function () {
            var inputObj = $(this);
            var datafield = $(this).data("field");
            $.each(row, function (key, value) {
                if (datafield == key) {
                    inputObj.val(value);
                }
            });
        });

        $.each($('input[type="radio"]', targetSubpage), function () {
            var inputObj = $(this);
            var datafield = $(this).data("field");
            $.each(row, function (key, value) {
                if (datafield == key) {
                    if (inputObj.val() != undefined && value != undefined) {
                        if (inputObj.val().toLowerCase() == value.toLowerCase()) {
                            inputObj.prop('checked', true);
                        }
                    }
                }
            });
        });
    }
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function recursive_menu(menu_obj, array_data, html_string) {
    var menu_childs = new Array();
    html_string += '<ul class="treeview-menu" style="display: none;">';
    var menuGroup = [];
    var appGroup = [];

    $.each(array_data, function (key, value) {
        if (value.applicationid == "null") {
            menuGroup.push(this);
        } else {
            appGroup.push(this);
        }
    });

    $.each(menuGroup, function (key, value) {
        if (value.vparent == menu_obj.menuId) {
            var menu_child_obj = new Object();
            menu_child_obj.menuId = value.vid;
            menu_child_obj.menuName = value.title;

            html_string += '<li class="menu treeview transition">' +
                    '<a>' +
                    '<i class="' + value.icon + '"></i> <span>' + value.title + '</span>' +
                    '<i class="glyphicon glyphicon-chevron-down icon-menu-expand" style="float:right"></i>' +
                    '</a>';
            html_string = recursive_menu(menu_child_obj, array_data, html_string);
            html_string += '</li>';
            menu_childs.push(menu_child_obj);
        }
    });

    $.each(appGroup, function (key, value) {
        if (value.parent == menu_obj.menuId) {
            var menu_child_obj = new Object();
            menu_child_obj.menuId = value.vid;
            menu_child_obj.menuName = value.title;

            html_string += '<li class="menu transition">' +
                    '<a data-menuid="' + value.vid + '" data-formid="' + value.url + '" data-form-icon="' + value.icon + '">' +
                    '<i class="glyphicon glyphicon-circle-o">' +
                    '</i>' + value.title +
                    '</a>' +
                    '</li>';

            menu_childs.push(menu_child_obj);

        }
    });
    if (menu_childs.length > 0) {
        menu_obj.menuChilds = menu_childs;
    }
    html_string += '</ul>';
    return html_string;
}

function _fw_post(postUrl, postData, callback) {
    $.ajax
            ({
                type: "POST",
                url: postUrl,
                contentType: "application/json",
                dataType: 'json',
                async: false,
                headers: {
                    "JXID": getJxid()
                },
                data: JSON.stringify(postData),
                success: function (data) {
                    if (data.stat != '401') {
                        //console.log('done not error');
                        if (typeof (callback) == 'function') {
                            callback(data);
                        }

                    } else {
                        //console.log('done error');
                    }
                }
            });
}

function _fw_post_callback(postUrl, postData, callback, isObject) {
    var dataSend = null;

    if (isObject === true) {
        dataSend = JSON.stringify(postData);
    } else {
        dataSend = postData;
    }
    $.ajax({
        type: "POST",
        url: postUrl,
        contentType: "application/json",
        dataType: 'json',
        async: false,
        headers: {
            "JXID": getJxid()
        },
        data: dataSend,
        success: function (data) {
            if (data.stat != '401') {
                if (typeof (callback) == 'function') {
                    callback(data);
                }
            } else {
                //console.log('done error');
            }
        }
    });
}

function _fw_postt(postUrl, postData, callback) {
    $.ajax
            ({
                type: "POST",
                url: postUrl,
                contentType: "application/json",
                dataType: 'json',
                async: false,
                data: JSON.stringify(postData),
                success: function (data) {
                    if (data.stat != '401') {
                        //console.log('done not error');
                        if (typeof (callback) == 'function') {
                            callback(data);
                        }
                    } else {
                        //console.log('done error');
                    }
                }
            });
}

function _fw_reset_subpage(obj) {
    _fw_validation_clear(obj);
    var subpage;
    if ($(obj).hasClass('subpage')) {
        subpage = $(obj);
    } else {
        subpage = $(obj).closest('.subpage');
    }
    $(subpage).find('input').not('input[type="radio"],.unresetable').val('');
    $(subpage).find('select').each(function () {
        $(this).val($(this).find('option:first').val());
    });
    $(subpage).find('textarea').val('');
}

function _fw_setMessage(obj, status, msg, errorCallback) {
    var subpageId = $(obj).closest('.subpage').attr('id');
    console.log(typeof (msg));
    var appObj = $(obj).closest('.div-app');
    if (typeof (msg) == 'string') {
        if ($('.global_message', appObj).html() != '') {
            $('.global_message', appObj).slideUp(200);
        }

        if (status == 1 && msg == '') {
            $('.global_message', appObj).html('');
        } else if (status == 1 && msg != '') {
            $('.global_message', appObj)
                    .html('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>' + msg + '</div>');
        } else if (status == 0) {
            $('.global_message', appObj)
                    .html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>' + msg + '</div>');
        } else {
            $('.global_message', appObj).html('');
        }
        if ($('.global_message', appObj).html() != '') {
            $('.global_message', appObj).slideDown(200);
        }
    } else if (typeof (msg) == 'object') {
        if (status == '0') {
            if ($('.global_message', appObj).html() != '') {
                $('.global_message', appObj).slideUp(200);
            }

            var generateDataId = generateUUID();

            var msgArray = '';
            if (msg.length > 1) {
                msgArray = '<ul class="errorList">';
                $.each(msg, function (i, val) {
                    msgArray += '<li>' + val + '</li>';
                });
                msgArray += '</ul>';
            } else if (msglength == 1) {
                msgArray = msg[0];
            }
//            $('.global_message', appObj)
//                    .html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>' + msgArray + '<ul><li style="list-style-type: none;"><a style="text-decoration: none;" onclick="reloadForUpdate(this,\'' + subpageId + '\', \'' + generateDataId + '\', \'' + errorCallback + '\')" >Reload</a></li></ul></div>');        
            $('.global_message', appObj)
                    .html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>' + msgArray + '<ul><li style="list-style-type: none;"></li></ul></div>');
            if ($('.global_message', appObj).html() != '') {
                $('.global_message', appObj).slideDown(200);
            }
            updateData[generateDataId] = msg;
        } else if (status == '1') {
            if ($('.global_message', appObj).html() != '') {
                $('.global_message', appObj).slideUp(200);
            }

            var generateDataId = generateUUID();

            var msgArray = '';
            if (msg.length > 1) {
                msgArray = '<ul class="errorList">';
                $.each(msg, function (i, val) {
                    msgArray += '<li>' + val + '</li>';
                });
                msgArray += '</ul>';
            } else if (msglength == 1) {
                msgArray = msg[0];
            }
            $('.global_message', appObj)
                    .html('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>' + msgArray + '<ul><li style="list-style-type: none;"></li></ul></div>');
            if ($('.global_message', appObj).html() != '') {
                $('.global_message', appObj).slideDown(200);
            }
            updateData[generateDataId] = msg;
        }
    }
}

function reloadForUpdate(obj, pageId, id, errorCallback) {
    _fw_setMessage(obj, -1, '');
    if (errorCallback == undefined) {
        automaticFill(updateData[id].rows[0], $('#' + pageId));
    } else {
        var errorCallbackf = window[errorCallback];
        if (typeof (errorCallbackf) == 'function') {
            errorCallbackf(updateData[id].rows[0]);
        } else {
            automaticFill(updateData[id].rows[0], $('#' + pageId));
        }
    }

}

/* Validation */
var _vvalObjs = [];
function _fw_validation_clear(obj) {
    _vvalObjs = [];
    var ofrm;
    if ($(obj).hasClass('subpage')) {
        ofrm = $(obj);
    } else {
        ofrm = $(obj).closest('.subpage');
    }
    _fw_setMessage(obj, -1, '');
    ofrm.find('.form-group').removeClass('has-error has-feedback');
    ofrm.find('.form-group').find('.form-control-feedback').remove();
}

function _fw_validation_add(obj, fieldName, validation) {
    var ofrm = $(obj).closest('.subpage').length > 0 ? $(obj).closest('.subpage') : $(obj).closest('.div-app');
    var fieldLabel = $('label[for="' + fieldName + '"]', ofrm) != undefined ? $('label[for="' + fieldName + '"]', ofrm).text() : '';
    _vvalObjs[_vvalObjs.length] = {
        obj: $('#' + fieldName, ofrm),
        name: fieldLabel,
        val: validation,
        msg: ''
    };

}

function _fw_validation_validate(obj) {
    var ofrm = $(obj).closest('.subpage');
    var msg = '<ul class="errorList">';
    for (var i = 0; i < _vvalObjs.length; i++) {
        switch (_vvalObjs[i].val.toLowerCase()) {
            case 'required':
                if ((_vvalObjs[i].msg == '') && (_vvalObjs[i].obj.val() == null || _vvalObjs[i].obj.val().replace(/\s+/, '') == ''))
                    _vvalObjs[i].msg = 'Field ' + _vvalObjs[i].name + ' is required.';
                break;
            case 'number':
                if ((_vvalObjs[i].msg == '') && isNaN(_vvalObjs[i].obj.val()))
                    _vvalObjs[i].msg = 'Field ' + _vvalObjs[i].name + ' must be numeric.';
                break;
        }
    }
    var dmsg = '';
    for (var i = 0; i < _vvalObjs.length; i++) {
        //_vvalObjs[i].obj.closest('.form-group').removeClass('has-success has-error has-feedback');
        //_vvalObjs[i].obj.next().remove();
        if (_vvalObjs[i].msg != '') {
            dmsg += '<li>' + _vvalObjs[i].msg + '</li>';
            _vvalObjs[i].obj.closest('.form-group').addClass('has-error has-feedback');
        } else {
            // _vvalObjs[i].obj.closest('.form-group').addClass('has-success  has-feedback');
        }
    }
    if (dmsg != '') {
        msg += dmsg + '</ul>';
        _fw_setMessage(obj, 0, msg);
        return false;
    }
    return true;
}

function loadData(resps) {
    if (resps.status != '0') {
        if (resps.data == null) {
            return {
                rows: [],
                total: 0
            };
        } else {
            return {
                rows: resps.data,
                total: resps.total
            };
        }

    } else {
        return {
            rows: [],
            total: 0
        };
    }
}

function _fw_relogin(user, pass) {
    var userData = new Object();
    console.log(user, pass);
    $('button[type=submit]').html(
            '<svg width="20px"  height="20px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;">' +
            '<circle cx="50" cy="50" fill="none" ng-attr-stroke="{{config.color}}" ng-attr-stroke-width="{{config.width}}" ng-attr-r="{{config.radius}}" ng-attr-stroke-dasharray="{{config.dasharray}}" stroke="#a5a6a0" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
            '<animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform> ' +
            '</circle> ' +
            '</svg>'
            );
    $.ajax({
        type: "POST",
        url: "/svc-jdc-dashboard/rest/jdc/dsh000/login",
        contentType: "application/json",
        dataType: 'json',
        async: false,
        headers: {
            "Authorization": "Basic " + btoa(user + ":" + pass)
        },
        data: JSON.stringify(userData)
    }).done(function (data) {
        $('button[type=submit]').html('Sign In');
        $("#container_login").hide();
        if (data.status == "1") {
            $('.jdc .login-outer').slideUp();
            lastRequest.headers = {
                "JXID": getJxid()
            };
            $.ajax(lastRequest);
        } else {
            $('#error-login').slideDown();
        }
    }).fail(function () {
        console.log('login failed')
    });
}

function _rt_initTable(tblSelector, limiter) {

    var tbl = $(tblSelector).addClass('responsiveTable');

    $('.hiddenCell', tbl).removeClass('hiddenCell');

    $('.detailBlock', tbl).remove();

    var rlimit = !limiter ? tbl.closest('.div-app') : limiter;

    var maxw = rlimit.width();

    console.log(tbl.outerWidth() + ' -- ' + maxw);

    if (tbl.outerWidth() > maxw) {

        var rw = 0, rc = 0;

        $('th', tbl).each(function () {

            rw += $(this).outerWidth();

            if (rw < maxw) {

                rc++;

            } else
                return false;

        });

        rc = rc - 2;

        tbl.data('hiddenIdx', rc);

        console.log(rc);

        $('th:gt(' + rc + ')', tbl).addClass('hiddenCell');

        $(' > tbody > tr', tbl).each(function () {

            if ($('table', this).length <= 0) {
                var firstTd;
                if ($('td:first', this).hasClass('bs-checkbox')) {
                    firstTd = $('td:nth-child(2)', this);
                } else {
                    firstTd = $('td:first', this);
                }
                firstTd.addClass('mainCell');
                console.log(firstTd.html());
                if ($('a.moreLink', firstTd).length <= 0)
                    firstTd.prepend('<a class="moreLink" onclick="_rt_populate(this);return false;"></a>');

                $('td:gt(' + rc + ')', this).addClass('hiddenCell');

            }

        });



    }

}

function _rt_populate(obj) {

    var obj = $(obj);

    var tbl = obj.closest('table');

    var row = obj.closest('tr');

    var td = obj.parent();

    var tgt = $('.detailBlock', td);

    if (tgt.length <= 0) {

        tgt = $('<div class="detailBlock"></div>').appendTo(td);

        var headers = Array();

        var celldata = Array();

        $('th.hiddenCell', tbl).each(function () {

            headers[headers.length] = $(this).text();

        });

        $('td.hiddenCell', row).each(function () {

            celldata[celldata.length] = $(this).html();

        });

        for (var x = 0; x < headers.length; x++) {

            $('<div class="itemLbl">' + headers[x] + '</div><div class="itemVal">' + celldata[x] + '</div>').appendTo(tgt);

        }

    }

    tgt.slideToggle();

}

function numberFormatter(value, row, index) {
    console.log(value);
    return addCommas(value);
}

function addCommas(nStr) {
    if (nStr != undefined && nStr != "") {
        nStr = parseFloat(nStr).toFixed(2)
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return (x1 + '' + x2);


    } else {
        return nStr;
    }
}

function removeCommas(nStr) {
    if (nStr != undefined && nStr != "") {
        return nStr.replace(/,/g, '');
    } else {
        return nStr;
    }
}

function toggleMonitoring(obj) {
    $(obj).closest('.panel-control').toggleClass('collapsed');
    $('.glyphicon', $(obj)).toggleClass('flipX');
    return false;
}

function _fw_breadcrumb(obj, path) {
    var parent = $(obj).closest('.tab-pane');
    var pageId = $('.subpage[data-path="' + path + '"]', parent).attr('id');
    _fw_subpage(obj, pageId);

    var parent_li = $(obj).closest('li').addClass('active');
    $(parent_li).nextAll().remove();

}

var indexBaseColor = -1;
function addBookmarkMenu() {
    _fw_post('/svc-jdc-dashboard/rest/jdc/dsh000/get-bookmark', '', function (data) {
        $('#bookmarkList').html('');
        indexBaseColor = -1;
        console.log(data);
        var bookmarkBySystem = [];
        var bookmarkByUser = [];
        bookmarkedApps = [];
        $.each(data.data, function (i, v) {
            if (v.flag == 'S') {
                bookmarkBySystem.push(v);
            } else {
                bookmarkByUser.push(v);
            }
            bookmarkedApps.push(v.applicationId);
        });

        var i = 0;
        $.each(bookmarkBySystem, function (index, val) {
            createBookmarkToHome(i, val);
            i++;
        });

        $.each(bookmarkByUser, function (index, val) {
            createBookmarkToHome(i, val);
            i++;
        });

    });
}

function createBookmarkToHome(i, v) {
    var moduloMenu = i % bookmarkSameBaseColor;

    if (moduloMenu == 0) {
        indexBaseColor++;
        if (indexBaseColor >= baseColorBookmark.length) {
            indexBaseColor = 0;
        }
    }
    var colorCss = shadeColor2(baseColorBookmark[indexBaseColor], moduloMenu * 0.1);

    if (colorCss.length > 7) {
        colorCss = colorCss.substr(0, 7);
    }
    $('#bookmarkList').append(generateBookmark(v, colorCss));
}

function removeBookmarkHomeMenu(obj, event) {
    event.preventDefault();
    var formId = $(obj).data('formid');

    var data = new Object();
    data.applicationId = formId;

    _fw_post('/svc-jdc-dashboard/rest/jdc/dsh000/unbookmark', data, function (data) {
        if (data.status == '1') {
            $(obj).closest('.tile').remove();
            addBookmarkMenu();
            $('button[name="buttonBookmark"]', $('#tabpanel_' + formId)).removeClass('dislike').attr("onclick", "bookmarkApps(this, event)");
            ;

        }
    });

    event.cancelBubble = true;
    event.stopPropagation();

    return false;

}

function openAppsFromHome(obj) {
    //event.preventDefault();

    var formId = $(obj).data('formid');


    var form_obj = $('#tablink_' + formId);
    if (form_obj.html() == undefined) {
        var form = $('a[data-formid="' + formId + '"]', $('#jdcdsh1_menu_ul'));
        get_form(form);

    } else {
        form_obj.tab('show');
        $('[role="tabpanel"].tab-pane').removeClass('active');
        $('#tabpanel_' + formId).addClass('active');
    }

    return false;

}

function refreshForm(obj, event) {
    event.preventDefault();
    var tabPanel = $(obj).closest('.tab-pane');
    var formId = tabPanel.data('formid');

    var form = $('a[data-formid="' + formId + '"]', $('#jdcdsh1_menu_ul'));
    get_form(form);

    return false;
}

function bookmarkApps(obj, event) {
    event.preventDefault();
    var tabPanel = $(obj).closest('.tab-pane');
    var formId = tabPanel.data('formid');

    var data = new Object();
    data.applicationId = formId;

    _fw_post('/svc-jdc-dashboard/rest/jdc/dsh000/add-bookmark', data, function (data) {
        if (data.status == '1') {
            $(obj).toggleClass('dislike');
            $(obj).attr("onclick", "unbookmarkApps(this, event)");
            $(obj).find('span.glyphicon').addClass('glyphicon-new-window');
            $(obj).find('span.glyphicon').removeClass('glyphicon-pushpin');
            addBookmarkMenu();
        }
    });
    return false;
}

function unbookmarkApps(obj, event) {
    event.preventDefault();
    var tabPanel = $(obj).closest('.tab-pane');
    var formId = tabPanel.data('formid');

    var data = new Object();
    data.applicationId = formId;

    _fw_post('/svc-jdc-dashboard/rest/jdc/dsh000/unbookmark', data, function (data) {
        if (data.status == '1') {
            $(obj).toggleClass('dislike');
            $(obj).attr("onclick", "bookmarkApps(this, event)");
            $(obj).find('span.glyphicon').removeClass('glyphicon-new-window');
            $(obj).find('span.glyphicon').addClass('glyphicon-pushpin');
            addBookmarkMenu();
        }
    });
    return false;
}

function generateBookmark(val, color) {
    var bookmarkIcon = '<div class="tile" style="background-color:' + color + ';" data-formid="' + val.url + '" onclick="openAppsFromHome(this)">'
            + '<div class="tile-content">'
            + '<i class="' + val.icon + '"></i>'
            + '</div>'
            + '<div class="tile-status">'
            + '<span class="name">' + val.title + '</span>'
            + '</div>';
    if (val.flag != 'S') {
        bookmarkIcon += '<a class="link-unbookmark-tile btn-pin" title="Unbookmark Apps" data-formid="' + val.url + '" onclick="removeBookmarkHomeMenu(this, event)">'
                + '<span class="glyphicon glyphicon-new-window">'
                + '</span>'
                + '</a>'
    }
    bookmarkIcon += '</div>';
    return bookmarkIcon;
}

function shadeColor2(color, percent) {
    var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

function getJxid() {
    a = document.cookie.split(';');
    indexJxid = -1;
    for (i = 0; i < a.length; i++) {
        if (a[0].substring(0, a[0].indexOf('=')) === 'JXID') {
            indexJxid = i;
        }
    }
    if (indexJxid < 0) {
        return "";
    }
    if (a[indexJxid][5] === '"') {
        return a[indexJxid].substring(a[indexJxid].indexOf('=') + 2, a[indexJxid].length - 1);
    } else {
        return a[indexJxid].substring(a[indexJxid].indexOf('=') + 1, a[indexJxid].length);
    }

}

function stripTagsHtml(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

function substText(text, totalSubstr) {
    return text.substr(0, totalSubstr);
}

function isTextSelected(input) {
    var startPos = input.selectionStart;
    var endPos = input.selectionEnd;
    var doc = document.selection;

    if (doc && doc.createRange().text.length != 0) {
        return true;
    } else if (!doc && input.value.substring(startPos, endPos).length != 0) {
        return input.value.substring(startPos, endPos).length;
    }
    return false;
}

function formatRupiahDash(bilangan, prefix)
{
    if (bilangan != null) {
        bilangan = bilangan.toString();

        if (bilangan == '') {
            return prefix + '0';
        }
        var number_string = bilangan.replace(/[^,\d]/g, '').toString(),
                split = number_string.split(','),
                sisa = split[0].length % 3,
                rupiah = split[0].substr(0, sisa),
                ribuan = split[0].substr(sisa).match(/\d{1,3}/gi);

        if (ribuan) {
            separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;

        return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
    }
    return prefix + '0';
}

function functionInputNumber(obj) {
    var pattern = /^\d+$/;
    var id = obj.id;
    var value = obj.value;
    if (!pattern.test(value)) {
        $("#" + id).val('');
    }
}

var store = (function () {
    var map = {};

    return {
        set: function (name, value) {
            map[ name ] = value;
        },
        get: function (name) {
            return map[ name ];
        }
    };
});

function getFooterSetting() {
    $.ajax({
        type: "POST",
        url: '/svc-jdc-dashboard/rest/jdc/rms000/get-footer-setting',
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (data) {
            var tel = data.data[0].commdesc5.substr(1, data.data[0].commdesc5.length);
            if (data !== null && data.data !== null) {
                $('#footer_address').html(data.data[0].commdesc1);
                $('#footer_postal').html(data.data[0].commdesc2);
                $('#footer_email').html('<a href="mailto:' + data.data[0].commdesc3 + '">' + data.data[0].commdesc3 + '</a>');
                $('#footer_website').html('<a href="' + data.data[0].commdesc4 + '">' + data.data[0].commdesc4 + '</a>');
                $('#footer_telepon').html('<a href="tel:+62' + tel + '">' + data.data[0].commdesc5 + '</a>');
            }
        }
    });
}

function getLinkSetting() {
    $.ajax({
        type: "POST",
        url: '/svc-jdc-dashboard/rest/jdc/rms000/get-company-profiles',
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (data) {
            $('.icon-linkedin').parent().attr('href', data.data[3].commdesc1);
            $('.icon-instagram').parent().attr('href', data.data[2].commdesc1);
            $('.icon-youtube').parent().attr('href', data.data[1].commdesc1);
            $('.icon-facebook').parent().attr('href', data.data[6].commdesc1);
            $('.icon-twitter').parent().attr('href', data.data[4].commdesc1);
        }
    });
}

function runningFormatter(value, row, index) {
    return index + 1;
}

function getParameterByName(name) {
    var url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2]);
}

function addErrorMessageModal(listFieldId, idModal) {
    var liListField = "";

    for (counter = 0; counter < listFieldId.length; counter++) {
        if (!$('#' + listFieldId[counter]).val() || $('#' + listFieldId[counter]).val().trim() == '' || $('#' + listFieldId[counter]).val() == '0') {
            var headListField = $("#" + listFieldId[counter]).parents('.form-group');
            headListField.addClass("has-error has-feedback");
            liListField = liListField + "<li>Field " + $('label[for="' + listFieldId[counter] + '"]').text() + " is required";
        }

    }
    var htmlDiv =
            '<div class="alert alert-danger alert-dismissable">' +
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true" style="top: -30px;">x</button>' +
            '<ul class="errorList">' + liListField + '</ul>' +
            '</div>';
    $("#" + idModal).find(".modal-body").prepend(htmlDiv);
}

