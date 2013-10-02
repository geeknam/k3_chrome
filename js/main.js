var KoganApp = angular.module('KoganApp', []);

function NotificationsController($scope, $http) {
    $http.get('http://www.kogan.com/au/api/events/').success(function(response){
        $scope.notifications = response;
        chrome.browserAction.setBadgeText({'text': ''});
    });
}


