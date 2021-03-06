/*
 *  Altair Admin AngularJS
 */
;"use strict";

var altairApp = angular.module('altairApp', [
    'ui.router',
    'oc.lazyLoad',
    'ngSanitize',
    'ngRetina',
    'ncy-angular-breadcrumb',
    'ConsoleLogger',
    'ngTable',
    'angular-md5',
    'ngMap',
    'ngFileUpload',
    'ngCookies',
    'naif.base64',
    'fxpicklist',
    'ivh.treeview'
    // 'kendo.directives'
]);

altairApp.constant('variables', {
    header_main_height: 48,
    easing_swiftOut: [0.4, 0, 0.2, 1],
    bez_easing_swiftOut: $.bez([0.4, 0, 0.2, 1])
});


altairApp.constant('ServerConfig', {

	//tes repo baru
    // development: 'http://'+'10.21.4.21:'+'11111',
    // development: 'http://' + '10.21.4.21:' + '11111',
    // production: 'http://'+'10.21.4.21:'+'',
    // production: 'http://'+'10.21.4.21:'+'',
    // development: 'http://'+'localhost:'+'11111',
    // production: 'http://'+'localhost:'+'',

    // development: 'http://'+'iserveu.ag-it.com:'+'11111',
    // development: 'http://' + 'localhost:' + '11111',
    // production: 'http://'+'localhost:'+'',
    // production: 'http://'+'iserveu.ag-it.com:'+'',

    // development: 'http://'+'localhost:'+'11111',
    development: 'http://' + '172.30.155.134:' + '11111',
    production: 'http://'+'172.30.155.134:'+'',



    port_default: 30120,

    port_agitmodule: 30120,
    port_agitmodule_access: 30120,
    port_agitmodule_configuration: 30120,
    port_agitmodule_location: 30120,
    port_agitmodule_organisation: 30120,
    port_agitmodule_security: 30120,
    port_agitmodule_attendance: 30120,
    port_agitmodule_assignment: 30120,
    port_agitmodule_news_event: 30120,
    port_agitmodule_dashboard_report: 30120,
    port_agitmodule_uk: 30120,
    port_agitmodule_patroli: 30120,
    port_agitmodule_master_data: 30120,
    port_agitmodule_user_management: 30120

    // port
    //  port_agitmodule_access:30101,
    // port_agitmodule_configuration:30102,
    // port_agitmodule_location:30103,
    // port_agitmodule_organisation:30104,
    // port_agitmodule_user_management:30105,
    // port_agitmodule_security:30120,
    // port_agitmodule_attendance:30107,
    // port_agitmodule_assignment:30108,
    // port_agitmodule_news_event:30109,
    // port_agitmodule_dashboard_report:30110,
    // port_agitmodule_uk:30112,
    // port_agitmodule_integration:30111,
    // port_agitmodule_patroli:30113,
});

altairApp.constant('ServerProcess', {
    // development: 'http://'+'localhost:'+'12346',
    //   development: 'http://'+'10.21.224.128:'+'12346',

    // development: 'http://' + 'localhost:' + '30120',
    // production: 'http://' + 'localhost:' + '30120'
    // production: 'http://'+'localhost:'+'12346'
    // production: 'http://'+'10.21.224.128:'+'12346'
    // development: 'http://' + '172.30.155.134:' + '30120',
    // production: 'http://' + '172.30.155.134:' + '30120'


    development: 'http://' + '172.30.155.134:' + '30120',
    production: 'http://' + '172.30.155.134:' + '30120'
    // production: 'http://'+'localhost:'+'12346'
    // production: 'http://'+'10.21.224.128:'+'12346'

});

altairApp.constant('USER_INFO', {
    userId: '',
    username: '',
    password: '',
    ipAddress: '',
    macAddress: '',
    name: '',
    token: '',
    series: '',
    companyId: '',
    companyName: '',
    customerId: '',
    customerName: '',
    worklocationId: '',
    worklocationName: ''
});

altairApp.config(function (ivhTreeviewOptionsProvider) {
    ivhTreeviewOptionsProvider.set({
        idAttribute: 'id',
        labelAttribute: 'label',
        childrenAttribute: 'children',
        selectedAttribute: 'selected',
        useCheckboxes: true,
        disableCheckboxSelectionPropagation: true,
        expandToDepth: 2,
        indeterminateAttribute: '__ivhTreeviewIndeterminate',
        expandedAttribute: '__ivhTreeviewExpanded',
        defaultSelectedState: true,
        validate: false,
        twistieExpandedTpl: '(-)',
        twistieCollapsedTpl: '(+)',
        twistieLeafTpl: 'o'

    });
});

altairApp.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**',
        'https://w.soundcloud.com/**'
    ]);
});

// breadcrumbs
altairApp.config(function ($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
        prefixStateName: 'restricted.dashboard',
        templateUrl: 'app/templates/breadcrumbs.tpl.html'
    });
});

altairApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);

altairApp.factory('SecurityModuleFactory', function ($http, $q, $log, ServerConfig, USER_INFO, $cookies, SessionConstruct) {
    var service = {};

    var response = {
        success: false,
        message: ''
    };


    //LOGIN METHOD
    //-------------------------------------
    var login_request = {
        method: 'POST',
        url: ServerConfig.production + ServerConfig.port_agitmodule_security + '/security/login',
        data: USER_INFO,
        headers: {"TOKEN-ID": "000", "SERIES-ID": "000", "OWNER-COMPANY-ID": "000"}
    };

    service.login = function (username, password) {
        var deffered = $q.defer();
        $log.info("LOGIN FACTORY");
        USER_INFO.username = username;
        USER_INFO.password = password;
        // 
        // console.log(login_request);
        $http(login_request).success(function (data, status, headers) {

            localStorage.setItem('data_user_employee', JSON.stringify(data));
            deffered.resolve(data);

            $cookies.put('username', data.employeeTemplate.username);
            $cookies.put('userid', data.employeeTemplate.employeeId);
            $cookies.put('name', data.employeeTemplate.employeeName);
            $cookies.put('npk', data.employeeTemplate.npk);
            var today = new Date();
            var expiresValue = new Date(today.getTime() + 28800000);


        }).error(function (data, status) {
            $log.error(status);
        });
        return deffered.promise;
    };
    /*
     function SetCredentialsServer(username, password, grantedAuths, tokenid, seriesid, rememberMeTime, orgId) {
     $cookieStore.put(SecurityToken.securityEncode('username'),SecurityToken.securityEncode(username));
     $cookieStore.put(SecurityToken.securityEncode('tokenid'),SecurityToken.securityEncode(SecurityToken.encodeKey(tokenid)));
     $cookieStore.put(SecurityToken.securityEncode('seriesid'),SecurityToken.securityEncode(seriesid));
     $cookieStore.put(SecurityToken.securityEncode('authdata'),SecurityToken.securityEncode(username + ':' + password));
     $cookieStore.put(SecurityToken.securityEncode('grantedAuths'),grantedAuths);
     $cookieStore.put(SecurityToken.securityEncode('isAuthenticated'),SecurityToken.securityEncode('true'));
     $cookieStore.put(SecurityToken.securityEncode('rememberMeTime'),SecurityToken.securityEncode(''+rememberMeTime));
     if (angular.isUndefined(orgId)) {

     } else if (orgId === 'null') {

     } else {
     $cookieStore.put(SecurityToken.securityEncode('orgid'),SecurityToken.securityEncode(orgId));
     }

     };*/

    //GET MENU
    //-------------------------------------
    // url: ServerConfig.production + ServerConfig.port_agitmodule_security + '/get/menu/',
    var menu_request = {
        method: 'GET',
        url: ServerConfig.production + ServerConfig.port_agitmodule_security + '/security/get/menu/',
        headers: {USERNAME: ''},
        params: {}
    };

    service.getMenu = function (username) {
        var deffered = $q.defer();

        $cookies.put('username', username);
        var s = $cookies.get('username');


        menu_request.headers.USERNAME = username;

        $http(menu_request).success(function (data, status, headers) {
            deffered.resolve(data);

        }).error(function (data, status) {
            $log.error(status);
        });
        return deffered.promise;
    };

    return service;

});

altairApp.factory('CommonService', function () {
    var headInfo = [];
    return {
        SetData: function (key, data) {
            headInfo[key] = data;
        },
        GetData: function (key) {
            return headInfo[key];
        }
    }
});

altairApp.factory('ReconstructMenu', function (CommonService, $rootScope, $timeout, $log, $location, $state, $cookies, SessionConstruct) {

    return {
        Init: function () {
            $timeout(function () {
                try {

                    var test_data_service = CommonService.GetData('menuSideBar');

                    var menu = localStorage.getItem('menuSideBar');
                    var objMenu = JSON.parse(menu);
                    if (objMenu != null && objMenu != undefined) {
                        SessionConstruct.init();
                        $rootScope.$broadcast('menuSideBar', objMenu);
                    } else {
                        SessionConstruct.destroy();
                    }
                }
                catch (err) {
                    $log.error(err);

                }
            }, 500);
        }
    }
});

altairApp.factory('SessionConstruct', function (CommonService, $rootScope, $timeout, $log, $location, $state, $cookies,$window) {

    return {
        init: function () {
            $timeout(function () {
                try {

                    var now = new Date();
                    now.setMinutes(now.getMinutes() + 15);
                    $cookies.put('session_iserve', now);
                }
                catch (err) {
                    $log.error(err);

                }
            }, 500);
        },
        destroy: function () {
            var cookies = $cookies.getAll();
            angular.forEach(cookies, function (v, k) {
                $cookies.remove(k);
            });
            localStorage.clear();
            $location.path('/login');
            $state.go('login');
            $timeout(function () {
                $window.location.reload();
            }, 500);

        }
    }
});


altairApp.filter('unique', function() {
    return function(collection, primaryKey) { //no need for secondary key
        var output = [],
            keys = [];
        var splitKeys = primaryKey.split('.'); //split by period


        angular.forEach(collection, function(item) {
            var key = {};
            angular.copy(item, key);
            for(var i=0; i<splitKeys.length; i++){
                key = key[splitKeys[i]];    //the beauty of loosely typed js :)
            }

            if(keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });

        return output;
    };
});

altairApp.filter('customCurrency', function() {

    return function(input, symbol, place) {

        // Ensure that we are working with a number
        if(isNaN(input)) {
            return input;
        } else {

            // Check if optional parameters are passed, if not, use the defaults
            var symbol = symbol || 'EUROS';
            var place = place === undefined ? true : place;

            // Perform the operation to set the symbol in the right location
            if( place === true) {
                return symbol + input;
            } else {
                return input + symbol;
            }

        }
    }

});

altairApp.filter('comma2decimal', [
    function() { // should be altered to suit your needs
        return function(input) {
            var ret=(input)?input.toString().trim().replace(",","."):null;
            return parseFloat(ret);
        };
    }]);

/* Run Block */
altairApp
    .run(['$rootScope', '$state', '$stateParams', '$http', '$window', '$timeout', 'variables', '$log', '$cookies', '$location', 'CommonService', 'SecurityModuleFactory', 'ReconstructMenu',
        function ($rootScope, $state, $stateParams, $http, $window, $timeout, variables, $log, $cookies, $location, CommonService, SecurityModuleFactory, ReconstructMenu) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.$on('$stateChangeSuccess', function () {

                // scroll view to top
                $("html, body").animate({
                    scrollTop: 0
                }, 200);

                $timeout(function () {
                    $rootScope.pageLoading = false;
                    // reinitialize uikit components
                    //$.UIkit.init($('body'));
                    //$($window).resize();
                }, 300);

                $timeout(function () {
                    $rootScope.pageLoaded = true;
                    $rootScope.appInitialized = true;
                    // wave effects
                    $window.Waves.attach('.md-btn-wave,.md-fab-wave', ['waves-button']);
                    $window.Waves.attach('.md-btn-wave-light,.md-fab-wave-light', ['waves-button', 'waves-light']);

                    // IE fixes
                    if (typeof window.isLteIE9 != 'undefined') {
                        $('svg,canvas,video').each(function () {
                            var $this = $(this),
                                height = $(this).attr('height');
                            if (height) {
                                $this.css('height', height);
                            }
                            if ($this.hasClass('peity')) {
                                $this.prev('span').peity()
                            }
                        });
                    }
                }, 600);
            });

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                var location = $location.url();

                if (location == '/login') {
                    //console.log('it is in new neta login path');
                } else {
                    var isAuthenticated = $cookies.get('isAuthenticated');

                    console.log("isAuthenticated+" + $cookies.get('isAuthenticated'));

                    if (isAuthenticated == 1) {
                        console.log('authenticatred is 1');
                        $cookies.put('isAuthenticated', 2);
                        $location.path('/dashboard1');
                    } else if (isAuthenticated == 0) {
                        //console.log('authenticatred is 0');
                        $location.path('/login');
                    } else if (isAuthenticated == 2) {
                        console.log('isAuth is 2');
                        var menu_scope = '' + $rootScope.sections;
                        //console.log('menu_scope length : '+menu_scope.length);
                        if (menu_scope == 'undefined') {
                            //console.log('it is undefined, data : ' + JSON.stringify(menu_scope));
                            var success_login = function (data) {
                                //console.log('request menu success');
                                //console.log('username : '+$cookies.get('username'));
                                $timeout(function () {
                                    // ini harusnya bisa di broadcast cuma kagak tau kenapa kagak muncul menunya, hahahahaha......//TODO banget ini mah
                                    $rootScope.$broadcast('menuSideBar', data);
                                    CommonService.SetData('menuSideBar', data);

                                    console.log("smentara diredirect ke dashboard 1 dulu");
                                    //$scope.$state = $state;
                                    //console.log('current state : '+$location.url());
                                    //$state.go('newneta.dashboar1');
                                }, 1);
                                //$rootScope.$broadcast('menuSideBar', data);

                            };
                            var error_login = function (data) {
                                console.log('request menu failed');
                            };

                            var user_info = $cookies.get('username');
                            $log.info("user_info: " + user_info);

                            console.log('username');
                            if (user_info != undefined && user_info != '') {
                                SecurityModuleFactory.getMenu(user_info).then(success_login, error_login);
                            } else {
                                $location.path('/login');
                            }

                        }
                        /**/
                    }
                }


                /*if ($rootScope.loggedInUser == null) {
                 $location.path("/newneta_login");
                 }*/

                // main search
                $rootScope.mainSearchActive = false;
                // secondary sidebar
                $rootScope.sidebar_secondary = false;
                $rootScope.secondarySidebarHiddenLarge = false;

                if ($($window).width() < 1220) {
                    // hide primary sidebar
                    $rootScope.primarySidebarActive = false;
                    $rootScope.hide_content_sidebar = false;
                }
                if (!toParams.hasOwnProperty('hidePreloader')) {
                    $rootScope.pageLoading = true;
                    $rootScope.pageLoaded = false;
                }

            });

            // fastclick (eliminate the 300ms delay between a physical tap and the firing of a click event on mobile browsers)
            FastClick.attach(document.body);

            // get version from package.json
            $http.get('./package.json').success(function (response) {
                $rootScope.appVer = response.version;
            });

            // modernizr
            $rootScope.Modernizr = Modernizr;

            // get window width
            var w = angular.element($window);
            $rootScope.largeScreen = w.width() >= 1220;

            w.on('resize', function () {
                return $rootScope.largeScreen = w.width() >= 1220;
            });

            // show/hide main menu on page load
            $rootScope.primarySidebarOpen = ($rootScope.largeScreen) ? true : false;

            $rootScope.pageLoading = true;

            // wave effects
            $window.Waves.init();

        }
    ])
    .run([
        'PrintToConsole',
        function (PrintToConsole) {
            // app debug
            PrintToConsole.active = false;
        }
    ])
;


altairApp
    .factory('windowDimensions', [
        '$window',
        function($window) {
            return {
                height: function() {
                    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                },
                width: function() {
                    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                }
            }
        }
    ])
    .factory('utils', [
        function () {
            return {
                // Util for finding an object by its 'id' property among an array
                findByItemId: function findById(a, id) {
                    for (var i = 0; i < a.length; i++) {
                        if (a[i].item_id == id) return a[i];
                    }
                    return null;
                },
                // serialize form
                serializeObject: function (form) {
                    var o = {};
                    var a = form.serializeArray();
                    $.each(a, function () {
                        if (o[this.name] !== undefined) {
                            if (!o[this.name].push) {
                                o[this.name] = [o[this.name]];
                            }
                            o[this.name].push(this.value || '');
                        } else {
                            o[this.name] = this.value || '';
                        }
                    });
                    return o;
                },
                // high density test
                isHighDensity: function () {
                    return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
                },
                // touch device test
                isTouchDevice: function () {
                    return !!('ontouchstart' in window);
                },
                // local storage test
                lsTest: function () {
                    var test = 'test';
                    try {
                        localStorage.setItem(test, test);
                        localStorage.removeItem(test);
                        return true;
                    } catch (e) {
                        return false;
                    }
                },
                // show/hide card
                card_show_hide: function (card, begin_callback, complete_callback, callback_element) {
                    $(card)
                        .velocity({
                            scale: 0,
                            opacity: 0.2
                        }, {
                            duration: 400,
                            easing: [0.4, 0, 0.2, 1],
                            // on begin callback
                            begin: function () {
                                if (typeof begin_callback !== 'undefined') {
                                    begin_callback(callback_element);
                                }
                            },
                            // on complete callback
                            complete: function () {
                                if (typeof complete_callback !== 'undefined') {
                                    complete_callback(callback_element);
                                }
                            }
                        })
                        .velocity('reverse');
                }
            };
        }]
    )
;

angular
    .module("ConsoleLogger", [])
    // router.ui debug
    // app.js (run section "PrintToConsole")
    .factory("PrintToConsole", [
        "$rootScope",
        function ($rootScope) {
            var handler = { active: false };
            handler.toggle = function () { handler.active = !handler.active; };

            if (handler.active) {
                console.log($state + ' = ' + $state.current.name);
                console.log($stateParams + '=' + $stateParams);
                console.log($state_full_url + '=' + $state.$current.url.source);
                console.log(Card_fullscreen + '=' + card_fullscreen);

                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    console.log("$stateChangeStart --- event, toState, toParams, fromState, fromParams");
                    console.log(arguments);
                });
                $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                    console.log("$stateChangeError --- event, toState, toParams, fromState, fromParams, error");
                    console.log(arguments);
                });
                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    console.log("$stateChangeSuccess --- event, toState, toParams, fromState, fromParams");
                    console.log(arguments);
                });
                $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
                    console.log("$viewContentLoading --- event, viewConfig");
                    console.log(arguments);
                });
                $rootScope.$on('$viewContentLoaded', function (event) {
                    console.log("$viewContentLoaded --- event");
                    console.log(arguments);
                });
                $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                    console.log("$stateNotFound --- event, unfoundState, fromState, fromParams");
                    console.log(arguments);
                });
            }

            return handler;
        }
    ])
;
altairApp
    .service('detectBrowser', [
        '$window',
        function($window) {
            // http://stackoverflow.com/questions/22947535/how-to-detect-browser-using-angular
            return function() {
                var userAgent = $window.navigator.userAgent,
                    browsers  = {
                        chrome  : /chrome/i,
                        safari  : /safari/i,
                        firefox : /firefox/i,
                        ie      : /internet explorer/i
                    };

                for ( var key in browsers ) {
                    if ( browsers[key].test(userAgent) ) {
                        return key;
                    }
                }
                return 'unknown';
            }
        }
    ])
    .service('preloaders', [
        '$rootScope',
        '$timeout',
        'utils',
        function($rootScope,$timeout,utils) {
            $rootScope.content_preloader_show = function(style,container) {
                var $body = $('body');
                if(!$body.find('.content-preloader').length) {
                    var image_density = utils.isHighDensity() ? '@2x' : '' ;

                    var preloader_content = (typeof style !== 'undefined' && style == 'regular')
                        ? '<img src="assets/img/spinners/spinner' + image_density + '.gif" alt="" width="32" height="32">'
                        : '<div class="md-preloader"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="32" width="32" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="8"/></svg></div>';

                    var thisContainer = (typeof container !== 'undefined') ? container : $body;

                    thisContainer.append('<div class="content-preloader">' + preloader_content + '</div>');
                    $timeout(function() {
                        $('.content-preloader').addClass('preloader-active');
                    });
                }
            };
            $rootScope.content_preloader_hide = function() {
                var $body = $('body');
                if($body.find('.content-preloader').length) {
                    // hide preloader
                    $('.content-preloader').removeClass('preloader-active');
                    // remove preloader
                    $timeout(function() {
                        $('.content-preloader').remove();
                    }, 500);
                }
            };

        }
    ])
