var rootPath = 'http://le-jar-service.herokuapp.com';

var userModule = angular.module('leJarModule', []);

var entriesController = userModule.controller('entriesController', function ($scope, $http) {
    $scope.logout = function () {
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        location.reload();
    }
    $scope.selectMenu = function (selected, panelId) {
        activeMenu(selected);
        hideAllPanels();
        showPanel(panelId);
    }
    var refreshBalance = function () {
        $http.get(rootPath + '/balance/total')
                .then(setTotalBalance);
        $http.get(rootPath + '/balance/todays')
                .then(setTodayBalance);
        $http.get(rootPath + '/balance/todays/byUserId/' + localStorage.userId)
                .then(setTodayPersonalBalance);
        $http.get(rootPath + '/balance/total/byUserId/' + localStorage.userId)
                .then(setTotalPersonalBalance);
    };
    var findAllUsers = function (response) {
        $scope.users = response.data.users;
    }
    if (localStorage.userId === undefined) {
        hideBalance();
        $http.get(rootPath + '/users/all')
                .then(findAllUsers);
    } else {
        showBalance();
        refreshBalance();
        $scope.selectMenu('randomClass','randomId');
        $scope.name = localStorage.name;
    }

    var checkResponse = function (response) {
        if (response.data.errorCode === 400) {
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
        refreshBalance();
    }

    var setTotalBalance = function (response) {
        $scope.totalBalance = response.data;
    };
    var setTodayBalance = function (response) {
        $scope.todayBalance = response.data;
    };

    var setTodayPersonalBalance = function (response) {
        console.log(response.data);
        $scope.todayPersonalBalance = response.data;

    };
    var setTotalPersonalBalance = function (response) {
        console.log(response.data);
        $scope.totalPersonalBalance = response.data;

    };

    $scope.evaluatePayment = function (val) {
        if (val) {
            $('#todayPayment').css('color', 'green');
            return 'PAID';
        }
        $('#todayPayment').css('color', 'red');
        return 'UNPAID';
    }

    $scope.evaluateAmount = function (amount) {
        if (amount > 0) {
            $('#todayTotalBalance').css('color', '#23E223');
            return amount;
        } else {
            $('#todayTotalBalance').css('color', 'green');
            return amount;
        }
    }

    refreshBalance();

    $scope.saveUser = function () {
        localStorage.userId = $scope.currentUser._id;
        localStorage.name = $scope.currentUser.first_name + ' ' + $scope.currentUser.last_name;
        $scope.name = localStorage.name;
        showBalance();
    }





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
    $('#menuId').show();
    $('#balanceId').show();
    $('#randomId').show();
    $('#userSelection').hide();
}

function hideBalance() {
    $('#menuId').hide();
    $('#balanceId').hide();
    $('#randomId').hide();
    $('#userSelection').show();
}
