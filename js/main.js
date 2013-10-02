var KoganApp = angular.module('KoganApp', []);

var utm = '?utm_source=kogan&utm_medium=chrome-extension';

function NotificationsController($scope, $http) {
    $http.get('http://www.kogan.com/au/api/events/').success(function(response){
        
        angular.forEach(response, function(value, key){
           value.data.url += utm + '&utm_campaign=' + value.type ;
        });
        $scope.notifications = response;
        chrome.browserAction.setBadgeText({'text': ''});
    });
}