;
/*
*  Altair Admin AngularJS
*  directives
*/
;'use strict';

altairApp
    // page title
    .directive('pageTitle', [
        '$rootScope',
        '$timeout',
        function($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function() {
                    var listener = function(event, toState) {
                        var default_title = 'Altair Admin';
                        $timeout(function() {
                            $rootScope.page_title = (toState.data && toState.data.pageTitle)
                                ? default_title + ' - ' + toState.data.pageTitle : default_title;
                        });
                    };
                    $rootScope.$on('$stateChangeSuccess', listener);
                }
            }
        }
    ])
    // add width/height properities to Image
    .directive('addImageProp', [
        '$timeout',
        'utils',
        function ($timeout,utils) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    elem.on('load', function () {
                        $timeout(function() {
                            var w = !utils.isHighDensity() ? $(elem).actual('width') : $(elem).actual('width')/2,
                                h = !utils.isHighDensity() ? $(elem).actual('height') : $(elem).actual('height')/2;
                            $(elem).attr('width',w).attr('height',h);
                        })
                    });
                }
            };
        }
    ])
    // print page
    .directive('printPage', [
        '$rootScope',
        '$timeout',
        function ($rootScope,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    var message = attrs['printMessage'];
                    $(elem).on('click', function(e) {
                        e.preventDefault();
                        UIkit.modal.confirm(message ? message : 'Do you want to print this page?', function () {
                            // hide sidebar
                            $rootScope.primarySidebarActive = false;
                            $rootScope.primarySidebarOpen = false;
                            // wait for dialog to fully hide
                            $timeout(function () {
                                window.print();
                            }, 300)
                        }, {
                            labels: {
                                'Ok': 'print'
                            }
                        });
                    });
                }
            };
        }
    ])
    // full screen
    .directive('fullScreenToggle', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $(elem).on('click', function(e) {
                        e.preventDefault();
                        screenfull.toggle();
                        $(window).resize();
                    });
                }
            };
        }
    ])
    // single card
    .directive('singleCard', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {

                    var $md_card_single = $(elem),
                        w = angular.element($window);

                    function md_card_content_height() {
                        var content_height = w.height() - ((48 * 2) + 12);
                        $md_card_single.find('.md-card-content').innerHeight(content_height);
                    }

                    $timeout(function() {
                        md_card_content_height();
                    },100);

                    w.on('resize', function(e) {
                        // Reset timeout
                        $timeout.cancel(scope.resizingTimer);
                        // Add a timeout to not call the resizing function every pixel
                        scope.resizingTimer = $timeout( function() {
                            md_card_content_height();
                            return scope.$apply();
                        }, 280);
                    });

                }
            }
        }
    ])
    // outside list
    .directive('listOutside', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr) {

                    var $md_list_outside_wrapper = $(elem),
                        w = angular.element($window);

                    function md_list_outside_height() {
                        var content_height = w.height() - ((48 * 2) + 10);
                        $md_list_outside_wrapper.height(content_height);
                    }

                    md_list_outside_height();

                    w.on('resize', function(e) {
                        // Reset timeout
                        $timeout.cancel(scope.resizingTimer);
                        // Add a timeout to not call the resizing function every pixel
                        scope.resizingTimer = $timeout( function() {
                            md_list_outside_height();
                            return scope.$apply();
                        }, 280);
                    });

                }
            }
        }
    ])
    // callback on last element in ng-repeat
    .directive('onLastRepeat', function ($timeout) {
        return function (scope, element, attrs) {
            if (scope.$last) {
                $timeout(function () {
                    scope.$emit('onLastRepeat', element, attrs);
                })
            }
        };
    })
    // check table row
    .directive('tableCheckAll', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr) {

                    var $checkRow = $(elem).closest('table').find('.check_row');

                    $(elem)
                        .on('ifChecked',function() {
                            $checkRow.iCheck('check');
                        })
                        .on('ifUnchecked',function() {
                            $checkRow.iCheck('uncheck');
                        });

                }
            }
        }
    ])
    // table row check
    .directive('tableCheckRow', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attr, ngModel) {

                    var $this = $(elem);

                    scope.$watch(function () {
                        return ngModel.$modelValue;
                    }, function(newValue) {
                        if(newValue) {
                            $this.closest('tr').addClass('row_checked');
                        } else {
                            $this.closest('tr').removeClass('row_checked');
                        }
                    });

                }
            }
        }
    ])
    // dynamic form fields
    .directive('formDynamicFields', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr, ngModel) {

                    var $this = $(elem);
                    // clone section
                    $this.on('click','.btnSectionClone', function(e) {
                        e.preventDefault();
                        var $this = $(this),
                            section_to_clone = $this.attr('data-section-clone'),
                            section_number = $(section_to_clone).parent().children('[data-section-added]:last').attr('data-section-added') ? parseInt($(section_to_clone).parent().children('[data-section-added]:last').attr('data-section-added')) + 1 : 1,
                            cloned_section = $(section_to_clone).clone();

                        cloned_section
                            .attr('data-section-added',section_number)
                            .removeAttr('id')
                            // inputs
                            .find('.md-input').each(function(index) {
                                var $thisInput = $(this),
                                    name = $thisInput.attr('name');

                                $thisInput
                                    .val('')
                                    .attr('name',name ? name + '[s_'+section_number +':i_'+ index +']' : '[s_'+section_number +':i_'+ index +']')

                                //altair_md.update_input($thisInput);
                            })
                            .end()
                            // replace clone button with remove button
                            .find('.btnSectionClone').replaceWith('<a href="#" class="btnSectionRemove"><i class="material-icons md-24">&#xE872;</i></a>')
                            .end()
                            // clear checkboxes
                            .find('[data-md-icheck]:checkbox').each(function(index) {
                                var $thisInput = $(this),
                                    name = $thisInput.attr('name'),
                                    id = $thisInput.attr('id'),
                                    $inputLabel = cloned_section.find('label[for="'+ id +'"]'),
                                    newName = name ? name + '-s'+section_number +':cb'+ index +'' : 's'+section_number +':cb'+ index,
                                    newId = id ? id + '-s'+section_number +':cb'+ index +'' : 's'+section_number +':cb'+ index;

                                $thisInput
                                    .attr('name', newName)
                                    .attr('id', newId)
                                    .removeAttr('style').removeAttr('checked').unwrap().next('.iCheck-helper').remove();

                                $inputLabel.attr('for', newId);
                            })
                            .end()
                            // clear radio
                            .find('.dynamic_radio').each(function(index) {
                                var $this = $(this),
                                    thisIndex = index;

                                $this.find('[data-md-icheck]').each(function(index) {
                                    var $thisInput = $(this),
                                        name = $thisInput.attr('name'),
                                        id = $thisInput.attr('id'),
                                        $inputLabel = cloned_section.find('label[for="'+ id +'"]'),
                                        newName = name ? name + '-s'+section_number +':cb'+ thisIndex +'' : '[s'+section_number +':cb'+ thisIndex,
                                        newId = id ? id + '-s'+section_number +':cb'+ index +'' : 's'+section_number +':cb'+ index;

                                    $thisInput
                                        .attr('name', newName)
                                        .attr('id', newId)
                                        .attr('data-parsley-multiple', newName)
                                        .removeAttr('data-parsley-id')
                                        .removeAttr('style').removeAttr('checked').unwrap().next('.iCheck-helper').remove();

                                    $inputLabel.attr('for', newId);
                                })
                            })
                            .end()
                            // switchery
                            .find('[data-switchery]').each(function(index) {
                                var $thisInput = $(this),
                                    name = $thisInput.attr('name'),
                                    id = $thisInput.attr('id'),
                                    $inputLabel = cloned_section.find('label[for="'+ id +'"]'),
                                    newName = name ? name + '-s'+section_number +':sw'+ index +'' : 's'+section_number +':sw'+ index,
                                    newId = id ? id + '-s'+section_number +':sw'+ index +'' : 's'+section_number +':sw'+ index;

                                $thisInput
                                    .attr('name', newName)
                                    .attr('id', newId)
                                    .removeAttr('style').removeAttr('checked').next('.switchery').remove();

                                $inputLabel.attr('for', newId);

                            })
                            .end()
                            // selectize
                            .find('[data-md-selectize]').each(function(index) {
                            var $thisSelect = $(this),
                                name = $thisSelect.attr('name'),
                                id = $thisSelect.attr('id'),
                                orgSelect = $('#'+id),
                                newName = name ? name + '-s'+section_number +':sel'+ index +'' : 's'+section_number +':sel'+ index,
                                newId = id ? id + '-s'+section_number +':sel'+ index +'' : 's'+section_number +':sel'+ index;

                            // destroy selectize
                            var selectize = orgSelect[0].selectize;
                            if(selectize) {
                                selectize.destroy();
                                orgSelect.val('').next('.selectize_fix').remove();
                                var clonedOptions = orgSelect.html();
                                altair_forms.select_elements(orgSelect.parent());

                                $thisSelect
                                    .html(clonedOptions)
                                    .attr('name', newName)
                                    .attr('id', newId)
                                    .removeClass('selectized')
                                    .next('.selectize-control').remove()
                                    .end()
                                    .next('.selectize_fix').remove();
                            }

                        });

                        $(section_to_clone).before(cloned_section);

                        var $newSection = $(section_to_clone).prev();

                        if($newSection.hasClass('form_section_separator')) {
                            $newSection.after('<hr class="form_hr">')
                        }

                        // reinitialize checkboxes
                        //altair_md.checkbox_radio($newSection.find('[data-md-icheck]'));
                        // reinitialize switches
                        //altair_forms.switches($newSection);
                        // reinitialize selectize
                        //altair_forms.select_elements($newSection);

                    });

                    // remove section
                    $this.on('click', '.btnSectionRemove', function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        $this
                            .closest('.form_section')
                            .next('hr').remove()
                            .end()
                            .remove();
                    })

                }
            }
        }
    ])
    // content sidebar
    .directive('contentSidebar', [
        '$rootScope',
        '$document',
        function ($rootScope,$document) {
            return {
                restrict: 'A',
                link: function(scope,el,attr) {

                    if(!$rootScope.header_double_height) {
                        $rootScope.$watch('hide_content_sidebar', function() {
                            if($rootScope.hide_content_sidebar) {
                                $('#page_content').css('max-height', $('html').height() - 40);
                                $('html').css({
                                    'paddingRight': scrollbarWidth(),
                                    'overflow': 'hidden'
                                });
                            } else {
                                $('#page_content').css('max-height','');
                                $('html').css({
                                    'paddingRight': '',
                                    'overflow': ''
                                });
                            }
                        });

                    }
                }
            }
        }
    ])
    // attach events to document
    .directive('documentEvents', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        function ($rootScope, $window, $timeout,variables) {
            return {
                restrict: 'A',
                link: function(scope,el,attr) {

                    var hidePrimarySidebar = function() {
                        $rootScope.primarySidebarActive = false;
                        $rootScope.primarySidebarOpen = false;
                        $rootScope.hide_content_sidebar = false;
                        $rootScope.primarySidebarHiding = true;
                        $timeout(function() {
                            $rootScope.primarySidebarHiding = false;
                        },280);
                    };

                    var hideSecondarySidebar = function() {
                        $rootScope.secondarySidebarActive = false;
                    };

                    var hideMainSearch = function() {
                        var $header_main = $('#header_main');
                        $header_main
                            .children('.header_main_search_form')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $header_main.velocity("reverse");
                                    $rootScope.mainSearchActive = false;
                                },
                                complete: function() {
                                    $header_main
                                        .children('.header_main_content')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').blur().val('');
                                            }
                                        })
                                }
                            });
                    };

                    // hide components on $document click
                    scope.onClick = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$($event.target).closest('#sidebar_main').length && !$($event.target).closest('#sSwitch_primary').length && !$rootScope.largeScreen) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( $rootScope.secondarySidebarActive && !$($event.target).closest('#sidebar_secondary').length && !$($event.target).closest('#sSwitch_secondary').length) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && !$($event.target).closest('.header_main_search_form').length && !$($event.target).closest('#main_search_btn').length) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && !$($event.target).closest('#style_switcher').length) {
                            $rootScope.styleSwitcherActive = false;
                        }
                    };

                    // hide components on key press (esc)
                    scope.onKeyUp = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$rootScope.largeScreen && $event.keyCode == 27) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( $rootScope.secondarySidebarActive && $event.keyCode == 27) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && $event.keyCode == 27) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && $event.keyCode == 27) {
                            $rootScope.styleSwitcherActive = false;
                        }

                    };

                }
            };
        }
    ])
    // main search show
    .directive('mainSearchShow', [
        '$rootScope',
        '$window',
        'variables',
        '$timeout',
        function ($rootScope, $window, variables, $timeout) {
            return {
                restrict: 'E',
                template: '<a id="main_search_btn" class="user_action_icon" ng-click="showSearch()"><i class="material-icons md-24 md-light">&#xE8B6;</i></a>',
                replace: true,
                scope: true,
                link: function(scope,el,attr) {
                    scope.showSearch = function() {

                        $('#header_main')
                            .children('.header_main_content')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $rootScope.mainSearchActive = true;
                                },
                                complete: function() {
                                    $('#header_main')
                                        .children('.header_main_search_form')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').focus();
                                            }
                                        })
                                }
                            });
                    };
                }
            };
        }
    ])
    // main search hide
    .directive('mainSearchHide', [
        '$rootScope',
        '$window',
        'variables',
        function ($rootScope, $window, variables) {
            return {
                restrict: 'E',
                template: '<i class="md-icon header_main_search_close material-icons" ng-click="hideSearch()">&#xE5CD;</i>',
                replace: true,
                scope: true,
                link: function(scope,el,attr) {
                    scope.hideSearch = function () {

                        var $header_main = $('#header_main');

                        $header_main
                            .children('.header_main_search_form')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $header_main.velocity("reverse");
                                    $rootScope.mainSearchActive = false;
                                },
                                complete: function() {
                                    $header_main
                                        .children('.header_main_content')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').blur().val('');
                                            }
                                        })
                                }
                            });

                    };
                }
            };
        }
    ])

    // primary sidebar
    .directive('sidebarPrimary', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        function ($rootScope, $window, $timeout,variables) {
            return {
                restrict: 'A',
                scope: 'true',
                link: function(scope,el,attr) {

                    var $sidebar_main = $('#sidebar_main');

                    scope.submenuToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $($event.currentTarget),
                            slideToogle = $this.next('ul').is(':visible') ? 'slideUp' : 'slideDown';

                        $this.next('ul')
                            .velocity(slideToogle, {
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    if(slideToogle == 'slideUp') {
                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                    } else {
                                        if($rootScope.menuAccordionMode) {
                                            $this.closest('li').siblings('.submenu_trigger').each(function() {
                                                $(this).children('ul').velocity('slideUp', {
                                                    duration: 500,
                                                    easing: variables.easing_swiftOut,
                                                    begin: function() {
                                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                                    }
                                                })
                                            })
                                        }
                                        $(this).closest('.submenu_trigger').addClass('act_section')
                                    }
                                },
                                complete: function() {
                                    if(slideToogle !== 'slideUp') {
                                        var scrollContainer = $sidebar_main.find(".scroll-content").length ? $sidebar_main.find(".scroll-content") :  $sidebar_main.find(".scrollbar-inner");
                                        $this.closest('.act_section').velocity("scroll", {
                                            duration: 500,
                                            easing: variables.easing_swiftOut,
                                            container: scrollContainer
                                        });
                                    }
                                }
                            });
                    };

                    $rootScope.$watch('slimSidebarActive', function ( status ) {
                        if(status) {
                            var $body = $('body');
                            $sidebar_main
                                .mouseenter(function() {
                                    $body.removeClass('sidebar_slim_inactive');
                                    $body.addClass('sidebar_slim_active');
                                })
                                .mouseleave(function() {
                                    $body.addClass('sidebar_slim_inactive');
                                    $body.removeClass('sidebar_slim_active');
                                })
                       }
                    });

                }
            };
        }
    ])
    // toggle primary sidebar
    .directive('sidebarPrimaryToggle', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<a id="sSwitch_primary" href="#" class="sSwitch sSwitch_left" ng-click="togglePrimarySidebar($event)" ng-hide="miniSidebarActive || slimSidebarActive || topMenuActive"><span class="sSwitchIcon"></span></a>',
                link: function (scope, el, attrs) {
                    scope.togglePrimarySidebar = function ($event) {

                        $event.preventDefault();

                        if($rootScope.primarySidebarActive) {
                            $rootScope.primarySidebarHiding = true;
                            if($rootScope.largeScreen) {
                                $timeout(function() {
                                    $rootScope.primarySidebarHiding = false;
                                    $(window).resize();
                                },290);
                            }
                        } else {
                            if($rootScope.largeScreen) {
                                $timeout(function() {
                                    $(window).resize();
                                },290);
                            }
                        }

                        $rootScope.primarySidebarActive = !$rootScope.primarySidebarActive;

                        if( !$rootScope.largeScreen ) {
                            $rootScope.hide_content_sidebar = $rootScope.primarySidebarActive ? true : false;
                        }

                        if($rootScope.primarySidebarOpen) {
                            $rootScope.primarySidebarOpen = false;
                            $rootScope.primarySidebarActive = false;
                        }
                    };

                }
            };
        }
    ])
    // secondary sidebar
    .directive('sidebarSecondary', [
        '$rootScope',
        '$timeout',
        'variables',
        function ($rootScope,$timeout,variables) {
            return {
                restrict: 'A',
                link: function(scope,el,attrs) {
                    $rootScope.sidebar_secondary = true;
                    if(attrs.toggleHidden == 'large') {
                        $rootScope.secondarySidebarHiddenLarge = true;
                    }

                    // chat
                    var $sidebar_secondary = $(el);
                    if($sidebar_secondary.find('.md-list.chat_users').length) {

                        $('.md-list.chat_users').on('click', 'li', function() {
                            $('.md-list.chat_users').velocity("transition.slideRightBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                complete: function() {
                                    $sidebar_secondary
                                        .find('.chat_box_wrapper')
                                        .addClass('chat_box_active')
                                        .velocity("transition.slideRightBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            begin: function() {
                                                $sidebar_secondary.addClass('chat_sidebar')
                                            }
                                        })
                                }
                            });
                        });

                        $sidebar_secondary
                            .find('.chat_sidebar_close')
                            .on('click',function() {
                                $sidebar_secondary
                                    .find('.chat_box_wrapper')
                                    .removeClass('chat_box_active')
                                    .velocity("transition.slideRightBigOut", {
                                        duration: 280,
                                        easing: variables.easing_swiftOut,
                                        complete: function () {
                                            $sidebar_secondary.removeClass('chat_sidebar');
                                            $('.md-list.chat_users').velocity("transition.slideRightBigIn", {
                                                duration: 280,
                                                easing: variables.easing_swiftOut
                                            })
                                        }
                                    })
                            });

                        if($sidebar_secondary.find('.uk-tab').length) {
                            $sidebar_secondary.find('.uk-tab').on('change.uk.tab',function(event, active_item, previous_item) {
                                if($(active_item).hasClass('chat_sidebar_tab') && $sidebar_secondary.find('.chat_box_wrapper').hasClass('chat_box_active')) {
                                    $sidebar_secondary.addClass('chat_sidebar')
                                } else {
                                    $sidebar_secondary.removeClass('chat_sidebar')
                                }
                            })
                        }
                    }

                }
            };
        }
    ])
    // toggle secondary sidebar
    .directive('sidebarSecondaryToggle', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                template: '<a href="#" id="sSwitch_secondary" class="sSwitch sSwitch_right" ng-show="sidebar_secondary" ng-click="toggleSecondarySidebar($event)"><span class="sSwitchIcon"></span></a>',
                link: function (scope, el, attrs) {
                    scope.toggleSecondarySidebar = function ($event) {
                        $event.preventDefault();
                        $rootScope.secondarySidebarActive = !$rootScope.secondarySidebarActive;
                    };
                }
            };
        }
    ])
    // activate card fullscreen
    .directive('cardFullscreenActivate', [
        '$rootScope',
        'variables',
        function ($rootScope, variables) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-fullscreen-activate" ng-click="cardFullscreenActivate($event)">&#xE5D0;</i>',
                link: function (scope, el, attrs) {
                    scope.cardFullscreenActivate = function ($event) {
                        $event.preventDefault();

                        var $thisCard = $(el).closest('.md-card'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed'),
                            mdCard_h = $thisCard.height(),
                            mdCard_w = $thisCard.width(),
                            body_scroll_top = $('body').scrollTop(),
                            mdCard_offset = $thisCard.offset();

                        // create placeholder for card
                        $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
                        // add overflow hidden to #page_content (fix for ios)
                        //$body.addClass('md-card-fullscreen-active');
                        // add width/height to card (preserve original size)
                        $thisCard
                            .addClass('md-card-fullscreen')
                            .css({
                                'width': mdCard_w,
                                'height': mdCard_h,
                                'left': mdCard_offset.left,
                                'top': mdCard_offset.top - body_scroll_top
                            })
                            // animate card to top/left position
                            .velocity({
                                left: 0,
                                top: 0
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    $rootScope.card_fullscreen = true;
                                    $rootScope.hide_content_sidebar = true;
                                    // add back button
                                    //$thisCard.find('.md-card-toolbar').prepend('<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left">&#xE5C4;</span>');
                                    //altair_page_content.hide_content_sidebar();
                                }
                            })
                            // resize card to full width/height
                            .velocity({
                                height: '100%',
                                width: '100%'
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // activate onResize callback for some js plugins
                                    //$(window).resize();
                                    // show fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                        duration: 400,
                                        easing: variables.easing_swiftOut,
                                        complete: function(elements) {
                                            // activate onResize callback for some js plugins
                                            $(window).resize();
                                        }
                                    });
                                    if(mdCardToolbarFixed) {
                                        $thisCard.addClass('mdToolbar_fixed')
                                    }
                                }
                            });
                    }
                }
            }
        }
    ])
    // deactivate card fullscreen
    .directive('cardFullscreenDeactivate', [
        '$rootScope',
        '$window',
        'variables',
        function ($rootScope, $window, variables) {
            return {
                restrict: 'E',
                replace: true,
                template: '<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left" ng-show="card_fullscreen" ng-click="cardFullscreenDeactivate($event)">&#xE5C4;</span>',
                link: function (scope, el, attrs) {
                    scope.cardFullscreenDeactivate = function ($event) {
                        $event.preventDefault();

                        // get card placeholder width/height and offset
                        var $thisPlaceholderCard = $('.md-card-placeholder'),
                            mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                            mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                            body_scroll_top = $('body').scrollTop(),
                            mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top - body_scroll_top,
                            mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                            $thisCard = $('.md-card-fullscreen'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed');

                        $thisCard
                            // resize card to original size
                            .velocity({
                                height: mdPlaceholderCard_h,
                                width: mdPlaceholderCard_w
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    // hide fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideDownOut",{ duration: 280, easing: variables.easing_swiftOut });
                                    $rootScope.card_fullscreen = false;
                                    if(mdCardToolbarFixed) {
                                        $thisCard.removeClass('mdToolbar_fixed')
                                    }
                                },
                                complete: function(elements) {
                                    $rootScope.hide_content_sidebar = false;
                                }
                            })
                            // move card to original position
                            .velocity({
                                left: mdPlaceholderCard_offset_left,
                                top: mdPlaceholderCard_offset_top
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // remove some styles added by velocity.js
                                    $thisCard.removeClass('md-card-fullscreen').css({
                                        width: '',
                                        height: '',
                                        left: '',
                                        top: ''
                                    });
                                    // remove card placeholder
                                    $thisPlaceholderCard.remove();
                                    $(window).resize();
                                }
                            })

                    }
                }
            }
        }
    ])
    // fullscren on card click
    .directive('cardFullscreenWhole', [
        '$rootScope',
        'variables',
        function ($rootScope, variables) {
            return {
                restrict: 'A',
                replace: true,
                scope: true,
                link: function (scope, el, attrs) {

                    $(el).on('click',function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        if(!$this.hasClass('md-card-fullscreen')) {
                            scope.cardFSActivate();
                        }
                    });

                    $(el).on('click','.cardFSDeactivate',function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        if(!$this.hasClass('md-card-fullscreen')) {
                            scope.cardFSDeactivate();
                        }
                    });

                    scope.cardFSActivate = function () {
                        var $thisCard = $(el),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed'),
                            mdCard_h = $thisCard.height(),
                            mdCard_w = $thisCard.width();

                        // create placeholder for card
                        $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
                        // add width/height to card (preserve original size)
                        $thisCard
                            .addClass('md-card-fullscreen')
                            .css({
                                'width': mdCard_w,
                                'height': mdCard_h
                            })
                            // animate card to top/left position
                            .velocity({
                                left: 0,
                                top: 0
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    $rootScope.card_fullscreen = true;
                                    $rootScope.hide_content_sidebar = true;
                                    // add back button
                                    $thisCard.append('<span class="md-icon material-icons uk-position-top-right cardFSDeactivate" style="margin:10px 10px 0 0">&#xE5CD;</span>')
                                }
                            })
                            // resize card to full width/height
                            .velocity({
                                height: '100%',
                                width: '100%'
                            }, {
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // show fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                        duration: 400,
                                        easing: variables.easing_swiftOut,
                                        complete: function(elements) {
                                            // activate onResize callback for some js plugins
                                            $(window).resize();
                                        }
                                    });
                                    if(mdCardToolbarFixed) {
                                        $thisCard.addClass('mdToolbar_fixed')
                                    }
                                }
                            });
                    };
                    scope.cardFSDeactivate = function () {
                        // get card placeholder width/height and offset
                        var $thisPlaceholderCard = $('.md-card-placeholder'),
                            mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                            mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                            mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top,
                            mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                            $thisCard = $('.md-card-fullscreen'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed');

                        $thisCard
                        // resize card to original size
                            .velocity({
                                height: mdPlaceholderCard_h,
                                width: mdPlaceholderCard_w
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    // hide fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideDownOut",{ duration: 280, easing: variables.easing_swiftOut });
                                    $rootScope.card_fullscreen = false;
                                    if(mdCardToolbarFixed) {
                                        $thisCard.removeClass('mdToolbar_fixed')
                                    }
                                    $thisCard.find('.cardFSDeactivate').remove();
                                },
                                complete: function(elements) {
                                    $rootScope.hide_content_sidebar = false;
                                }
                            })
                            // move card to original position
                            .velocity({
                                left: mdPlaceholderCard_offset_left,
                                top: mdPlaceholderCard_offset_top
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // remove some styles added by velocity.js
                                    $thisCard.removeClass('md-card-fullscreen').css({
                                        width: '',
                                        height: '',
                                        left: '',
                                        top: ''
                                    });
                                    // remove card placeholder
                                    $thisPlaceholderCard.remove();
                                    $(window).resize();
                                }
                            })

                    };
                }
            }
        }
    ])
    // card close
    .directive('cardClose', [
        'utils',
        function (utils) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-close" ng-click="cardClose($event)">&#xE14C;</i>',
                link: function (scope, el, attrs) {
                    scope.cardClose = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card'),
                            removeCard = function() {
                                $(thisCard).remove();
                                $(window).resize();
                            };

                        utils.card_show_hide(thisCard,undefined,removeCard);

                    }
                }
            }
        }
    ])
    // card toggle
    .directive('cardToggle', [
        'variables',
        function (variables) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-toggle" ng-click="cardToggle($event)">&#xE316;</i>',
                link: function (scope, el, attrs) {

                    scope.cardToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card');

                        $(thisCard).toggleClass('md-card-collapsed').children('.md-card-content').slideToggle('280', variables.bez_easing_swiftOut);

                        $this.velocity({
                            scale: 0,
                            opacity: 0.2
                        }, {
                            duration: 280,
                            easing: variables.easing_swiftOut,
                            complete: function() {
                                $(thisCard).hasClass('md-card-collapsed') ? $this.html('&#xE313;') : $this.html('&#xE316;');
                                $this.velocity('reverse');
                                $(window).resize();
                            }
                        });
                    };

                    // hide card content on page load
                    var thisCard = $(el).closest('.md-card');
                    if(thisCard.hasClass('md-card-collapsed')) {
                        var $this_toggle = thisCard.find('.md-card-toggle');

                        $this_toggle.html('&#xE313;');
                        thisCard.children('.md-card-content').hide();
                    }

                }
            }
        }
    ])
    // card overlay toggle
    .directive('cardOverlayToggle', [
        function () {
            return {
                restrict: 'E',
                template: '<i class="md-icon material-icons" ng-click="toggleOverlay($event)">&#xE5D4;</i>',
                replace: true,
                scope: true,
                link: function (scope, el, attrs) {

                    if(el.closest('.md-card').hasClass('md-card-overlay-active')) {
                        el.html('&#xE5CD;')
                    }

                    scope.toggleOverlay = function ($event) {

                        $event.preventDefault();

                        if(!el.closest('.md-card').hasClass('md-card-overlay-active')) {
                            el
                                .html('&#xE5CD;')
                                .closest('.md-card').addClass('md-card-overlay-active');

                        } else {
                            el
                                .html('&#xE5D4;')
                                .closest('.md-card').removeClass('md-card-overlay-active');
                        }

                    }
                }
            }
        }
    ])
    // card toolbar progress
    .directive('cardProgress', [
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, el, attrs) {

                    var $this = $(el).children('.md-card-toolbar'),
                        bg_percent = parseInt(attrs.cardProgress);


                    function updateCard(percent) {
                        var bg_color_default = $this.attr('card-bg-default');

                        var bg_color = !bg_color_default ? $this.css('backgroundColor') : bg_color_default;
                        if(!bg_color_default) {
                            $this.attr('card-bg-default',bg_color)
                        }

                        $this
                            .css({ 'background': '-moz-linear-gradient(left, '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'})
                            .css({ 'background': '-webkit-linear-gradient(left, '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'})
                            .css({ 'background': 'linear-gradient(to right,  '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'});


                        scope.cardPercentage = percent;
                    }

                    updateCard(bg_percent);

                    scope.$watch(function() {
                        return $(el).attr('card-progress')
                    }, function(newValue) {
                        updateCard(newValue);
                    });

                }
            }
        }
    ])
    // custom scrollbar
    .directive('customScrollbar', [
        '$rootScope',
        '$timeout',
        function ($rootScope,$timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, el, attrs) {

                    // check if mini sidebar is enabled
                    if(attrs['id'] == 'sidebar_main' && $rootScope.miniSidebarActive) {
                        return;
                    }

                    $(el)
                        .addClass('uk-height-1-1')
                        .wrapInner("<div class='scrollbar-inner'></div>");

                    if(Modernizr.touch) {
                        $(el).children('.scrollbar-inner').addClass('touchscroll');
                    } else {
                        $timeout(function() {
                            $(el).children('.scrollbar-inner').scrollbar({
                                disableBodyScroll: true,
                                scrollx: false,
                                duration: 100
                            });
                        })
                    }

                }
            }
        }
    ])
    // material design inputs
    .directive('mdInput',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '='
                },
                controller: function ($scope,$element) {
                    var $elem = $($element);
                    $scope.updateInput = function() {
                        // clear wrapper classes
                        $elem.closest('.md-input-wrapper').removeClass('md-input-wrapper-danger md-input-wrapper-success md-input-wrapper-disabled');

                        if($elem.hasClass('md-input-danger')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-danger')
                        }
                        if($elem.hasClass('md-input-success')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-success')
                        }
                        if($elem.prop('disabled')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-disabled')
                        }
                        if($elem.hasClass('label-fixed')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                        if($elem.val() != '') {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                    };
                },
                link: function (scope, elem, attrs) {

                    var $elem = $(elem);

                    $timeout(function() {
                        if(!$elem.hasClass('md-input-processed')) {

                            var extraClass = '';
                            if($elem.is('[class*="uk-form-width-"]')) {
                                var elClasses = $elem.attr('class').split (' ');
                                for(var i = 0; i < elClasses.length; i++){
                                    var classPart = elClasses[i].substr(0,14);
                                    if(classPart == "uk-form-width-"){
                                        var extraClass = elClasses[i];
                                    }
                                }
                            }

                            if ($elem.prev('label').length) {
                                $elem.prev('label').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else if ($elem.siblings('[data-uk-form-password]').length) {
                                $elem.siblings('[data-uk-form-password]').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else {
                                $elem.wrap('<div class="md-input-wrapper"/>');
                            }
                            $elem
                                .addClass('md-input-processed')
                                .closest('.md-input-wrapper')
                                .append('<span class="md-input-bar '+extraClass+'"/>');
                        }

                        scope.updateInput();

                    });

                    scope.$watch(function() {
                        return $elem.attr('class'); },
                        function(newValue,oldValue){
                            if(newValue != oldValue) {
                                scope.updateInput();
                            }
                        }
                    );

                    scope.$watch(function() {
                        return $elem.val(); },
                        function(newValue,oldValue){
                            if( !$elem.is(':focus') && (newValue != oldValue) ) {
                                scope.updateInput();
                            }
                        }
                    );

                    $elem
                        .on('focus', function() {
                            $elem.closest('.md-input-wrapper').addClass('md-input-focus')
                        })
                        .on('blur', function() {
                            $timeout(function() {
                                $elem.closest('.md-input-wrapper').removeClass('md-input-focus');
                                if($elem.val() == '') {
                                    $elem.closest('.md-input-wrapper').removeClass('md-input-filled')
                                } else {
                                    $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                                }
                            },100)
                        });

                }
            }
        }
    ])
    // material design fab speed dial
    .directive('mdFabSpeedDial',[
        'variables',
        function (variables) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {
                    $(elem)
                        .append('<i class="material-icons md-fab-action-close" style="display:none">&#xE5CD;</i>')
                        .on('click',function(e) {
                            e.preventDefault();

                            var $this = $(this),
                                $this_wrapper = $this.closest('.md-fab-wrapper');

                            if(!$this_wrapper.hasClass('md-fab-active')) {
                                $this_wrapper.addClass('md-fab-active');
                            } else {
                                $this_wrapper.removeClass('md-fab-active');
                            }

                            $this.velocity({
                                scale: 0
                            },{
                                duration: 140,
                                easing: variables.easing_swiftOut,
                                complete: function() {
                                    $this.children().toggle();
                                    $this.velocity({
                                        scale: 1
                                    },{
                                        duration: 140,
                                        easing: variables.easing_swiftOut
                                    })
                                }
                            })
                        })
                        .closest('.md-fab-wrapper').find('.md-fab-small')
                        .on('click',function() {
                            $(elem).trigger('click');
                        });
                }
            }
        }
    ])
    // material design fab toolbar
    .directive('mdFabToolbar',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $fab_toolbar = $(elem);

                    $fab_toolbar
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var toolbarItems = $fab_toolbar.children('.md-fab-toolbar-actions').children().length;

                            $fab_toolbar.addClass('md-fab-animated');

                            var FAB_padding = !$fab_toolbar.hasClass('md-fab-small') ? 16 : 24,
                                FAB_size = !$fab_toolbar.hasClass('md-fab-small') ? 64 : 44;

                            setTimeout(function() {
                                $fab_toolbar
                                    .width((toolbarItems*FAB_size + FAB_padding))
                            },140);

                            setTimeout(function() {
                                $fab_toolbar.addClass('md-fab-active');
                            },420);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_toolbar.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_toolbar).length) {

                                $fab_toolbar
                                    .css('width','')
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_toolbar.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ])
    // material design fab sheet
    .directive('mdFabSheet',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {
                    var $fab_sheet = $(elem);

                    $fab_sheet
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var sheetItems = $fab_sheet.children('.md-fab-sheet-actions').children('a').length;

                            $fab_sheet.addClass('md-fab-animated');

                            setTimeout(function() {
                                $fab_sheet
                                    .width('240px')
                                    .height(sheetItems*40 + 8);
                            },140);

                            setTimeout(function() {
                                $fab_sheet.addClass('md-fab-active');
                            },280);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_sheet.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_sheet).length) {

                                $fab_sheet
                                    .css({
                                        'height':'',
                                        'width':''
                                    })
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_sheet.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ])
    // hierarchical show
    .directive('hierarchicalShow', [
        '$timeout',
        '$rootScope',
        function ($timeout,$rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {


                    var parent_el = $(elem),
                        baseDelay = 60;


                    var add_animation = function(children,length) {
                        children
                            .each(function(index) {
                                $(this).css({
                                    '-webkit-animation-delay': (index * baseDelay) + "ms",
                                    'animation-delay': (index * baseDelay) + "ms"
                                })
                            })
                            .end()
                            .waypoint({
                                element: elem[0],
                                handler: function() {
                                    parent_el.addClass('hierarchical_show_inView');
                                    setTimeout(function() {
                                        parent_el
                                            .removeClass('hierarchical_show hierarchical_show_inView fast_animation')
                                            .children()
                                            .css({
                                                '-webkit-animation-delay': '',
                                                'animation-delay': ''
                                            });
                                    }, (length*baseDelay)+1200 );
                                    this.destroy();
                                },
                                context: window,
                                offset: '90%'
                            });
                    };

                    $rootScope.$watch('pageLoaded',function() {
                       if($rootScope.pageLoaded) {
                           var children = parent_el.children(),
                               children_length = children.length;

                           $timeout(function() {
                               add_animation(children,children_length)
                           },560)

                       }
                    });

                }
            }
        }
    ])
    // hierarchical slide in
    .directive('hierarchicalSlide', [
        '$timeout',
        '$rootScope',
        function ($timeout,$rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $this = $(elem),
                        baseDelay = 100;

                    var add_animation = function(children,context,childrenLength) {
                        children.each(function(index) {
                            $(this).css({
                                '-webkit-animation-delay': (index * baseDelay) + "ms",
                                'animation-delay': (index * baseDelay) + "ms"
                            })
                        });
                        $this.waypoint({
                            handler: function() {
                                $this.addClass('hierarchical_slide_inView');
                                $timeout(function() {
                                    $this.removeClass('hierarchical_slide hierarchical_slide_inView');
                                    children.css({
                                        '-webkit-animation-delay': '',
                                        'animation-delay': ''
                                    });
                                }, (childrenLength*baseDelay)+1200 );
                                this.destroy();
                            },
                            context: context[0],
                            offset: '90%'
                        });
                    };

                    $rootScope.$watch('pageLoaded',function() {
                        if($rootScope.pageLoaded) {
                            var thisChildren = attrs['slideChildren'] ? $this.children(attrs['slideChildren']) : $this.children(),
                                thisContext = attrs['slideContext'] ? $this.closest(attrs['slideContext']) : 'window',
                                thisChildrenLength = thisChildren.length;

                            if(thisChildrenLength >= 1) {
                                $timeout(function() {
                                    add_animation(thisChildren,thisContext,thisChildrenLength)
                                },560)
                            }
                        }
                    });

                }
            }
        }
    ])
    // preloaders
    .directive('mdPreloader',[
        function () {
            return {
                restrict: 'E',
                scope: {
                    width: '=',
                    height: '=',
                    strokeWidth: '=',
                    style: '@?'
                },
                template: '<div class="md-preloader{{style}}"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" ng-attr-height="{{ height }}" ng-attr-width="{{ width }}" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" ng-attr-stroke-width="{{ strokeWidth }}"/></svg></div>',
                link: function (scope, elem, attr) {

                    scope.width = scope.width ? scope.width : 48;
                    scope.height = scope.height ? scope.height : 48;
                    scope.strokeWidth = scope.strokeWidth ? scope.strokeWidth : 4;

                    attr.$observe('warning', function() {
                        scope.style = ' md-preloader-warning'
                    });

                    attr.$observe('success', function() {
                        scope.style = ' md-preloader-success'
                    });

                    attr.$observe('danger', function() {
                        scope.style = ' md-preloader-danger'
                    });

                }
            }
        }
    ])
    .directive('preloader',[
        '$rootScope',
        'utils',
        function ($rootScope,utils) {
            return {
                restrict: 'E',
                scope: {
                    width: '=',
                    height: '=',
                    style: '@?'
                },
                template: '<img src="assets/img/spinners/{{style}}{{imgDensity}}.gif" alt="" ng-attr-width="{{width}}" ng-attr-height="{{height}}">',
                link: function (scope, elem, attrs) {

                    scope.width = scope.width ? scope.width : 32;
                    scope.height = scope.height ? scope.height : 32;
                    scope.style = scope.style ? scope.style : 'spinner';
                    scope.imgDensity = utils.isHighDensity() ? '@2x' : '' ;

                    attrs.$observe('warning', function() {
                        scope.style = 'spinner_warning'
                    });

                    attrs.$observe('success', function() {
                        scope.style = 'spinner_success'
                    });

                    attrs.$observe('danger', function() {
                        scope.style = 'spinner_danger'
                    });

                    attrs.$observe('small', function() {
                        scope.style = 'spinner_small'
                    });

                    attrs.$observe('medium', function() {
                        scope.style = 'spinner_medium'
                    });

                    attrs.$observe('large', function() {
                        scope.style = 'spinner_large'
                    });

                }
            }
        }
    ])
    // uikit components
    .directive('ukHtmlEditor',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $timeout(function() {
                        UIkit.htmleditor(elem[0], {
                            'toolbar': '',
                            'height': '240'
                        });
                    });
                }
            }
        }
    ])
    .directive('ukNotification',[
        '$window',
        function ($window) {
            return {
                restrict: 'A',
                scope: {
                    message: '@',
                    status: '@?',
                    timeout: '@?',
                    group: '@?',
                    position: '@?',
                    callback: '&?'
                },
                link: function (scope, elem, attrs) {

                    var w = angular.element($window),
                        $element = $(elem);

                    scope.showNotify = function() {
                        var thisNotify = UIkit.notify({
                            message: scope.message,
                            status: scope.status ? scope.status : '',
                            timeout: scope.timeout ? scope.timeout : 5000,
                            group: scope.group ? scope.group : '',
                            pos: scope.position ? scope.position : 'top-center',
                            onClose: function() {
                                $('body').find('.md-fab-wrapper').css('margin-bottom','');
                                clearTimeout(thisNotify.timeout);

                                if(scope.callback) {
                                    if( angular.isFunction(scope.callback()) ) {
                                        scope.$apply(scope.callback());
                                    } else {
                                        console.log('Callback is not a function');
                                    }
                                }

                            }
                        });
                        if(
                            ( (w.width() < 768) && (
                                (scope.position == 'bottom-right')
                                || (scope.position == 'bottom-left')
                                || (scope.position == 'bottom-center')
                            ) )
                            || (scope.position == 'bottom-right')
                        ) {
                            var thisNotify_height = $(thisNotify.element).outerHeight(),
                                spacer = (w.width() < 768) ? -6 : 8;
                            $('body').find('.md-fab-wrapper').css('margin-bottom',thisNotify_height + spacer);
                        }
                    };

                    $element.on("click", function(){
                        if($('body').find('.uk-notify-message').length) {
                            $('body').find('.uk-notify-message').click();
                            setTimeout(function() {
                                scope.showNotify()
                            },450)
                        } else {
                            scope.showNotify()
                        }
                    });

                }
            }
        }
    ])
    .directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }
    ])

