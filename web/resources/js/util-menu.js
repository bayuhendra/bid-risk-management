var menu = [];

const renderMenuGroupElement = function (menuGroup) {
    let menuGroupElement = $(
            `<li class="treeview">
            <a href="#">
                <i class="fa fa-laptop"></i>
                <span>${menuGroup.title}</span>
            </a>
        </li>`);

    let menuChildrenElement = $('<ul class="treeview-menu"></ul>').appendTo(menuGroupElement);

    let menuChildren = menu.filter(menuItem => menuItem.parent == menuGroup.vid);

    menuChildren.forEach(menuChild => {
        let menuChildElement = $(
                `<li>
                    <a href="#">
                        <i class="fa fa-circle-o"></i>${menuChild.title}
                    </a>
                </li>`).appendTo(menuChildrenElement);
        menuChildElement.on('click', function () {
            loadPage(menuChild.vid)
        });
    });

    return menuGroupElement;
};

const renderGroupedMenu = function () {
    let menuContainer = $('#menu');
    let menuGroups = menu.filter(menuItem => menuItem.parent == null || menuItem.parent == "null");
    let menuGroupElements = menuGroups.map(menuGroup => renderMenuGroupElement(menuGroup));
    menuContainer.empty();
    menuGroupElements.forEach(menuGroupElement => menuContainer.append(menuGroupElement));
}

const renderFlatMenu = function (searchKeyword) {
    let menuContainer = $('#menu');
    let filteredMenu = menu.filter(function (menuItem) {
        if (menuItem.parent == null || menuItem.parent == 'null' || menuItem.parent == '') {
            return false;
        }
        return menuItem.parent != null && menuItem.title.toLowerCase().indexOf(searchKeyword) > -1
    });
    menuContainer.empty();
    filteredMenu.forEach(menuItem => {
        let menuItemElement = $(
                `<li><a href="#">
                <i class="fa fa-circle-o"></i>${menuItem.title}
            </a><\li>`
                );
        menuItemElement.on('click', function () {
            loadPage(menuChild.vid)
        })
        menuContainer.append(menuItemElement);
    });
};

const renderMenu = function () {
    var searchKeyword = $('#menu-search').val();

    if (searchKeyword == null || searchKeyword == "") {
        renderGroupedMenu();
    } else {
        renderFlatMenu(searchKeyword);
    }

};

const loadMenu = function (role) {
    if (!role) {
        role = localStorage.role;
    }
    var processResult = function (result) {
        if (!result.data) {
            console.log("Can't find menu data in: ", result);
            return;
        }
        menu = result.data;
        renderMenu();
        $("#menu-search").on('keyup', renderMenu);
    }
    postRequest("/svc-jdc-dashboard/rest/jdc/dsh000/menu-role", role, processResult, {async: true});
};
