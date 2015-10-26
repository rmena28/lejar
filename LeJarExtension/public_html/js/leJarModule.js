
var rootPath = 'http://le-jar-service.herokuapp.com';

var userModule = angular.module('leJarModule', []);

var entriesController = userModule.controller('entriesController', function ($scope, $http) {

    $scope.viewMode = 'random';

    $scope.selectViewMode = function (viewMode) {
        $scope.viewMode = viewMode;
    };

    $scope.startAccordion = function () {
        $(document).ready(function () {
            $('.collapsible').collapsible({
            });
        });
    };

    $scope.logout = function () {
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        localStorage.removeItem('isUserApprover');
        localStorage.removeItem('isUserMaintenance');
        location.reload();
    };
    $scope.generateRandom = function () {
        generateRandom($scope, $http);
    };
    $scope.saveUser = function () {
        localStorage.userId = $scope.currentUser._id;
        localStorage.name = $scope.currentUser.first_name + ' ' + $scope.currentUser.last_name;
        localStorage.isUserApprover = $scope.currentUser.is_user_approver;
        localStorage.isUserMaintenance = $scope.currentUser.is_user_maintenance;
        $scope.name = localStorage.name;
        $scope.is_user_approver = localStorage.isUserApprover;
        $scope.is_user_maintenance = localStorage.isUserMaintenance;
        showBalance();
    };

    $scope.loadDashboardInfo = function () {
        loadDashboardInformation($scope, $http);
    };

    if (localStorage.userId === undefined) {
        hideBalance();
        findAllUsers($scope, $http);
    } else {
        showBalance();
        $scope.name = localStorage.name;
        $scope.is_user_approver = localStorage.isUserApprover;
        $scope.is_user_maintenance = localStorage.isUserMaintenance;
    }

    $scope.findEntriesByUser = function () {
        findEntriesByUser($scope, $http);
    };

    $scope.findAllEntries = function () {
        findAllEntries($scope, $http);
    };

    $scope.clickOnElement = function (elementId) {
        console.log('Clickying');
        document.getElementById(elementId).click();
        //$('#' + elementId).click();
    };

    $scope.approveEntry = function (entry) {
        approveEntry($scope, $http, entry);
    };
});

function  findEntriesByUser($scope, $http) {
    $http.get(rootPath + '/entries/all/byUserId/' + localStorage.userId)
            .then(function (response) {
                $scope.userEntries = response.data.results;
            });
}

function  findAllEntries($scope, $http) {
    $http.get(rootPath + '/entries/all')
            .then(function (response) {
                $scope.entries = response.data;
            });
}


function findAllUsers($scope, $http) {
    $http.get(rootPath + '/users/all')
            .then(function (response) {
                $scope.users = response.data.users;
                console.log($scope.users);
                startSelects();
            });
}



function loadDashboardInformation($scope, $http) {
    $http.get(rootPath + '/entries/dashboard/byUserId/' + localStorage.userId)
            .then(function (response) {
                $scope.dashboard = response.data;
                console.log($scope.dashboard);
            });
}

function approveEntry($scope, $http, entry) {
    $http({
        method: 'PUT',
        url: rootPath + '/entries/paid/byEntryId/' + entry._id
    }).then(function (response) {
        Materialize.toast(response.data.message, 3000);
        $scope.findAllEntries();
    }, function (response) {
        Materialize.toast(response.data.errorMessage, 3000);
    });
    
    
}

function generateRandom($scope, $http) {
    $http.get(rootPath + '/entries/add/byUserId/' + localStorage.userId)
            .then(function (response) {
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
            });
}