;
altairApp
    .filter('multiSelectFilter', function () {
        return function (items, filterData) {
            if(filterData == undefined)
                return items;
            var keys = Object.keys(filterData);
            var filtered = [];
            var populate = true;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                populate = true;
                for(var j = 0; j < keys.length ; j++){
                    if(filterData[keys[j]] != undefined){
                        if(filterData[keys[j]].length == 0 || filterData[keys[j]].contains(item[keys[j]])){
                            populate = true;
                        } else {
                            populate = false;
                            break;
                        }
                    }
                }
                if(populate){
                    filtered.push(item);
                }
            }
            return filtered;
        };
    })
    .filter("jsonDate", function() {
        return function(x) {
            if(x) return new Date(x);
            else return null;
        };
    })
    .filter("momentDate", function() {
        return function(x,date_format_i,date_format_o) {
            if(x) {
                if(date_format_i) {
                    return moment(x, date_format_i).format(date_format_o)
                } else {
                    return moment(new Date(x)).format(date_format_o)
                }
            }
            else return null;
        };
    })
    .filter("initials", function() {
        return function(x) {
            if(x) {
                return x.split(' ').map(function (s) {
                    return s.charAt(0);
                }).join('');
            } else {
                return null;
            }
        };
    })
    .filter('reverseOrder', function() {
        return function(items) {
            return items.slice().reverse();
        };
    })
