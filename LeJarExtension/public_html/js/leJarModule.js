
var rootPath = 'http://le-jar-service.herokuapp.com';

var userModule = angular.module('leJarModule', []);

var entriesController = userModule.controller('entriesController', function ($scope, $http) {
    $scope.logout = function () {
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        location.reload();
    };
    $scope.selectMenu = function (selected, panelId) {
        activeMenu(selected);
        hideAllPanels();
        showPanel(panelId);
    };
    var loadDashboardInformation = function () {
        $http.get(rootPath + '/entries/dashboard/byUserId/' + localStorage.userId)
                .then(setDashboard);
    };
    var findAllUsers = function (response) {
        $scope.users = response.data.users;
        console.log($scope.users);
        startSelects();
    };
    if (localStorage.userId === undefined) {
        hideBalance();
        $http.get(rootPath + '/users/all')
                .then(findAllUsers);
    } else {
        showBalance();
        loadDashboardInformation();
        $scope.selectMenu('randomClass', 'randomId');
        $scope.name = localStorage.name;
    }

    var checkResponse = function (response) {
        $scope.random_amount = 'RD$' + response.data.random_amount;
        if (response.data.random_amount) {
            Materialize.toast('RD$' + response.data.random_amount, 3000);
        } else if (response.data.errorMessage) {
            Materialize.toast(response.data.errorMessage, 3000);
        } else if (response.data.message) {
            Materialize.toast(response.data.message, 3000);

        }
        if (response.data.errorMessage) {
            $scope.errorMessage = response.data.errorMessage;
            $scope.message = '';
        } else {
            $scope.message = response.data.message;
            $scope.errorMessage = '';
        }
        console.log(response.data);
    };
    $scope.generateRandom = function () {
        console.log('calling script');
        $http.get(rootPath + '/entries/add/byUserId/' + localStorage.userId)
                .then(checkResponse);
        loadDashboardInformation();
    };


    var setDashboard = function (response) {
        $scope.dashboard = response.data;
        console.log($scope.dashboard);
    };
    loadDashboardInformation();


    $scope.saveUser = function () {
        localStorage.userId = $scope.currentUser._id;
        localStorage.name = $scope.currentUser.first_name + ' ' + $scope.currentUser.last_name;
        $scope.name = localStorage.name;
        showBalance();
        loadDashboardInformation();
    };
});


function activeMenu(selectedMenuClass) {
    $('.menuList').removeClass('active');
    $('.' + selectedMenuClass).addClass('active');

}

function hideAllPanels() {
    $('.panelClass').hide();
}

function showPanel(id) {
    $('#' + id).show();
}

function showBalance() {
    $('#hasAccess').show();
    $('#hasNoAccess').hide();
}

function hideBalance() {
    $('#hasAccess').hide();
    $('#hasNoAccess').show();
}

function startSelects(){
    $('select').material_select();
}