;
altairApp
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
            $urlRouterProvider
                .when('/', '/login')
                .otherwise('/login');

            $stateProvider
            // -- ERROR PAGES --
                .state("error", {
                    url: "/error",
                    templateUrl: 'app/views/error.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit'
                            ]);
                        }]
                    }
                })
                .state("error.404", {
                    url: "/404",
                    templateUrl: 'app/components/pages/error_404View.html'
                })
                .state("error.500", {
                    url: "/500",
                    templateUrl: 'app/components/pages/error_500View.html'
                })

                // -- NEWNETA WIFIID --
                // -- login state --
                .state("login", {
                    url: "/login",
                    templateUrl: 'app/components/digi/login/loginView.html',
                    controller: 'newnetaLoginCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_iCheck',
                                'app/components/digi/login/loginController.js',
                                'app/components/factory/SecurityModuleService.js',
                                'app/components/service/NotificationService.js'
                            ]);
                        }]
                    }
                })

                .state("register", {
                    url: "/register",
                    templateUrl: 'app/components/digi/register/registerView.html',
                    controller: 'registrationController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/digi/register/registerController.js',
                                'app/components/factory/SecurityModuleService.js',
                                'app/components/service/NotificationService.js'
                            ]);
                        }]
                    }
                })
                .state("activation", {
                    url: "/activation",
                    templateUrl: 'app/components/digi/register/activationView.html',
                    controller: 'activationController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/digi/register/activationController.js',
                                'app/components/factory/SecurityModuleService.js',
                                'app/components/service/NotificationService.js'
                            ]);
                        }]
                    }
                })
                /*
                 * ========================================================
                 * Manage by hendra
                 * */

                /*
                 * User Management
                 * */
                // -- digi state --
                .state("digi", {
                    abstract: true,
                    url: "",
                    views: {
                        'main_header': {
                            templateUrl: 'app/shared/header/headerView.html',
                            controller: 'main_headerCtrl'
                        },
                        'main_sidebar': {
                            templateUrl: 'app/shared/main_sidebar/main_sidebarView.html',
                            controller: 'main_sidebarCtrl'
                        },
                        '': {
                            templateUrl: 'app/views/restricted.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_selectizeJS',
                                'lazy_switchery',
                                'lazy_prismJS',
                                'lazy_autosize',
                                'lazy_iCheck',
                                'lazy_themes',
                                'lazy_style_switcher',
                                'app/shared/header/headerController.js',
                                'app/shared/main_sidebar/main_sidebarController.js'
                            ]);
                        }]
                    }
                })
                // -- digi user management --
                .state("digi.createuser", {
                    url: "/user/create",
                    templateUrl: 'app/components/digi/usermanagement/create/form-create-user.html',
                    controller: 'digiCreateUserCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/usermanagement/create/createUserController.js',
                                'app/components/factory/AccessModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/factory/IntegrationModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'lazy_KendoUI',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Create User'
                    },
                    ncyBreadcrumb: {
                        label: 'Create User'
                    }
                })
                .state("digi.searchuser", {
                    url: "/user/search",
                    templateUrl: 'app/components/digi/usermanagement/view/view-user.html',
                    controller: 'digiViewUserCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/usermanagement/view/ViewUserController.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/ConfigurationModuleFactory.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Search User'
                    },
                    ncyBreadcrumb: {
                        label: 'Search User'
                    }
                }).state("digi.viewdetailuser", {
                url: "/user/view/detail",
                templateUrl: 'app/components/digi/usermanagement/view-detail/view-detail-user.html',
                controller: 'digiViewDetailUserCtrl',
                params: {
                    userId: '000',

                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'bower_components/angular-resource/angular-resource.min.js',
                            'app/components/digi/usermanagement/view-detail/ViewDetailUserController.js',
                            'app/components/factory/AccessModuleFactory.js',
                            'app/components/factory/ConfigurationModuleFactory.js',
                            'app/components/factory/OrganisationModuleFactory.js',
                            'app/components/factory/IntegrationModuleFactory.js',
                            'app/components/factory/UserManagementModuleFactory.js',
                            'lazy_KendoUI',
                            'app/components/service/NotificationService.js'
                        ], {serie: true});
                    }]
                },
                data: {
                    pageTitle: 'View Detail User'
                },
                ncyBreadcrumb: {
                    label: 'View Detail User'
                }
            }).state("digi.updateuser", {
                url: "/user/update",
                templateUrl: 'app/components/digi/usermanagement/update/form-update-user.html',
                controller: 'digiUpdateUserCtrl',
                params: {
                    userId: '000',
                    organizationId: '000',
                    organizationName: '000'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'app/components/digi/usermanagement/update/updateUserController.js',
                            'app/components/factory/AccessModuleFactory.js',
                            'app/components/factory/ConfigurationModuleFactory.js',
                            'app/components/factory/OrganisationModuleFactory.js',
                            'app/components/factory/IntegrationModuleFactory.js',
                            'app/components/factory/UserManagementModuleFactory.js',
                            'lazy_KendoUI',
                            'app/components/service/NotificationService.js'
                        ], {serie: true});
                    }]
                },
                data: {
                    pageTitle: 'Update User'
                },
                ncyBreadcrumb: {
                    label: 'Update User'
                }
            })

            //---------------------------menunya newsevent-----------
                .state("digi.insertnewsevent", {
                    url: "/newsevent/insert",
                    templateUrl: 'app/components/digi/newsevent/create/f_insert_newsevent.html',
                    //controller: 'ctrl_insert_newsevent',
                    controller: 'ctrl_insert_newsevent',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ckeditor',
                                'app/components/digi/newsevent/create/ctrl_insert_newsevent.js',
                                'app/components/factory/NewsEventModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Create News & Event'
                    },
                    ncyBreadcrumb: {
                        label: 'Create News & Event'
                    }
                })

                .state("digi.updatenewsevent", {
                    url: "/newsevent/update",
                    templateUrl: 'app/components/digi/newsevent/update/f_update_newsevent.html',
                    controller: 'ctrl_update_newsevent',
                    params: {
                        newsEventId: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ckeditor',
                                'app/components/digi/newsevent/update/ctrl_update_newsevent.js',
                                'app/components/factory/NewsEventModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Update News & Event'
                    },
                    ncyBreadcrumb: {
                        label: 'Update News & Event'
                    }
                })
                .state("digi.viewnewsevent", {
                    url: "/newsevent/view",
                    templateUrl: 'app/components/digi/newsevent/view/f_view_newsevent.html',
                    controller: 'ctrl_view_newsevent',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/newsevent/view/ctrl_view_newsevent.js',
                                'app/components/factory/NewsEventModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Search News & Event'
                    },
                    ncyBreadcrumb: {
                        label: 'Search News & Event'
                    }
                })
                .state("digi.detailnewsevent", {
                    url: "/newsevent/detail",
                    templateUrl: 'app/components/digi/newsevent/view-detail/f_detail_newsevent.html',
                    controller: 'ctrl_detail_newsevent',
                    params: {
                        newsEventId: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/newsevent/view-detail/ctrl_detail_newsevent.js',
                                'app/components/factory/NewsEventModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Detail News & Event'
                    },
                    ncyBreadcrumb: {
                        label: 'View News & Event Detail'
                    }
                })
                /*
                 * =======================================================
                 * ASSIGNMENT
                 * */
                // .state("digi.searchassignment", {
                //     url: "/assignment/search",
                //     templateUrl: 'app/components/digi/assignment/search/view-assignment.html',
                //     controller: 'digiViewAssignmentCtrl',
                //     resolve: {
                //         deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'bower_components/angular-resource/angular-resource.min.js',
                //                 'lazy_datatables',
                //                 'app/components/digi/assignment/search/ViewAssignmentController.js',
                //                 'app/components/factory/AssignmentModuleFactory.js',
                //                 'app/components/service/NotificationService.js'
                //             ], {serie: true});
                //         }],
                //     },
                //     data: {
                //         pageTitle: 'Search Assignment'
                //     },
                //     ncyBreadcrumb: {
                //         label: 'Search Assignment'
                //     }
                // })
                // .state("digi.createassignment", {
                //     url: "/assignment/search",
                //     templateUrl: 'app/components/digi/assignment/search/view-assignment.html',
                //     controller: 'digiViewAssignmentCtrl',
                //     resolve: {
                //         deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'bower_components/angular-resource/angular-resource.min.js',
                //                 'lazy_datatables',
                //                 'app/components/digi/assignment/search/ViewAssignmentController.js',
                //                 'app/components/factory/AssignmentModuleFactory.js',
                //                 'app/components/service/NotificationService.js'
                //             ], {serie: true});
                //         }],
                //     },
                //     data: {
                //         pageTitle: 'Create Assignment'
                //     },
                //     ncyBreadcrumb: {
                //         label: 'Create Assignment'
                //     }
                // }).state("digi.updateassignment", {
                //     url: "/assignment/search",
                //     templateUrl: 'app/components/digi/assignment/search/view-assignment.html',
                //     controller: 'digiViewAssignmentCtrl',
                //     resolve: {
                //         deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'bower_components/angular-resource/angular-resource.min.js',
                //                 'lazy_datatables',
                //                 'app/components/digi/assignment/search/ViewAssignmentController.js',
                //                 'app/components/factory/AssignmentModuleFactory.js',
                //                 'app/components/service/NotificationService.js'
                //             ], {serie: true});
                //         }],
                //     },
                //     data: {
                //         pageTitle: 'Update Assignment'
                //     },
                //     ncyBreadcrumb: {
                //         label: 'Update Assignment'
                //     }
                // }).state("digi.viewdetailassignment", {
                //     url: "/assignment/view/details",
                //     templateUrl: 'app/components/digi/assignment/viewdetail/view-detail-assignment.html',
                //     controller: 'digiViewDetailAssignmentCtrl',
                //     params: {
                //         assignmentId: '000'
                //     },
                //     resolve: {
                //         deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'app/components/digi/assignment/viewdetail/ViewDetailAssignmentController.js',
                //                 'app/components/factory/AssignmentModuleFactory.js',
                //                 'app/components/service/NotificationService.js'
                //             ], {serie: true});
                //         }],
                //     },
                //     data: {
                //         pageTitle: 'View Detail Assignment'
                //     },
                //     ncyBreadcrumb: {
                //         label: 'View Detail Assignment'
                //     }
                // })


                /*
                 * ========================================================
                 * END
                 * */
                // -- newneta state --
                .state("newneta", {
                    abstract: true,
                    url: "",
                    views: {
                        'main_header': {
                            templateUrl: 'app/shared/header/headerView.html',
                            controller: 'main_headerCtrl'
                        },
                        'main_sidebar': {
                            templateUrl: 'app/shared/main_sidebar/main_sidebarView.html',
                            controller: 'main_sidebarCtrl'
                        },
                        '': {
                            templateUrl: 'app/views/restricted.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_selectizeJS',
                                'lazy_switchery',
                                'lazy_prismJS',
                                'lazy_autosize',
                                'lazy_iCheck',
                                'lazy_themes',
                                'lazy_style_switcher',
                                'app/shared/header/headerController.js',
                                'app/shared/main_sidebar/main_sidebarController.js'
                            ]);
                        }]
                    }
                })
                .state("newneta.dashboard_sys_pro", {
                    url: "/dashboard_sys_pro",
                    templateUrl: 'app/components/newneta/dashboard/dash_system_process/dashSysProView.html',
                    controller: 'appCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_charts_c3',
                                'app/components/newneta/dashboard/dash_system_process/dashSysProController.js']);
                        }],
                        show_file_queue_value_waiting: function ($http, ServerConfig) {
                            var param_config_ui = {
                                method: 'GET',
                                url: ServerConfig.production + '/neta/wifiid/dashboard/value/file_queue?param=Waiting',
                                headers: {}
                            };
                            return $http(param_config_ui)
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        show_file_queue_value_finished: function ($http, ServerConfig) {
                            var param_config_ui = {
                                method: 'GET',
                                url: ServerConfig.production + '/neta/wifiid/dashboard/value/file_queue?param=Finished',
                                headers: {}
                            };
                            return $http(param_config_ui)
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        show_file_queue_value_processing: function ($http, ServerConfig) {
                            var param_config_ui = {
                                method: 'GET',
                                url: ServerConfig.production + '/neta/wifiid/dashboard/value/file_queue?param=Processing',
                                headers: {}
                            };
                            return $http(param_config_ui)
                                .then(function (data) {

                                    return data.data;
                                });
                        },
                        show_file_queue_value_all: function ($http, ServerConfig) {
                            var param_config_ui = {
                                method: 'GET',
                                url: ServerConfig.production + '/neta/wifiid/dashboard/value/file_queue?param=Error',
                                headers: {}
                            };
                            return $http(param_config_ui)
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Dashboard System & Process'
                    },
                    ncyBreadcrumb: {
                        label: 'Dashboard System & Process'
                    }
                })
                // dashboard1
                .state("newneta.dashboard1", {
                    url: "/dashboard1",
                    templateUrl: 'app/components/digi/dashboard/dashboard1/dashboard1View.html',
                    controller: 'dashboard1Ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_tablesorter',
                                'lazy_charts_c3',
                                'lazy_datatables',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/digi/dashboard/dashboard1/dashboard1Controller.js',


                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/factory/DashboardReportModuleFactory.js',
                                'app/components/factory/AddHocAssignmentModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/BPILeaveRequestFactory.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'newNeta Dashboard 1'
                    },
                    ncyBreadcrumb: {
                        label: 'Dashboard System & Process'
                    }
                })
                .state("newneta.setting.user", {
                    url: "/user",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })

                // -- RESTRICTED --
                .state("restricted", {
                    abstract: true,
                    url: "",
                    views: {
                        'main_header': {
                            templateUrl: 'app/shared/header/headerView.html',
                            controller: 'main_headerCtrl'
                        },
                        'main_sidebar': {
                            templateUrl: 'app/shared/main_sidebar/main_sidebarView.html',
                            controller: 'main_sidebarCtrl'
                        },
                        '': {
                            templateUrl: 'app/views/restricted.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_selectizeJS',
                                'lazy_switchery',
                                'lazy_prismJS',
                                'lazy_autosize',
                                'lazy_iCheck',
                                'lazy_themes',
                                'lazy_style_switcher',
                                'app/shared/header/headerController.js',
                                'app/shared/main_sidebar/main_sidebarController.js'
                            ]);
                        }]
                    }
                })
                // -- DASHBOARD --
                .state("restricted.dashboard", {
                    url: "/dashboard1",
                    templateUrl: 'app/components/dashboard/dashboardView.html',
                    controller: 'dashboardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                // ocLazyLoad config (app/app.js)
                                'lazy_countUp',
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_weathericons',
                                'lazy_clndr',
                                'app/components/dashboard/dashboardController.js',
                                'app/components/factory/BPILeaveRequestFactory.js',
                            ], {serie: true});
                        }],
                        sale_chart_data: function ($http) {
                            return $http({method: 'GET', url: 'data/mg_dashboard_chart.min.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        user_data: function ($http) {
                            return $http({method: 'GET', url: 'data/user_data.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Dashboard'
                    },
                    ncyBreadcrumb: {
                        label: 'Home'
                    }
                })
                .state("digi.createlocation", {
                    url: "/location/create",
                    templateUrl: 'app/components/digi/location/create-location.html',
                    controller: 'digiCreateLocationCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([

                                'app/components/digi/location/CreateLocationController.js',
                                'app/components/factory/AccessModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/factory/LocationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Create Location'
                    },
                    ncyBreadcrumb: {
                        label: 'Create Location'
                    }
                })
                //    tambah
                .state("digi.accesstracking", {
                    url: "/accesstracking/search",
                    templateUrl: 'app/components/digi/accesstracking/search/view-accesstracking.html',
                    controller: 'digiAccessTrackingCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/accesstracking/search/AccessTrackingController.js',
                                'app/components/factory/AccessTrackingModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Access & Tracking'
                    },
                    ncyBreadcrumb: {
                        label: 'Access & Tracking'
                    }
                })

                //update accesstracking
                .state("digi.updateaccesstracking", {
                    url: "/accesstracking/update",
                    templateUrl: 'app/components/digi/accesstracking/update/update-accesstracking.html',
                    controller: 'digiAccessTrackingCtrl',
                    params: {
                        id: '000'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                /*'bower_components/angular-resource/angular-resource.min.js',
                                 'lazy_datatables',*/
                                'app/components/digi/accesstracking/search/AccessTrackingController.js',
                                'app/components/factory/AccessTrackingModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'UpdateAccess & Tracking'
                    },
                    ncyBreadcrumb: {
                        label: 'Update Access & Tracking'
                    }
                })
                //akhir
                .state("digi.accessgroupview", {
                    url: "/AccessGroup/view",
                    templateUrl: 'app/components/digi/accessgroupmanagement/view/view.html',
                    controller: 'digiViewAccessGroupCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/accessgroupmanagement/view/AccessGroupView.js',
                                'app/components/factory/accessgroupmanagementFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Search Group Access'
                    },
                    ncyBreadcrumb: {
                        label: 'Search Group Access'
                    }
                })
                .state("digi.insertgroupaccess", {
                    url: "/Access Group/create",
                    templateUrl: 'app/components/digi/accessgroupmanagement/insert/insertgroupaccess.html',
                    controller: 'digiCreateAccessGroupCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'lazy_wizard',
                                'tree_menu_tes',
                                'app/components/digi/accessgroupmanagement/insert/ctrlAccessGroup.js',
                                'app/components/factory/AccessModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/factory/accessgroupmanagementFactory.js',
                                'app/components/service/NotificationService.js',

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Create Group Access'
                    },
                    ncyBreadcrumb: {
                        label: 'Create Group Access'
                    }
                })
                .state("digi.changePassword", {
                    url: "/usermanagement/changePassword",
                    templateUrl: 'app/components/digi/usermanagement/changePassword/changePassword.html',
                    controller: 'digichangePasswordCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/usermanagement/changePassword/changePasswordController.js',
                                'app/components/factory/AccessModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Change Password'
                    },
                    ncyBreadcrumb: {
                        label: 'Change Password'
                    }
                })

                .state("digi.digiResourceAllocation", {
                    url: "/Resource/Allocation/Plan",
                    templateUrl: 'app/components/digi/resourceallocation/alocation/resource-allocation.html',
                    controller: 'digiResourceAllocation',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/resourceallocation/alocation/ResourceAllocationController.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Resource Allocation Plan'
                    },
                    ncyBreadcrumb: {
                        label: 'Resource Allocation Plan'
                    }
                })

                .state("digi.digiresourcepool", {
                    url: "/Resource/Allocation/Plan/Pool",
                    templateUrl: 'app/components/digi/resourceallocation/resource_pool/resource-pool.html',
                    controller: 'digiResourcePool',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_gantt_chart',
                                'app/components/digi/resourceallocation/resource_pool/ResourcePoolController.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Resource Pool'
                    },
                    ncyBreadcrumb: {
                        label: 'Resource Pool'
                    }
                })


                .state("digi.digiResourceAllocationPlan", {
                    url: "/Resource/Allocation/Plan/Detail",
                    templateUrl: 'app/components/digi/resourceallocation/ResourcePlan/resource-plan.html',
                    controller: 'digiResourcePlan',
                    params: {
                        projectNumber: '000'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/resourceallocation/ResourcePlan/ResourcePlanController.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Resource Plan'
                    },
                    ncyBreadcrumb: {
                        label: 'Resource Plan'
                    }
                })

                .state("digi.digiResourceProject", {
                    url: "/Resource/Allocation/Project",
                    templateUrl: 'app/components/digi/resourceallocation/change_group/showproject/resourceproject.html',
                    controller: 'digiResourceProject',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/resourceallocation/change_group/showproject/ResourceProjectController.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Resource Project'
                    },
                    ncyBreadcrumb: {
                        label: 'Resource Project'
                    }
                })

                .state("digi.digidetailproject", {
                    url: "/Resource/Allocation/Project/Detail",
                    templateUrl: 'app/components/digi/resourceallocation/change_group/showdetailproject/resource-project-detail.html',
                    controller: 'digiResourceProjectDetail',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/resourceallocation/change_group/showdetailproject/ResourceProjectDetailController.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Resource Project Detail'
                    },
                    ncyBreadcrumb: {
                        label: 'Resource Project Detail'
                    }
                })

                .state("digi.digiresourceprojectPM", {
                    url: "/Resource/ProjectPM",
                    templateUrl: 'app/components/digi/resourceallocation/View-Project-PM/searh-project-master-data.html',
                    controller: 'digiResourceProjectPM',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/resourceallocation/View-Project-PM/SearchProjectMasterDataController.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/bpi/projectmasterdata/SearchProjectMasterDataController.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Resource Project PM'
                    },
                    ncyBreadcrumb: {
                        label: 'View Resource Project PM'
                    }
                })

                .state("digi.digiresourceprojectPMDetail", {
                    url: "/Resource/ProjectPM/Detail",
                    templateUrl: 'app/components/digi/resourceallocation/View-Project-PM-detail/view-project-master-data-detail.html',
                    controller: 'digiResourceProjectPMDetail',
                    params: {
                        projectNumber: '000'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/digi/resourceallocation//View-Project-PM-detail/ViewProjectMasterDataDetailController.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Resource Project PM'
                    },
                    ncyBreadcrumb: {
                        label: 'View Resource Project PM'
                    }
                })
                // .state("digi.manageQrCode", {
                //     url: "/QrCode/mappingQrCode",
                //     templateUrl: 'app/components/digi/QrCode/mappingQrCode/insertmapping.html',
                //     controller: 'digiQrcodeMappings',
                //     resolve: {
                //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'app/components/digi/QrCode/mappingQrCode/mappingQrCodectrl.js',
                //                 'app/components/factory/Qrfactory.js',
                //                 'app/components/factory/ConfigurationModuleFactory.js',
                //                 'app/components/factory/OrganisationModuleFactory.js',
                //                 'app/components/service/NotificationService.js',
                //                 'lazy_KendoUI',
                //                 'app/components/factory/UserManagementModuleFactory.js',
                //                 'app/components/factory/AreaFactory.js'


                //             ], {serie: true} );
                //         }]
                //     },
                //     data: {
                //         pageTitle: 'Mapping Qr Code'
                //     },
                //     ncyBreadcrumb: {
                //         label: 'Mapping Qr Code'
                //     }
                // })
                .state("digi.manageQrCode", {
                    url: "/QrCode/mappingQrCode",
                    templateUrl: 'app/components/digi/QrCode/mappingQrCode/insertmapping.html',
                    controller: 'digiQrcodeMappings',
                    params: {
                        mappingid: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/QrCode/mappingQrCode/mappingQrCodectrl.js',
                                'app/components/factory/Qrfactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'lazy_KendoUI',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/factory/AreaFactory.js'


                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Mapping Qr Code'
                    },
                    ncyBreadcrumb: {
                        label: 'Mapping Qr Code'
                    }
                })

                .state("digi.updateMapping2", {
                    url: "/QrCode/updateMapping",
                    templateUrl: 'app/components/digi/QrCode/updateMapping/updateMapping.html',
                    controller: 'digiUpdateMappingCtrl',
                    params: {
                        mappingid: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/QrCode/updateMapping/updateMapping.js',
                                'app/components/factory/Qrfactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Update mapping QR Code'
                    },
                    ncyBreadcrumb: {
                        label: 'Update Mapping QR Code'
                    }
                })
                .state("digi.downloadQrcode", {
                    url: "/QrCode/downloadQrcode",
                    templateUrl: 'app/components/digi/QrCode/downloadQrcode/viewqrcode.html',
                    controller: 'Qrcodectrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/QrCode/downloadQrcode/downloadqrcode.js',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/Qrfactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Installation Mapping'
                    },
                    ncyBreadcrumb: {
                        label: 'Installation Mapping'
                    }
                })

                .state("digi.viewattendance", {
                    url: "/attendance/view",
                    templateUrl: 'app/components/digi/attendance/view/view-attendance.html',
                    controller: 'digiAttendanceCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/attendance/view/ViewAttendanceController.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Attendance'
                    },
                    ncyBreadcrumb: {
                        label: 'View Attendance'
                    }
                })


                .state("digi.viewdetailattendance", {
                    url: "/attendance/view/detail",
                    templateUrl: 'app/components/digi/attendance/view-detail/view-detail-attendance.html',
                    controller: 'digiViewDetailAttendanceCtrl',
                    params: {
                        id: '000'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                //'app/components/factory/AccessModuleFactory.js',
                                'app/components/digi/attendance/view-detail/ViewDetailAttendanceController.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                //'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Detail Attendance'
                    },
                    ncyBreadcrumb: {
                        label: 'View Detail Attendance'
                    }
                })

                .state("digi.attendancecorrection", {
                    url: "/attendance/correction",
                    templateUrl: 'app/components/digi/attendance/correction/attendance-correction.html',
                    controller: 'digiAttendaceCorrectionCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/attendance/correction/AttendanceCorrectionController.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/AttendanceModuleFactory.js',

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Service Correction'
                    },
                    ncyBreadcrumb: {
                        label: 'Service Correction'
                    }
                })


                .state("digi.attendanceovertimeapproval", {
                    url: "/customer/overtime/approval",
                    templateUrl: 'app/components/digi/customer/overtime-approval/overtime-approval.html',
                    controller: 'digiOvertimeCustomerApprovalCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([

                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/customer/overtime-approval/CustomerOvertimeApprovalController.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/factory/IntegrationModuleFactory.js',
                                'lazy_KendoUI',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Overtime Approval'
                    },
                    ncyBreadcrumb: {
                        label: 'Overtime Approval'
                    }
                })
                .state("digi.managegroupmessage", {
                    url: "/group/message",
                    templateUrl: 'app/components/digi/newsevent/groupmessage/create/manage-group-message.html',
                    controller: 'digiManageGroupMessageController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                /* 'bower_components/angular-resource/angular-resource.min.js',
                                 'lazy_datatables',*/
                                'app/components/digi/newsevent/groupmessage/create/ManageGroupMessageController.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/factory/NewsEventModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'lazy_KendoUI'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Manage Group Message'
                    },
                    ncyBreadcrumb: {
                        label: 'Manage Group Message'
                    }
                })

                .state("digi.viewGroupMessage", {
                    url: "/group/view",
                    templateUrl: 'app/components/digi/newsevent/groupmessage/view/view-group-message.html',
                    controller: 'digiViewGroupMessageCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/newsevent/groupmessage/view/ViewGroupAccess.js',
                                'app/components/factory/NewsEventModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Group Message'
                    },
                    ncyBreadcrumb: {
                        label: 'View Group Message'
                    }
                })

                .state("digi.viewDetailGroupMessage", {
                    url: "/group/view/detail",
                    templateUrl: 'app/components/digi/newsevent/groupmessage/viewDetail/view-detail-group-message.html',
                    controller: 'digiViewDetailGroupMessageCtrl',
                    params: {
                        groupMessageId: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/newsevent/groupmessage/viewDetail/ViewDetailGroupMessage.js',
                                'app/components/factory/NewsEventModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Detail Message Group'
                    },
                    ncyBreadcrumb: {
                        label: 'View Detail Message Group'
                    }
                })

                .state("digi.updateGroupMessage", {
                    url: "/group/update",
                    templateUrl: 'app/components/digi/newsevent/groupmessage/update/form-update-groupmessage.html',
                    controller: 'digiUpdateGroupMessageCtrl',
                    params: {
                        groupMessageId: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/newsevent/groupmessage/update/UpdateGroupMessage.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/NewsEventModuleFactory.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Update Message Group'
                    },
                    ncyBreadcrumb: {
                        label: 'Update Message Group'
                    }
                })
                .state("digi.approval", {
                    url: "/usermanagement/approval",
                    templateUrl: 'app/components/digi/usermanagement/approval/form-approval-user.html',
                    controller: 'digiApprovalUserCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/usermanagement/approval/ApprovalController.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Approval User'
                    },
                    ncyBreadcrumb: {
                        label: 'Approval User'
                    }
                })
                .state("digi.uploaduk", {
                    url: "/uk/uploaduk",
                    templateUrl: 'app/components/digi/uk/uploaduk/viewuploaduk.html',
                    controller: 'digiUploadUk',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/uk/uploaduk/uploadUk.js',
                                'app/components/factory/AccessModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/uploadUkFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Upload file Uk'
                    },
                    ncyBreadcrumb: {
                        label: 'Upload file Uk'
                    }
                })
                .state("digi.ViewUk2", {
                    url: "/uk/viewuk/view",
                    templateUrl: 'app/components/digi/uk/viewuk/view.html',
                    controller: 'ctrlviewUk',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/uk/viewuk/viewuk.js',
                                'app/components/factory/uploadUkFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Upload file Uk'
                    },
                    ncyBreadcrumb: {
                        label: 'Upload file Uk'
                    }
                })
                //CUSTOMER
                .state("digi.createcustomeruser", {
                    url: "/customer/user/create",
                    templateUrl: 'app/components/digi/customer/create/form-create-customer-user.html',
                    controller: 'digiCreateCustomerUserCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/customer/create/createCustomerUserController.js',
                                'app/components/factory/AccessModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/factory/IntegrationModuleFactory.js',
                                'lazy_KendoUI',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Create Customer User'
                    },
                    ncyBreadcrumb: {
                        label: 'Create Customer User'
                    }
                })
                .state("digi.searchcustomeruser", {
                    url: "/customer/user/search",
                    templateUrl: 'app/components/digi/customer/view/view-user.html',
                    controller: 'digiViewCustomerUserCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/customer/view/ViewUserController.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Search Customer User'
                    },
                    ncyBreadcrumb: {
                        label: 'Search Customer User'
                    }
                })
                .state("digi.updatecustomeruser", {
                    url: "/customer/user/update",
                    templateUrl: 'app/components/digi/customer/update/form-update-user.html',
                    controller: 'digiUpdateCustomerUserCtrl',
                    params: {
                        userId: '000',
                        organizationId: '000',
                        organizationName: '000'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/customer/update/updateUserController.js',
                                'app/components/factory/AccessModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/factory/IntegrationModuleFactory.js',
                                'lazy_KendoUI',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Update Customer User'
                    },
                    ncyBreadcrumb: {
                        label: 'Update Customer User'
                    }
                })
                .state("digi.viewdetailcustomeruser", {
                    url: "/customer/view/detail",
                    templateUrl: 'app/components/digi/customer/view-detail/view-detail-user.html',
                    controller: 'digiViewDetailCustomerUserCtrl',
                    params: {
                        userId: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/digi/customer/view-detail/ViewDetailUserController.js',
                                'app/components/factory/AccessModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/factory/IntegrationModuleFactory.js',
                                'lazy_KendoUI',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Detail Customer User'
                    },
                    ncyBreadcrumb: {
                        label: 'View Detail Customer User'
                    }
                })
                //AREA
                .state("digi.createarea", {
                    url: "/area/create/",
                    templateUrl: 'app/components/digi/area/create/areacreate.html',
                    controller: 'digicreatearea',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/area/create/areacreate.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/AreaFactory.js',
                                'app/components/service/NotificationService.js',
                                'lazy_KendoUI',
                                'autocom'
                                // 'lazy_KendoUI'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Create Area'
                    },
                    ncyBreadcrumb: {
                        label: 'Create Area'
                    }
                })
                .state("digi.listarea", {
                    url: "/area/list",
                    templateUrl: 'app/components/digi/area/list/listarea.html',
                    controller: 'ctrlListarea',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/AreaFactory.js',
                                'app/components/digi/area/list/listarea.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'List Area'
                    },
                    ncyBreadcrumb: {
                        label: 'List Area'
                    }
                })

                .state("digi.updatearea", {
                    url: "/area/detail/",
                    templateUrl: 'app/components/digi/area/update/updatearea.html',
                    controller: 'ctrlupdatearea',
                    params: {
                        id: '000'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_KendoUI',
                                'app/components/digi/area/update/updatearea.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/AreaFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Update Area'
                    },
                    ncyBreadcrumb: {
                        label: 'Update Area'
                    }
                })

                //konfigurasi
                .state("digi.insertGlobalType", {
                    url: "/create/tambahglobaltype",
                    templateUrl: 'app/components/digi/configuration/globaltype/create/tambahglobaltype.html',
                    controller: 'KonfigurasiModuleController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ckeditor',
                                'app/components/digi/configuration/globaltype/create/CreateGlobalType.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Insert Global Type'
                    },
                    ncyBreadcrumb: {
                        label: 'Konfigurasi'
                    }
                })

                .state("digi.viewGlobalType", {
                    url: "/view/tambahglobaltype",
                    templateUrl: 'app/components/digi/configuration/globaltype/view/viewglobaltype.html',
                    controller: 'ViewGlobalTypeCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/configuration/globaltype/view/ViewGlobalType.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'View Global Type'
                    },
                    ncyBreadcrumb: {
                        label: 'Konfigurasi'
                    }
                })

                .state("digi.updateGlobalType", {
                    url: "/update/tambahglobaltype",
                    templateUrl: 'app/components/digi/configuration/globaltype/update/updateglobaltype.html',
                    controller: 'UpdateGlobalTypeCtrl',
                    params: {
                        id: '000'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ckeditor',
                                'app/components/digi/configuration/globaltype/update/UpdateGlobalType.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Insert Global Type'
                    },
                    ncyBreadcrumb: {
                        label: 'Konfigurasi'
                    }
                })

                .state("digi.insertMobile", {
                    url: "/create/MobileUpdate",
                    templateUrl: 'app/components/digi/configuration/mobile/mobileupdate.html',
                    controller: 'MobileUpdateController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/configuration/mobile/MobileUpdate.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Insert Mobile Update'
                    },
                    ncyBreadcrumb: {
                        label: 'Konfigurasi'
                    }
                })

                .state("digi.viewMobileLatest", {
                    url: "/view/MobileUpdate",
                    templateUrl: 'app/components/digi/configuration/mobile/view/view-mobile.html',
                    controller: 'digiViewUpdateMobileLatest',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/configuration/mobile/view/ViewMobile.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'View Mobile Update Latest'
                    },
                    ncyBreadcrumb: {
                        label: 'Konfigurasi'
                    }
                })

                .state("digi.downloadAPK", {
                    url: "/download/DownloadAPK",
                    templateUrl: 'app/components/digi/configuration/mobile/download/DownloadAPK.html',
                    controller: 'digiDownloadAPK',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                /* 'bower_components/angular-resource/angular-resource.min.js',
                                 'lazy_datatables',*/
                                'app/components/digi/configuration/mobile/download/DownloadAPK.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    }
                    /* data: {
                         pageTitle: 'View Mobile Update Latest'
                     },
                     ncyBreadcrumb: {
                         label: 'Konfigurasi'
                     }*/
                })

                .state("digi.searchO3Request1", {
                    url: "/o3request/view/view-o3request",
                    templateUrl: 'app/components/digi/o3request/view/view-o3request.html',
                    controller: 'digiView03Request',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/o3request/view/View-O3Request.js',
                                'app/components/factory/O3RequestModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Search O3 Request'
                    },
                    ncyBreadcrumb: {
                        label: 'Search O3 Request'
                    }
                })

                .state("digi.viewdetailO3Request", {
                    url: "/o3request/view-detail",
                    templateUrl: 'app/components/digi/o3request/view-detail/view-detail-o3request.html',
                    controller: 'digiViewDetailO3Request',
                    params: {
                        id: '000',
                        avatar: '',
                        supervisor: ''

                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/digi/o3request/view-detail/View-Detail-O3Request.js',
                                'app/components/factory/O3RequestModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Detail O3 Request'
                    },
                    ncyBreadcrumb: {
                        label: 'View Detail O3 Request'
                    }
                })

                .state("digi.viewKehadiran", {
                    url: "/attendance/view/kehadiran",
                    templateUrl: 'app/components/digi/attendance/kehadiran/view/view-kehadiran.html',
                    controller: 'digiViewKehadiran',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/attendance/kehadiran/view/ViewKehadiran.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Service Report'
                    },
                    ncyBreadcrumb: {
                        label: 'View Service Report'
                    }
                })

                .state("digi.viewDetailKehadiran1", {
                    url: "/attendance/view/detailkehadiran",
                    templateUrl: 'app/components/digi/attendance/kehadiran/view-detail/view-detail-kehadiran.html',
                    controller: 'digiViewDetailKehadiran',
                    params: {
                        userid: '000',
                        date: ''
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/attendance/kehadiran/view-detail/ViewDetailKehadiran.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Attendance'
                    },
                    ncyBreadcrumb: {
                        label: 'View Attendance'
                    }
                })
                .state("digi.viewOvertime", {
                    url: "/search/overtime/view",
                    templateUrl: 'app/components/digi/search/overtime/view/view-overtime.html',
                    controller: "digiViewOvertimeCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/search/overtime/view/ViewOvertime.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'lazy_KendoUI',
                                'app/components/factory/IntegrationModuleFactory.js'
                            ])
                        }]
                    }
                })

                .state("digi.viewOvertimeDetail", {
                    url: "/search/overtime/detail",
                    templateUrl: 'app/components/digi/search/overtime/view-detail/view-detail-overtime.html',
                    controller: 'digiViewOvertimeDetail',
                    params: {
                        idovertime: '000'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/search/overtime/view-detail/ViewDetailOvertime.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Overtime Detail'
                    },
                    ncyBreadcrumb: {
                        label: 'Overtime Detail'
                    }
                })

                .state("digi.viewAttendanceCorrection", {
                    url: "/attendance/view/attendance/correction",
                    templateUrl: 'app/components/digi/search/attendance_correction/view/view-attendance-correction.html',
                    controller: 'digiViewAttendanceCorrection',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/search/attendance_correction/view/ViewAttendanceCorrection.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Service Correction'
                    },
                    ncyBreadcrumb: {
                        label: 'View Service Correction'
                    }
                })

                .state("digi.viewDetailAttendanceCorrection", {
                    url: "/attendance/view/detailattendancecorrection",
                    templateUrl: 'app/components/digi/search/attendance_correction/view-detail/view-detail-attendance-correction.html',
                    controller: 'digiViewDetailAttendanceCorrection',
                    params: {
                        id: '000',
                        date: ''
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/search/attendance_correction/view-detail/ViewDetailAttendanceCorrection.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Service Correction'
                    },
                    ncyBreadcrumb: {
                        label: 'View Service Correction'
                    }
                })

                .state("digi.viewPatroli", {
                    url: "/patroli/view/patroli",
                    templateUrl: 'app/components/digi/patroli/search/search-patroli.html',
                    controller: 'digiSearchPatroliCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/patroli/search/SearchPatroliController.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/PatroliModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Patroli'
                    },
                    ncyBreadcrumb: {
                        label: 'View Patroli'
                    }
                })

                .state("digi.viewDetailPatroliKhusus", {
                    url: "/patroli/khusus/view/detail",
                    templateUrl: 'app/components/digi/patroli/search-detail-patroli/search-detail-patroli.html',
                    controller: 'digiSearchDetailPatroliCtrl',
                    params: {
                        patroliId: '000'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/patroli/search-detail-patroli/SearchDetailPatroliController.js',
                                'app/components/factory/PatroliModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Detail Patroli Khusus'
                    },
                    ncyBreadcrumb: {
                        label: 'View Detail Patroli Khusus'
                    }
                })

                .state("digi.viewPatroliKunjungan", {
                    url: "/patroli/kunjungan/view",
                    templateUrl: 'app/components/digi/search/patroli-kunjungan/view-patroli-kunjungan/view-patroli-kunjungan.html',
                    controller: 'digiSearchPatroliKunjunganCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/digi/search/patroli-kunjungan/view-patroli-kunjungan/ViewPatroliKunjungan.js',
                                'app/components/factory/PatroliModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Patroli'
                    },
                    ncyBreadcrumb: {
                        label: 'View Patroli'
                    }
                })

                .state("digi.viewDetailPatroliKunjungan", {
                    url: "/patroli/kunjungan/view/detail",
                    templateUrl: 'app/components/digi/search/patroli-kunjungan/view-detail-patroli-kunjungan/view-detail-patroli-kunjungan.html',
                    controller: 'digiSearchDetailPatroliKunjunganCtrl',
                    params: {
                        patroliId: '000'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/search/patroli-kunjungan/view-detail-patroli-kunjungan/ViewDetailPatroliKunjungan.js',
                                'app/components/factory/PatroliModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Detail Patroli Kunjungan'
                    },
                    ncyBreadcrumb: {
                        label: 'View Detail Patroli Kunjungan'
                    }
                })

                .state("digi.viewPatroliLaporan", {
                    url: "/patroli/view/laporanpatroli",
                    templateUrl: 'app/components/digi/search/patroli-laporan/view-patroli-laporan/view-patroli-laporan.html',
                    controller: 'digiSearchPatroliLaporanCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/search/patroli-laporan/view-patroli-laporan/ViewPatroliLaporan.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/PatroliModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Patroli'
                    },
                    ncyBreadcrumb: {
                        label: 'View Patroli'
                    }
                })

                .state("digi.viewDetailPatroliLaporan", {
                    url: "/patroli/laporan/view/detail",
                    templateUrl: 'app/components/digi/search/patroli-laporan/view-detail-patroli-laporan/view-detail-patroli-laporan.html',
                    controller: 'digiSearchDetailPatroliLaporanCtrl',
                    params: {
                        patroliId: '000'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/search/patroli-laporan/view-detail-patroli-laporan/ViewDetailPatroliLaporan.js',
                                'app/components/factory/PatroliModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Detail Patroli Khusus'
                    },
                    ncyBreadcrumb: {
                        label: 'View Detail Patroli Khusus'
                    }
                })

                .state("digi.accessmobilegroupview", {
                    url: "/AccessGroup/mobile/view",
                    templateUrl: 'app/components/digi/accessgroupmobile/view/viewmobileaccess.html',
                    controller: 'digiViewMobileAccessGroupCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/accessgroupmobile/view/viewmobileaccess.js',
                                'app/components/factory/accessgroupmanagementFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Search Mobile Group Access'
                    },
                    ncyBreadcrumb: {
                        label: 'Search Mobile Group Access'
                    }
                })
                .state("digi.insertmobilegroupaccess", {
                    url: "/Access Group/mobile/create",
                    templateUrl: 'app/components/digi/accessgroupmobile/insert/insertmobileaccess.html',
                    controller: 'digiCreateMobileAccessGroupCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'lazy_wizard',
                                'tree_menu_tes',
                                'app/components/digi/accessgroupmobile/insert/insertmobileaccess.js',
                                'app/components/factory/AccessModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/factory/accessgroupmanagementFactory.js',
                                'app/components/service/NotificationService.js',

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Create Access Group'
                    },
                    ncyBreadcrumb: {
                        label: 'Create Access Group'
                    }
                })

                //userdashboard
                .state("digi.userdashboard", {
                    url: "/user/dashboard",
                    templateUrl: 'app/components/digi/dashboard/user/UserDashboard.html',
                    controller: 'digiUserDashboard',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_tablesorter',
                                'lazy_charts_c3',
                                'lazy_datatables',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/digi/dashboard/user/UserDashboard.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/factory/DashboardReportModuleFactory.js',
                                'app/components/factory/IntegrationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'newNeta Dashboard 1'
                    },
                    ncyBreadcrumb: {
                        label: 'Dashboard System & Process'
                    }
                })

                .state("digi.redminedashboard", {
                    url: "/user/redmine/dashboard",
                    templateUrl: 'app/components/digi/dashboard/redmine/redmine.html',
                    controller: 'digiRedmineDashboard',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_tablesorter',
                                'lazy_charts_c3',
                                'lazy_datatables',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/digi/dashboard/redmine/redmine.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/factory/RedmineModuleFactory.js',
                                'app/components/factory/DashboardReportModuleFactory.js',
                                'app/components/factory/IntegrationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'newNeta Dashboard 1'
                    },
                    ncyBreadcrumb: {
                        label: 'Dashboard System & Process'
                    }
                })

                .state("digi.productivityreport", {
                    url: "/report/productivity",
                    templateUrl: 'app/components/digi/dashboard/productivity/productivity-report.html',
                    controller: 'digiProductivityReport',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([

                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/dashboard/productivity/ProductivityReportController.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/factory/IntegrationModuleFactory.js',
                                'app/components/factory/DashboardReportModuleFactory.js',
                                'lazy_KendoUI',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Productivity Report'
                    },
                    ncyBreadcrumb: {
                        label: 'Productivity Report'
                    }
                })

                .state("digi.createassignments", {
                    url: "/create/assignment/one",
                    templateUrl: 'app/components/digi/assignment/create/create-assignment/CreateAssignment.html',
                    controller: 'digiCreateDetailAssignmentCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/digi/assignment/create/create-assignment/CreateAssignment.js',
                                'app/components/factory/AssignmentModuleFactory.js',
                                'app/components/factory/IntegrationModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'lazy_KendoUI',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Create Assignment'
                    },
                    ncyBreadcrumb: {
                        label: 'Create Assignment'
                    }
                })

                .state("digi.createassignmentDetail", {
                    url: "/create/assignment/one/detail",
                    templateUrl: 'app/components/digi/assignment/create/create-assignment-detail/CreateAssignmentDetail.html',
                    controller: 'digiCreateDetailAssignmentDetailCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([

                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/digi/assignment/create/create-assignment-detail/CreateAssignmentDetail.js',
                                'app/components/factory/AssignmentModuleFactory.js',
                                'app/components/factory/IntegrationModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'lazy_KendoUI',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Create Assignment'
                    },
                    ncyBreadcrumb: {
                        label: 'Create Assignment'
                    }
                })

                .state("digi.viewassignments", {
                    url: "/assignment/view",
                    templateUrl: 'app/components/digi/assignment/view/ViewAssignment.html',
                    controller: 'digiViewAssignmentsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/assignment/view/ViewAssignment.js',
                                'app/components/factory/AssignmentModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Search Assignment'
                    },
                    ncyBreadcrumb: {
                        label: 'Search Assignment'
                    }
                })

                .state("digi.viewDetailAssignments", {
                    url: "/assignment/view/detail",
                    templateUrl: 'app/components/digi/assignment/viewDetails/ViewDetailAssignment.html',
                    controller: 'digiViewDetailAssignmentsCtrl',
                    params: {
                        id: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/assignment/viewDetails/ViewDetailAssignment.js',
                                'app/components/factory/AssignmentModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Detail Assignment'
                    },
                    ncyBreadcrumb: {
                        label: 'View Detail Assignment'
                    }
                })

                .state("digi.updateAssignment", {
                    url: "/assignment/update",
                    templateUrl: 'app/components/digi/assignment/update/UpdateAssignment.html',
                    controller: 'digiUpdateAssignmentsCtrl',
                    params: {
                        id: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/digi/assignment/update/UpdateAssignment.js',
                                'app/components/factory/AssignmentModuleFactory.js',
                                'app/components/factory/IntegrationModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'lazy_KendoUI',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Re-Assignment'
                    },
                    ncyBreadcrumb: {
                        label: 'Re-Assignment'
                    }
                })

                .state("digi.listDetailMapping", {
                    url: "/QrCode/detailMappingList",
                    templateUrl: 'app/components/digi/QrCode/detailMapping/DetailMapping.html',
                    controller: 'digiListMappingDetail',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/QrCode/detailMapping/DetailMapping.js',
                                'app/components/factory/Qrfactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Mapping Qr Code'
                    },
                    ncyBreadcrumb: {
                        label: 'Mapping Qr Code'
                    }
                })

                .state("digi.bpiEmailConfig", {
                    url: "/bpi/emailconfig",
                    templateUrl: 'app/components/bpi/configuration/email/EmailConfig.html',
                    controller: 'EmailConfiguration',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/configuration/email/EmailConfig.js',

                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Email Config'
                    },
                    ncyBreadcrumb: {
                        label: 'Email Config'
                    }
                })

                .state("digi.bpiViewServeGroup", {
                    url: "/bpi/view/serveGroup",
                    templateUrl: 'app/components/bpi/configuration/servegroup/view/ViewServeGroup.html',
                    controller: 'ViewServeGroupCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/configuration/servegroup/view/ViewServeGroup.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Serve Group Configuration'
                    },
                    ncyBreadcrumb: {
                        label: 'Serve Group Configuration'
                    }
                })

                .state("digi.bpiUpdateServeGroup", {
                    url: "/bpi/update/serveGroup",
                    templateUrl: 'app/components/bpi/configuration/servegroup/update/UpdateServeGroup.html',
                    controller: 'UpdateServeGroupCtrl',
                    params: {
                        id: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/bpi/configuration/servegroup/update/UpdateServeGroup.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Serve Group Configuration'
                    },
                    ncyBreadcrumb: {
                        label: 'Serve Group Configuration'
                    }
                })

                .state("digi.BPIViewActivityCategory", {
                    url: "/bpi/view/ActivityCategory",
                    templateUrl: 'app/components/bpi/configuration/activitycategory/view/ViewActivityCategory.html',
                    controller: 'ViewActivityCategoryCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/configuration/activitycategory/view/ViewActivityCategory.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Activity Category Configuration'
                    },
                    ncyBreadcrumb: {
                        label: 'Activity Category Configuration'
                    }
                })

                .state("digi.bpiUpdateActivityCategory", {
                    url: "/bpi/update/ActivityCategory",
                    templateUrl: 'app/components/bpi/configuration/activitycategory/update/UpdateActivityCategory.html',
                    controller: 'UpdateActivityCategoryCtrl',
                    params: {
                        id: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/bpi/configuration/activitycategory/update/UpdateActivityCategory.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Activity Category Configuration'
                    },
                    ncyBreadcrumb: {
                        label: 'Activity Category Configuration'
                    }
                })

                .state("digi.bpiResultCategory", {
                    url: "/bpi/resultcategory",
                    templateUrl: 'app/components/bpi/configuration/resultcategory/view/ViewResultCategory.html',
                    controller: 'ResultCategoryConfiguration',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/configuration/resultcategory/view/ViewResultCategory.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Result Category'
                    },
                    ncyBreadcrumb: {
                        label: 'Resul Category'
                    }
                })

                .state("digi.bpiWorkSchedule", {
                    url: "/bpi/create/WorkSchedule",
                    templateUrl: 'app/components/bpi/jadwal/create/InsertJadwal.html',
                    controller: 'BPIWorkSchedule',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/bpi/jadwal/create/InsertJadwal.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Work Schedule'
                    },
                    ncyBreadcrumb: {
                        label: 'Work Schedule'
                    }
                })
                .state("digi.bpiViewWorkSchedule", {
                    url: "/bpi/view/WorkSchedule",
                    templateUrl: 'app/components/bpi/jadwal/view/ViewJadwal.html',
                    controller: 'BPIViewJadwalCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/jadwal/view/ViewJadwal.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Work Schedule'
                    },
                    ncyBreadcrumb: {
                        label: 'Work Schedule'
                    }
                })

                .state("digi.bpiUpdateWorkSchedule", {
                    url: "/bpi/update/WorkSchedule",
                    templateUrl: 'app/components/bpi/jadwal/update/UpdateJadwal.html',
                    controller: 'BPIUpdateWorkSchedule',
                    params: {
                        id: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/bpi/jadwal/update/UpdateJadwal.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Work Schedule'
                    },
                    ncyBreadcrumb: {
                        label: 'Work Schedule'
                    }
                })

                .state("digi.bpiViewDetailWorkSchedule", {
                    url: "/bpi/view/detail/WorkSchedule",
                    templateUrl: 'app/components/bpi/jadwal/view_detail/ViewDetailJadwal.html',
                    controller: 'BPIViewDetailWorkSchedule',
                    params: {
                        id: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/jadwal/view_detail/ViewDetailJadwal.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/service/NotificationService.js',

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Work Schedule'
                    },
                    ncyBreadcrumb: {
                        label: 'Work Schedule'
                    }
                })
                .state("digi.resourceallocationinsertplan", {
                    url: "/resource/allocation/insert/plan",
                    templateUrl: 'app/components/bpi/resourceallocation/insert/insert-resource-plan.html',
                    controller: 'InsertResourcePlanController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/bpi/resourceallocation/insert/InsertResourcePlanController.js',
                                'app/components/service/NotificationService.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Insert Resource Plan'
                    },
                    ncyBreadcrumb: {
                        label: 'Insert Resource Plan'
                    }
                })


                .state("digi.resourceallocationassignresource", {
                    url: "/resource/allocation",
                    templateUrl: 'app/components/bpi/resourceallocation/insert/insert-resource-plan.html',
                    controller: 'InsertResourcePlanController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/resourceallocation/insert/InsertResourcePlanController.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Insert Resource Plan'
                    },
                    ncyBreadcrumb: {
                        label: 'Insert Resource Plan'
                    }
                })

                .state("digi.resourceallocationaview", {
                    url: "/resource/allocation/view",
                    templateUrl: 'app/components/bpi/resourceallocation/insert/insert-resource-plan.html',
                    controller: 'InsertResourcePlanController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/resourceallocation/insert/InsertResourcePlanController.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Insert Resource Plan'
                    },
                    ncyBreadcrumb: {
                        label: 'Insert Resource Plan'
                    }
                })

                .state("digi.resourceallocationviewresourcepool", {
                    url: "/resource/allocation/view/resource/pool",
                    templateUrl: 'app/components/bpi/resourceallocation/insert/insert-resource-plan.html',
                    controller: 'InsertResourcePlanController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/resourceallocation/insert/InsertResourcePlanController.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Insert Resource Plan'
                    },
                    ncyBreadcrumb: {
                        label: 'Insert Resource Plan'
                    }
                })

                .state("digi.projectmasterdata", {
                    url: "/master/data/project",
                    templateUrl: 'app/components/bpi/projectmasterdata/searh-project-master-data.html',
                    controller: 'SearchProjectMasterDataController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/bpi/projectmasterdata/SearchProjectMasterDataController.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Search Project Master Data'
                    },
                    ncyBreadcrumb: {
                        label: 'Search Project Master Data'
                    }
                })

                .state("digi.projectmasterdatadetail", {
                    url: "/master/data/project/detail",
                    templateUrl: 'app/components/bpi/projectmasterdata/view-project-master-data-detail.html',
                    controller: 'ViewProjectMasterDataDetailController',
                    params: {
                        projectNumber: '000'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/bpi/projectmasterdata/ViewProjectMasterDataDetailController.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },

                    data: {
                        pageTitle: 'Project Master Data Detail'
                    },
                    ncyBreadcrumb: {
                        label: 'Project Master Data Detail'
                    }
                })


                .state("digi.bpiWorkLocation", {
                    url: "/bpi/create/WorkLocation",
                    templateUrl: 'app/components/bpi/worklocation/create/InsertWorklocation.html',
                    controller: 'BPIWorkLocation',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([

                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/bpi/worklocation/create/InsertWorklocation.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'treeview2'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Work Location'
                    },
                    ncyBreadcrumb: {
                        label: 'Work Location'
                    }
                })

                .state("digi.bpiUserScheduleWorkLocation", {
                    url: "/bpi/user/create/WorkLocation/schedule",
                    templateUrl: 'app/components/bpi/worklocation/schedule_user/InsertScheduleUser.html',
                    controller: 'BPIWorkScheduleUser',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/worklocation/schedule_user/InsertScheduleUser.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Work Location'
                    },
                    ncyBreadcrumb: {
                        label: 'Work Location'
                    }
                })

                .state("digi.bpiUserNonProjectScheduleWorkLocation", {
                    url: "/bpi/user/create/non/project/WorkLocation/schedule",
                    templateUrl: 'app/components/bpi/worklocation/schedule_user/nonproject/InsertScheduleUser.html',
                    controller: 'BPINonProjectWorkScheduleUser',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/worklocation/schedule_user/nonproject/InsertScheduleUser.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Work Location'
                    },
                    ncyBreadcrumb: {
                        label: 'Work Location'
                    }
                })

                .state("digi.worklocationvalidation", {
                    url: "/bpi/worklocation/validation",
                    templateUrl: 'app/components/bpi/worklocation/validation/WorklocationValidation.html',
                    controller: 'WorkLocationValidationController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/bpi/worklocation/validation/WorklocationValidation.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/factory/AssignmentModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'treeview2',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Work Location Validation'
                    },
                    ncyBreadcrumb: {
                        label: 'Work Location Validation'
                    }
                })

                .state("digi.bpiUpdateScheduleUser", {
                    url: "/bpi/user/update/WorkLocation/schedule",
                    templateUrl: 'app/components/bpi/worklocation/update_schedule_user/UpdateScheduleUser.html',
                    controller: 'BPIUpdateWorkScheduleUser',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/worklocation/update_schedule_user/UpdateScheduleUser.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'font_bostrap',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Work Location'
                    },
                    ncyBreadcrumb: {
                        label: 'Work Location'
                    }
                })

                .state("digi.bpiUpdateProjectScheduleUser", {
                    url: "/bpi/user/update/Project/WorkLocation/schedule",
                    templateUrl: 'app/components/bpi/worklocation/update_schedule_user/project/UpdateScheduleUserProject.html',
                    controller: 'BPIUpdateWorkScheduleUserProject',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/worklocation/update_schedule_user/project/UpdateScheduleUserProject.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'font_bostrap',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Work Location'
                    },
                    ncyBreadcrumb: {
                        label: 'Work Location'
                    }
                })

                .state("digi.newattendance", {
                    url: "/attendancecorrection/new",
                    templateUrl: 'app/components/digi/attendance/new_correction/new-attendance-correction.html',
                    controller: 'digiNewAttendaceCorrectionCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/attendance/new_correction/NewAttendanceCorrectionController.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/factory/AssignmentModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'lazy_fullcalendar',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Service Correction'
                    },
                    ncyBreadcrumb: {
                        label: 'Service Correction'
                    }
                })

                .state("digi.serveactivity", {
                    url: "/attendance/serveactivity",
                    templateUrl: 'app/components/digi/serve/serve_view.html',
                    controller: 'digiServeActivityCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/serve/serveController.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/factory/AssignmentModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Serve Activity'
                    },
                    ncyBreadcrumb: {
                        label: 'Serve Activity'
                    }
                })

                .state("digi.approveattendance", {
                    url: "/approval/attendance/app",
                    templateUrl: 'app/components/digi/attendance/approval/approval-attendance.html',
                    controller: 'digiApprovalAttendanceCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/attendance/approval/ApprovalAttendance.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Service Approval'
                    },
                    ncyBreadcrumb: {
                        label: 'Service Approval'
                    }
                })

                .state("digi.approveattendancebypm", {
                    url: "/approval/attendance/pm",
                    templateUrl: 'app/components/digi/attendance/approval/approvalPM/approval-attendance-by-PM.html',
                    controller: 'digiApprovalAttendancePMCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/attendance/approval/approvalPM/ApprovalAttendanceForPM.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Service Approval By PM'
                    },
                    ncyBreadcrumb: {
                        label: 'Service Approval By PM'
                    }
                })

                .state("digi.approveattendancebyrm", {
                    url: "/approval/attendance/rm",
                    templateUrl: 'app/components/digi/attendance/approval/ApprovalRM/approval-attendance-by-RM.html',
                    controller: 'digiApprovalAttendanceRMCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/attendance/approval/ApprovalRM/ApprovalAttendanceForRM.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Service Approval By RM'
                    },
                    ncyBreadcrumb: {
                        label: 'Service Approval By RM'
                    }
                })

                .state("digi.bpiCreateLeaveRequest", {
                    url: "/bpi/insert/leave/request",
                    templateUrl: 'app/components/bpi/cuti/insert/InsertCuti.html',
                    controller: 'BPIInsertCuti',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/bpi/cuti/insert/InsertCuti.js',
                                'app/components/factory/BPILeaveRequestFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'CREATE LEAVE REQUEST'
                    },
                    ncyBreadcrumb: {
                        label: 'CREATE LEAVE REQUEST'
                    }
                })

                .state("digi.bpiLeaveRequestApproval1", {
                    url: "/bpi/leave/request/approve",
                    templateUrl: 'app/components/bpi/cuti/approve/ApproveCuti.html',
                    controller: 'BPIApproveCuti',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/cuti/approve/ApproveCuti.js',
                                'app/components/factory/BPILeaveRequestFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'APPROVAL LEAVE REQUEST'
                    },
                    ncyBreadcrumb: {
                        label: 'APPROVAL LEAVE REQUEST'
                    }
                })

                .state("digi.BPIViewLeaveBalances", {
                    url: "/bpi/view/leave/balance",
                    templateUrl: 'app/components/bpi/cuti/view_leave_balance/ViewLeaveBalance.html',
                    controller: 'BPIViewLeaveBalance',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/bpi/cuti/view_leave_balance/ViewLeaveBalance.js',
                                'app/components/factory/BPILeaveRequestFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'VIEW LEAVE BALANCE'
                    },
                    ncyBreadcrumb: {
                        label: 'VIEW LEAVE BALANCE'
                    }
                })

                .state("digi.bpiCancelLeaveRequest", {
                    url: "/bpi/leave/request/cancel",
                    templateUrl: 'app/components/bpi/cuti/cancel/CancelCuti.html',
                    controller: 'BPICancelCuti',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/cuti/cancel/CancelCuti.js',
                                'app/components/factory/BPILeaveRequestFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'CANCEL LEAVE REQUEST'
                    },
                    ncyBreadcrumb: {
                        label: 'CANCEL LEAVE REQUEST'
                    }
                })

                .state("digi.bpiViewLeaveRequest", {
                    url: "/bpi/leave/request/view",
                    templateUrl: 'app/components/bpi/cuti/view/ViewCuti.html',
                    controller: 'BPIViewCuti',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/cuti/view/ViewCuti.js',
                                'app/components/factory/BPILeaveRequestFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'VIEW LEAVE REQUEST'
                    },
                    ncyBreadcrumb: {
                        label: 'VIEW LEAVE REQUEST'
                    }
                })

                .state("digi.worklocationSearch", {
                    url: "/worklocation/search",
                    templateUrl: 'app/components/bpi/worklocation/view/search-worklocation.html',
                    controller: 'SearchWorklocationDataController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/bpi/worklocation/view/SearchWorklocation.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'WORK LOCATION SEARCH'
                    },
                    ncyBreadcrumb: {
                        label: 'Work Location Search'
                    }
                })

                .state("digi.viewnonprojectworklocationdetail", {
                    url: "/worklocation/non/project/view/detail",
                    templateUrl: 'app/components/bpi/worklocation/view/view-detail-work-location.html',
                    controller: 'ViewDetailNonProjectWorklocationController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/bpi/worklocation/view/ViewDetailWorklocation.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'VIEW NON PROJECT WORK LOCATION DETAIL'
                    },
                    ncyBreadcrumb: {
                        label: 'View Non Project Work Location Detail'
                    }
                })

                .state("digi.updatenonprojectworklocationdetail", {
                    url: "/worklocation/non/project/update",
                    templateUrl: 'app/components/bpi/worklocation/update/update-worklocation.html',
                    controller: 'UpdateNonProjectWorklocationController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/bpi/worklocation/update/UpdateWorklocation.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'UPDATE NON PROJECT WORK LOCATION DETAIL'
                    },
                    ncyBreadcrumb: {
                        label: 'Update Non Project Work Location Detail'
                    }
                })


                .state("digi.projectworklocation", {
                    url: "/worklocation/project",
                    templateUrl: 'app/components/bpi/worklocation/view/project/search-worklocation-project.html',
                    controller: 'SearchProjectWorklocationDataController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/bpi/worklocation/view/project/SearchWorklocationProject.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Search Project Master Data'
                    },
                    ncyBreadcrumb: {
                        label: 'Search Project Master Data'
                    }
                })

                .state("digi.projectworklocationsearch", {
                    url: "/worklocation/project/search",
                    templateUrl: 'app/components/bpi/worklocation/view/project/search-worklocation-per-project.html',
                    controller: 'ViewWorklocationDataPerProjectController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/bpi/worklocation/view/project/SearchWorklocationPerProject.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'View Project Work Location'
                    },
                    ncyBreadcrumb: {
                        label: 'View Project Work Location'
                    }
                })

                .state("digi.viewprojectworklocationdetail", {
                    url: "/worklocation/project/view/detail",
                    templateUrl: 'app/components/bpi/worklocation/view/project/view-detail-project-work-location.html',
                    controller: 'ViewDetailProjectWorklocationController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/bpi/worklocation/view/project/ViewDetailProjectWorklocation.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'VIEW PROJECT WORK LOCATION DETAIL'
                    },
                    ncyBreadcrumb: {
                        label: 'View Project Work Location Detail'
                    }
                })

                .state("digi.updateprojectworklocation", {
                    url: "/worklocation/project/update",
                    templateUrl: 'app/components/bpi/worklocation/update/update-project-worklocation.html',
                    controller: 'UpdateProjectWorklocationController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/bpi/worklocation/update/UpdateProjectWorklocation.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'UPDATE PROJECT WORK LOCATION'
                    },
                    ncyBreadcrumb: {
                        label: 'Update Project Work Location '
                    }
                })

                .state("digi.projectworklocationcreate", {
                    url: "/workLocation/project/create",
                    templateUrl: 'app/components/bpi/worklocation/create/InsertProjectWorklocation.html',
                    controller: 'CreateProjectWorkLocationController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([

                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/bpi/worklocation/create/InsertProjectWorklocation.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'treeview2'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Create Project Work Location'
                    },
                    ncyBreadcrumb: {
                        label: 'Create Project Work Location'
                    }
                })

                // .state("digi.ResourceAssignment", {
                //     url: "/Resourceassignment/upload",
                //     templateUrl: 'app/components/digi/Resourceassignment/upload',
                //     controller: 'CreateProjectWorkLocationController',
                //     resolve: {
                //         deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'bower_components/angular-resource/angular-resource.min.js',
                //                 'app/components/bpi/worklocation/create/InsertProjectWorkLocation.js',
                //                 'app/components/factory/BPIWorkLocationModuleFactory.js',
                //                 'app/components/factory/BPIWorkScheduleModuleFactory.js',
                //                 'app/components/factory/BPIConfigurationModuleFactory.js',
                //                 'app/components/service/NotificationService.js',
                //                 'treeview2'
                //             ], {serie: true});
                //         }]
                //     },
                //     data: {
                //         pageTitle: 'Create Project Work Location'
                //     },
                //     ncyBreadcrumb: {
                //         label: 'Create Project Work Location'
                //     }
                // })


                .state("digi.employeemasterdata", {
                    url: "/master/data/employee",
                    templateUrl: 'app/components/bpi/employee/employee-master-data.html',
                    controller: 'EmployeeMasterDataController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_datatables',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/bpi/employee/EmployeeMasterDataController.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'treeview2'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Employee Master Data'
                    },
                    ncyBreadcrumb: {
                        label: 'Employee Master Data'
                    }
                })

                .state("digi.uploademployeemasterdata", {
                    url: "/master/data/employee/upload",
                    templateUrl: 'app/components/bpi/employee/upload/upload-employee-master-data.html',
                    controller: 'UploadEmployeeMasterDataController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_datatables',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/bpi/employee/upload/UploadEmployeeMasterDataController.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'treeview2'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Upload Employee Master Data'
                    },
                    ncyBreadcrumb: {
                        label: 'Upload Employee Master Data'
                    }
                })

                .state("digi.downloademployeemasterdata", {
                    url: "/master/data/employee/download",
                    templateUrl: 'app/components/bpi/employee/employee-master-data.html',
                    controller: 'EmployeeMasterDataController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_datatables',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/bpi/employee/EmployeeMasterDataController.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'treeview2'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Download Employee Master Data'
                    },
                    ncyBreadcrumb: {
                        label: 'Download Employee Master Data'
                    }
                })

                .state("digi.reportuserforweb", {
                    url: "/reportuser/",
                    templateUrl: 'app/components/bpi/reportuser/reportuser.html',
                    controller: 'digireportuser',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_datatables',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/bpi/reportuser/reportuser.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'treeview2'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Download Report '
                    },
                    ncyBreadcrumb: {
                        label: 'Download Report'
                    }
                })


                .state("digi.UploadResourceAssignment", {
                    url: "/UploadResourceAssignment/upload",
                    templateUrl: 'app/components/digi/Resourceassignment/upload/UploadResourceAssignment.html',
                    controller: 'digiUploadResourceassignment',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/Resourceassignment/upload/UploadResourceAssignment.js',
                                'lazy_datatables',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Resourceassignment'
                    },
                    ncyBreadcrumb: {
                        label: 'Resourceassignment'
                    }
                })
                .state("digi.createProjectTransit", {
                    url: "/Resourceassignment/projectTransit",
                    templateUrl: 'app/components/digi/transitproject/transit-project.html',
                    controller: 'digitransitprojectController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/transitproject/transit-projectController.js',
                                'lazy_datatables',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/factory/BPIWorkLocationModuleFactory.js',
                                'app/components/factory/BPIWorkScheduleModuleFactory.js',
                                'app/components/factory/BPIConfigurationModuleFactory.js',
                                'lazy_KendoUI',

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Project Transit '
                    },
                    ncyBreadcrumb: {
                        label: 'Project Transit'
                    }
                })
                .state("digi.viewOpportunity", {
                    url: "/master/data/view/opportunity",
                    templateUrl: 'app/components/bpi/opportunity/ViewOpportunity.html',
                    controller: 'BPIViewOpportunity',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/opportunity/ViewOpportunity.js',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Search Opportunity'
                    },
                    ncyBreadcrumb: {
                        label: 'Search Opportunity'
                    }
                })

                .state("digi.viewDetailOpportunity", {
                    url: "/master/data/view/detail/opportunity",
                    templateUrl: 'app/components/bpi/opportunity/ViewDetail/ViewDetailOpportunity.html',
                    controller: 'BPIViewDetailOpportunity',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/bpi/opportunity/ViewDetail/ViewDetailOpportunity.js',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Search Opportunity'
                    },
                    ncyBreadcrumb: {
                        label: 'Search Opportunity'
                    }
                })

                .state("digi.reporttimesheet", {
                    url: "/report/timesheet",
                    templateUrl: 'app/components/digi/report/project-timesheet/report-timesheet-project.html',
                    controller: 'digiReportTimeSheetCtrl',
                    params: {
                        userid: '000',
                        date: ''
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/report/project-timesheet/report-timesheet-projectController.js',
                                'app/components/factory/ReportModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Report TimeSheet Project'
                    },
                    ncyBreadcrumb: {
                        label: 'Report TimeSheet Project'
                    }
                })

                .state("digi.reporttimesheetinternal", {
                    url: "/report/timesheet/internal",
                    templateUrl: 'app/components/digi/report/internal-timesheet/report-timesheet-internal.html',
                    controller: 'digiReportTimeSheetInternalCtrl',
                    params: {
                        userid: '000',
                        date: ''
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/report/internal-timesheet/report-timesheet-internalController.js',
                                'app/components/factory/ReportModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Report TimeSheet Internal'
                    },
                    ncyBreadcrumb: {
                        label: 'Report TimeSheet Internal'
                    }
                })

                .state("digi.reporttimesheetsales", {
                    url: "/report/timesheet/sales",
                    templateUrl: 'app/components/digi/report/sales-timesheet/report-timesheet-sales.html',
                    controller: 'digiReportTimeSheetSalesCtrl',
                    params: {
                        userid: '000',
                        date: ''
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/report/sales-timesheet/report-timesheet-salesController.js',
                                'app/components/factory/ReportModuleFactory.js',
                                'app/components/service/NotificationService.js'

                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Report TimeSheet Sales And BD'
                    },
                    ncyBreadcrumb: {
                        label: 'Report TimeSheet Sales And BD'
                    }
                })
                .state("digi.updateGroupAccess", {
                    url: "/groupaccess/update",
                    templateUrl: 'app/components/digi/accessgroupmanagement/update/updateAccessGroup.html',
                    controller: 'digiUpdateAccessGroupCtrl',
                    params: {
                        Id: '000',
                        name: '',
                        remark: ''
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'treeview2',
                                'app/components/digi/accessgroupmanagement/update/updateAccessGroup.js',
                                'app/components/factory/AccessModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/factory/accessgroupmanagementFactory.js',
                                'app/components/service/NotificationService.js',
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Update Group Access'
                    },
                    ncyBreadcrumb: {
                        label: 'Update Group Access'
                    }
                })
                .state("digi.proffesionalismbyemployee", {
                    url: "/report/professionalism/by/employee",
                    templateUrl: 'app/components/digi/report/professionalism/professionalism-report-by-employee.html',
                    controller: 'professionalismReportByEmployeeController',
                    params: {
                        userid: '000',
                        date: ''
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/report/professionalism/professionalism-report-by-employee.js',
                                'app/components/factory/ReportModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'lazy_charts_chartist',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_c3'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Report Professionalism By Employee'
                    },
                    ncyBreadcrumb: {
                        label: 'Report Professionalism By Employee'
                    }
                })
                .state("digi.proffesionalismbydepartment", {
                    url: "/report/professionalism/by/department",
                    templateUrl: 'app/components/digi/report/professionalism/professionalism-report-by-department.html',
                    controller: 'professionalismReportByDepartmentController',
                    params: {
                        userid: '000',
                        date: ''
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/report/professionalism/professionalism-report-by-department.js',
                                'app/components/factory/ReportModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'lazy_charts_chartist',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_c3'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Report Professionalism By Department'
                    },
                    ncyBreadcrumb: {
                        label: 'Report Professionalism By Department'
                    }
                })
                .state("digi.proffesionalismbyproject", {
                    url: "/report/professionalism/by/project",
                    templateUrl: 'app/components/digi/report/professionalism/professionalism-report-by-project.html',
                    controller: 'professionalismReportByProjectController',
                    params: {
                        userid: '000',
                        date: ''
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/report/professionalism/professionalism-report-by-project.js',
                                'app/components/factory/ReportModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'lazy_charts_chartist',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_c3',
                                'app/components/factory/ProjectMasterDataModuleFactory.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Report Professionalism By Project'
                    },
                    ncyBreadcrumb: {
                        label: 'Report Professionalism By Project'
                    }
                })
                .state("digi.proffesionalismbydivision", {
                    url: "/report/professionalism/by/division",
                    templateUrl: 'app/components/digi/report/professionalism/professionalism-report-by-division.html',
                    controller: 'professionalismReportByDivisionController',
                    params: {
                        userid: '000',
                        date: ''
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/report/professionalism/professionalism-report-by-division.js',
                                'app/components/factory/ReportModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'lazy_charts_chartist',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_c3'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Report Professionalism By Division'
                    },
                    ncyBreadcrumb: {
                        label: 'Report Professionalism By Division'
                    }
                })
                .state("digi.proffesionalismbyalldeptindiv", {
                    url: "/report/professionalism/by/all/department/in/division",
                    templateUrl: 'app/components/digi/report/professionalism/professionalism-report-by-all-dept-in-div.html',
                    controller: 'professionalismReportByAllDeptInDivController',
                    params: {
                        userid: '000',
                        date: ''
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/report/professionalism/professionalism-report-by-all-dept-in-div.js',
                                'app/components/factory/ReportModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'lazy_charts_chartist',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_c3'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Report Professionalism By All Department In Division'
                    },
                    ncyBreadcrumb: {
                        label: 'Report Professionalism By All Department In Division'
                    }
                })

                .state("digi.Uploadproject", {
                    url: "/UploadResourceAssignment/uploadnew",
                    templateUrl: 'app/components/digi/Resourceassignment/uploadnew/Uploadproject.html',
                    controller: 'digiuploadproject',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/Resourceassignment/uploadnew/Uploadproject.js',
                                'lazy_datatables',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/AttendanceModuleFactory.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Resourceassignment'
                    },
                    ncyBreadcrumb: {
                        label: 'Resourceassignment'
                    }
                })

                .state("digi.digiresourcepoolviewall", {
                    url: "/Resource/Allocation/Plan/View/Pool",
                    templateUrl: 'app/components/digi/resourceallocation/ResourcePoolViewAll/resource-pool-viewall.html',
                    controller: 'digiResourcePoolViewAll',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_gantt_chart',
                                'app/components/digi/resourceallocation/ResourcePoolViewAll/ResourcePoolViewAllController.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Resource Pool View All'
                    },
                    ncyBreadcrumb: {
                        label: 'Resource Pool View All'
                    }
                })

        }
    ]);




    




/*
 *  Altair Admin angularjs
 *  controller
 */

angular
    .module('altairApp')
    .controller('mainCtrl', [
        function () {}
    ])
;

/* ocLazyLoad config */

altairApp
    .config([
        '$ocLazyLoadProvider',
        function($ocLazyLoadProvider) {
            $ocLazyLoadProvider.config({
                debug: false,
                events: false,
                modules: [
                    // ----------- UIKIT ------------------
                    {
                        name: 'lazy_uikit',
                        files: [
                            // uikit core
                            "bower_components/uikit/js/uikit.min.js",
                            // uikit components
                            "bower_components/uikit/js/components/accordion.min.js",
                            "bower_components/uikit/js/components/autocomplete.min.js",
                            "assets/js/custom/uikit_datepicker.min.js",
                            "bower_components/uikit/js/components/form-password.min.js",
                            "bower_components/uikit/js/components/form-select.min.js",
                            "bower_components/uikit/js/components/grid.min.js",
                            "bower_components/uikit/js/components/lightbox.min.js",
                            "bower_components/uikit/js/components/nestable.min.js",
                            "bower_components/uikit/js/components/notify.min.js",
                            "bower_components/uikit/js/components/slider.min.js",
                            "bower_components/uikit/js/components/slideshow.min.js",
                            "bower_components/uikit/js/components/sortable.min.js",
                            "bower_components/uikit/js/components/sticky.min.js",
                            "bower_components/uikit/js/components/tooltip.min.js",
                            "assets/js/custom/uikit_timepicker.min.js",
                            "bower_components/uikit/js/components/upload.min.js",
                            "assets/js/custom/uikit_beforeready.min.js",
                            // styles
                            "bower_components/uikit/css/uikit.almost-flat.min.css"
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    //-------- ANGULAR MD5 ------------------



                    // ----------- FORM ELEMENTS -----------
                    {
                        name: 'lazy_autosize',
                        files: [
                            'bower_components/autosize/dist/autosize.min.js',
                            'app/modules/angular-autosize.min.js'
                        ],
                        serie: true
                    },

                    {
                        name: 'lazy_iCheck',
                        files: [
                            "bower_components/iCheck/icheck.min.js",
                            'app/modules/angular-icheck.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_selectizeJS',
                        files: [
                            'bower_components/selectize/dist/js/standalone/selectize.min.js',
                            'app/modules/angular-selectize.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_switchery',
                        files: [
                            'bower_components/switchery/dist/switchery.min.js',
                            'app/modules/angular-switchery.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_ionRangeSlider',
                        files: [
                            'bower_components/ion.rangeslider/js/ion.rangeSlider.min.js',
                            'app/modules/angular-ionRangeSlider.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_masked_inputs',
                        files: [
                             'bower_components/jquery.inputmask/dist/min/jquery.inputmask.bundle.min.js'
                        ]
                    },
                    {
                        name: 'lazy_character_counter',
                        files: [
                            'app/modules/angular-character-counter.min.js'
                        ]
                    },
                    {
                        name: 'lazy_parsleyjs',
                        files: [
                            'assets/js/custom/parsleyjs_config.min.js',
                            'bower_components/parsleyjs/dist/parsley.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_wizard',
                        files: [
                            'bower_components/angular-wizard/dist/angular-wizard.min.js'
                        ]
                    },
                    {
                        name: 'lazy_ckeditor',
                        files: [
                            'bower_components/ckeditor/ckeditor.js',
                            'app/modules/angular-ckeditor.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_tinymce',
                        files: [
                            'bower_components/tinymce/tinymce.min.js',
                            'app/modules/angular-tinymce.min.js'
                        ],
                        serie: true
                    },

                    // ----------- CHARTS -----------
                    {
                        name: 'lazy_charts_chartist',
                        files: [
                            'bower_components/chartist/dist/chartist.min.css',
                            'bower_components/chartist/dist/chartist.min.js',
                            'app/modules/angular-chartist.min.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_charts_easypiechart',
                        files: [
                            'bower_components/jquery.easy-pie-chart/dist/angular.easypiechart.min.js'
                        ]
                    },
                    {
                        name: 'lazy_charts_metricsgraphics',
                        files: [
                            'bower_components/metrics-graphics/dist/metricsgraphics.css',
                            'bower_components/d3/d3.min.js',
                            'bower_components/metrics-graphics/dist/metricsgraphics.min.js',
                            'app/modules/angular-metrics-graphics.min.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_charts_c3',
                        files: [
                            'bower_components/c3js-chart/c3.min.css',
                            'bower_components/d3/d3.min.js',
                            'bower_components/c3js-chart/c3.min.js',
                            'bower_components/c3-angular/c3-angular.min.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_charts_peity',
                        files: [
                            'bower_components/peity/jquery.peity.min.js',
                            'app/modules/angular-peity.min.js'
                        ],
                        serie: true
                    },

                    // ----------- COMPONENTS -----------
                    {
                        name: 'lazy_countUp',
                        files: [
                            'bower_components/countUp.js/dist/countUp.min.js',
                            'app/modules/angular-countUp.min.js'
                        ],
                        serie: true
                    },
                    {
                        name:'treeview2',
                        files:[
                            'bower_components/treeview/ivh-treeview.css',
                            'bower_components/treeview/ivh-treeview-theme-basic.css',
                            // 'bower_components/treeview/angular-qrcode.js'

                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_clndr',
                        files: [
                            'bower_components/clndr/clndr.min.js',
                            'bower_components/angular-clndr/angular-clndr.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_google_maps',
                        files: [
                            'bower_components/ngmap/services/ng-map.js',
                            'bower_components/ngmap/directives/marker.js'
                        ],
                        serie: true
                    },
                        {
                        name: 'map2',
                        files: [
                            'bower_components/ngmap2/ng-map.min.js'
                            
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_weathericons',
                        files: [
                            'bower_components/weather-icons/css/weather-icons.min.css'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_prismJS',
                        files: [
                            "bower_components/prism/prism.js",
                            "bower_components/prism/components/prism-php.js",
                            "bower_components/prism/plugins/line-numbers/prism-line-numbers.js",
                            'app/modules/angular-prism.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_dragula',
                        files: [
                            'bower_components/angular-dragula/dist/angular-dragula.min.js'
                        ]
                    },
                    {
                        name: 'lazy_pagination',
                        files: [
                            'bower_components/angularUtils-pagination/dirPagination.js'
                        ]
                    },
                    {
                        name: 'lazy_diff',
                        files: [
                            'bower_components/jsdiff/diff.min.js'
                        ]
                    },

                    // ----------- PLUGINS -----------
                    {
                        name: 'lazy_fullcalendar',
                        files: [
                            'bower_components/fullcalendar/fullcalendar.min.css',
                            'bower_components/fullcalendar/fullcalendar.min.js',
                            'bower_components/fullcalendar/gcal.js',
                            'bower_components/angular-ui-calendar/src/calendar.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_codemirror',
                        files: [
                            "bower_components/codemirror/lib/codemirror.css",
                            "assets/css/codemirror_themes.min.css",
                            "bower_components/codemirror/lib/codemirror.js",
                            "assets/js/custom/codemirror_fullscreen.min.js",
                            "bower_components/codemirror/addon/edit/matchtags.js",
                            "bower_components/codemirror/addon/edit/matchbrackets.js",
                            "bower_components/codemirror/addon/fold/xml-fold.js",
                            "bower_components/codemirror/mode/htmlmixed/htmlmixed.js",
                            "bower_components/codemirror/mode/xml/xml.js",
                            "bower_components/codemirror/mode/php/php.js",
                            "bower_components/codemirror/mode/clike/clike.js",
                            "bower_components/codemirror/mode/javascript/javascript.js",
                            "app/modules/angular-codemirror.min.js"
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_datatables',
                        files: [
                            'bower_components/datatables/media/js/jquery.dataTables.min.js',
                            'bower_components/datatables-colvis/js/dataTables.colVis.js',
                            'bower_components/datatables-tabletools/js/dataTables.tableTools.js',
                            'bower_components/angular-datatables/dist/angular-datatables.js',
                            'assets/js/custom/jquery.dataTables.columnFilter.js',
                            'bower_components/angular-datatables/dist/plugins/columnfilter/angular-datatables.columnfilter.min.js',
                            'assets/js/custom/datatables_uikit.js'
                        ],
                        serie: true
                    },
                    {
                        name:'tree_menu2',
                        files:[
                            'bower_components/angular-bootsrap-tree/jquery-2.1.4.js',
                            'bower_components/angular-bootsrap-tree/bootstrap.min.js',
                            'bower_components/angular-bootsrap-tree/bootstrap.min.js',
                            'bower_components/angular-bootsrap-tree/angular-bootstrap-tree.js',
                            'bower_components/angular-bootsrap-tree/angular-bootstrap-tree.css',
                            'bower_components/angular-bootsrap-tree/font-awesome.css'
                        ],
                        serie: true
                    },
                     {
                        name:'qrcode',
                        files:[
                            'bower_components/qrcode-generator/qrcode.js',
                            'bower_components/qrcode-generator/qrcode_UTF8.js',
                            'bower_components/angular-qrcode/angular-qrcode.js'
                            
                        ],
                        serie: true
                    },
                    {
                        name:'autocom',
                        files:[
                            
                            'bower_components/autocomplete/angular-kendo.js'
                            
                        ],
                        serie: true
                    },
                    {
                        name:'moment',
                        files:[

                            'bower_components/moment/moment.js',
                            'bower_components/moment/min/moment.min.js',
                            'bower_components/moment/min/locales.js',
                            'bower_components/moment/min/locales.min.js',
                            'bower_components/moment/min/moment-with-locales.js',
                            'bower_components/moment/min/moment-with-locales.min.js',

                        ],
                        serie: true
                    },
                    {
                        name:'base64',
                        files:[

                            'bower_components/angular-base64/angular-base64.js',
                            'bower_components/angular-base64/angular-base64.min.js',

                        ],
                        serie: true
                    },
                    {
                        name:'base64upload',
                        files:[

                            'bower_components/angular-base64-upload/dist/angular-base64-upload.js',
                            'bower_components/angular-base64-upload/dist/angular-base64-upload.min.js',

                        ],
                        serie: true
                    },
                    {
                        name:'tree_menu_tes',
                        files:[
                            'bower_components/tree2/style.css'
                        ],
                        serie: true
                    },

                    {
                        name: 'lazy_gantt_chart',
                        files: [
                            <!-- jquery ui -->
                            'bower_components/jquery-ui/ui/minified/core.min.js',
                            'bower_components/jquery-ui/ui/minified/widget.min.js',
                            'bower_components/jquery-ui/ui/minified/mouse.min.js',
                            'bower_components/jquery-ui/ui/minified/resizable.min.js',
                            'bower_components/jquery-ui/ui/minified/draggable.min.js',
                            <!-- gantt chart -->
                            'assets/js/custom/gantt_chart.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_tablesorter',
                        files: [
                            'bower_components/tablesorter/dist/js/jquery.tablesorter.min.js',
                            'bower_components/tablesorter/dist/js/jquery.tablesorter.widgets.min.js',
                            'bower_components/tablesorter/dist/js/widgets/widget-alignChar.min.js',
                            'bower_components/tablesorter/dist/js/widgets/widget-columnSelector.min.js',
                            'bower_components/tablesorter/dist/js/widgets/widget-print.min.js',
                            'bower_components/tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_vector_maps',
                        files: [
                            'bower_components/raphael/raphael-min.js',
                            'bower_components/jquery-mapael/js/jquery.mapael.js',
                            'bower_components/jquery-mapael/js/maps/world_countries.js',
                            'bower_components/jquery-mapael/js/maps/usa_states.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'font_awesome',
                        files: [

                            'bower_components/font_awesome/css/font-awesome.min.css',

                        ],
                        serie: true
                    },

                    {
                        name: 'font_bostrap',
                        files: [

                            'bower_components/boostrapfont/css/bootstrap.css',
                            'bower_components/boostrapfont/css/bootstrap-theme.css',


                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_dropify',
                        files: [
                            'assets/skins/dropify/css/dropify.css',
                            'assets/js/custom/dropify/dist/js/dropify.min.js'
                        ],
                        insertBefore: '#main_stylesheet'
                    },
                    {
                        name: 'lazy_tree',
                        files: [
                            'assets/skins/jquery.fancytree/ui.fancytree.min.css',
                            <!-- jquery ui -->
                            'bower_components/jquery-ui/jquery-ui.min.js',
                            <!-- fancytree -->
                            'bower_components/jquery.fancytree/dist/jquery.fancytree-all.min.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_idle_timeout',
                        files: [
                            'bower_components/ng-idle/angular-idle.min.js'
                        ]
                    },
                    {
                        name: 'lazy_tour',
                        files: [
                            'bower_components/enjoyhint/enjoyhint.min.js'
                        ]
                    },
                    {
                        name: 'lazy_filemanager',
                        files: [
                            'bower_components/jquery-ui/themes/smoothness/jquery-ui.min.css',
                            'file_manager/css/elfinder.min.css',
                            'file_manager/themes/material/css/theme.css',
                            'bower_components/jquery-ui/jquery-ui.min.js',
                            'file_manager/js/elfinder.min.js'
                        ],
                        serie: true
                    },

                    // ----------- KENDOUI COMPONENTS -----------
                    {
                        name: 'lazy_KendoUI',
                        files: [
                            'bower_components/kendo-ui/js/kendo.core.min.js',
                            'bower_components/kendo-ui/js/kendo.color.min.js',
                            'bower_components/kendo-ui/js/kendo.data.min.js',
                            'bower_components/kendo-ui/js/kendo.calendar.min.js',
                            'bower_components/kendo-ui/js/kendo.popup.min.js',
                            'bower_components/kendo-ui/js/kendo.datepicker.min.js',
                            'bower_components/kendo-ui/js/kendo.timepicker.min.js',
                            'bower_components/kendo-ui/js/kendo.datetimepicker.min.js',
                            'bower_components/kendo-ui/js/kendo.list.min.js',
                            //'bower_components/kendo-ui/js/kendo.listbox.min.js',
                            'bower_components/kendo-ui/js/kendo.fx.min.js',
                            'bower_components/kendo-ui/js/kendo.userevents.min.js',
                            'bower_components/kendo-ui/js/kendo.menu.min.js',
                            'bower_components/kendo-ui/js/kendo.draganddrop.min.js',
                            'bower_components/kendo-ui/js/kendo.slider.min.js',
                            'bower_components/kendo-ui/js/kendo.mobile.scroller.min.js',
                            'bower_components/kendo-ui/js/kendo.autocomplete.min.js',
                            'bower_components/kendo-ui/js/kendo.combobox.min.js',
                            'bower_components/kendo-ui/js/kendo.dropdownlist.min.js',
                            'bower_components/kendo-ui/js/kendo.colorpicker.min.js',
                            'bower_components/kendo-ui/js/kendo.combobox.min.js',
                            'bower_components/kendo-ui/js/kendo.maskedtextbox.min.js',
                            'bower_components/kendo-ui/js/kendo.multiselect.min.js',
                            'bower_components/kendo-ui/js/kendo.numerictextbox.min.js',
                            'bower_components/kendo-ui/js/kendo.toolbar.min.js',
                            'bower_components/kendo-ui/js/kendo.panelbar.min.js',
                            'bower_components/kendo-ui/js/kendo.window.min.js',
                            'bower_components/kendo-ui/js/kendo.angular.min.js',
                            'bower_components/kendo-ui/styles/kendo.common-material.min.css',
                            'bower_components/kendo-ui/styles/kendo.material.min.css'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    //HIGHCHARTS JS
                    {
                        name: 'lazy_HighChartsJS',
                        files: [
                            'bower_components/highcharts-ng/dist/highcharts-ng.css',
                            'bower_components/highcharts-ng/dist/highcharts-ng.js'
                        ],
                        serie: true
                    },

                    //ANGULAR CHARTS JS
                    {
                        name: 'lazy_AngularChartsJS',
                        files: [
                            'bower_components/angular-chart.js/dist/angular-chart.min.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    // ----------- UIKIT HTMLEDITOR -----------
                    {
                        name: 'lazy_htmleditor',
                        files: [
                            "bower_components/codemirror/lib/codemirror.js",
                            "bower_components/codemirror/mode/markdown/markdown.js",
                            "bower_components/codemirror/addon/mode/overlay.js",
                            "bower_components/codemirror/mode/javascript/javascript.js",
                            "bower_components/codemirror/mode/php/php.js",
                            "bower_components/codemirror/mode/gfm/gfm.js",
                            "bower_components/codemirror/mode/xml/xml.js",
                            "bower_components/marked/lib/marked.js",
                            "bower_components/uikit/js/components/htmleditor.js"
                        ],
                        serie: true
                    },

                    // ----------- THEMES -------------------
                    {
                        name: 'lazy_themes',
                        files: [
                            "assets/css/themes/_theme_a.min.css",
                            "assets/css/themes/_theme_b.min.css",
                            "assets/css/themes/_theme_c.min.css",
                            "assets/css/themes/_theme_d.min.css",
                            "assets/css/themes/_theme_e.min.css",
                            "assets/css/themes/_theme_f.min.css",
                            "assets/css/themes/_theme_g.min.css",
                            "assets/css/themes/_theme_h.min.css",
                            "assets/css/themes/_theme_i.min.css",
                            "assets/css/themes/_theme_dark.min.css"
                        ]
                    },

                    // ----------- STYLE SWITCHER -----------
                    {
                        name: 'lazy_style_switcher',
                        files: [
                            "assets/css/style_switcher.min.css",
                            "app/shared/style_switcher/style_switcher.js"
                        ]
                    }

                ]
            })
        }
    ]);