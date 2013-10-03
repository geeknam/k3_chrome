var KoganApp = angular.module('KoganApp', []);

var minutesPerCheck = 1;

var unreadEvents = 0;
var _this;


function NotificationsController($scope, $http) {

    var Notifications = function(){
        _this = this;
        this.init();
    };

    Notifications.prototype.init = function(){
        if (typeof(localStorage) != 'undefined') {
            var checkInterval = setInterval(this.checkForNewEvents, minutesPerCheck * 60000);
            this.getLatestPushNotification();
        }
    };

    Notifications.prototype.checkForNewEvents = function() {
        _this.getLatestPushNotification();
    };

    Notifications.prototype.resetBadgeText = function(value) {
        if (value > 20) {
            chrome.browserAction.setBadgeText({text: '20+'});
        } else if (value > 0) {
            chrome.browserAction.setBadgeText({text: value.toString()});
        } else {
            chrome.browserAction.setBadgeText({text: ""});
        }
        unreadEvents = value;
    };

    Notifications.prototype.showNotification = function(event) {
        var notification = webkitNotifications.createNotification(
            event.data.image_url,
            event.message,
            event.data.title
        );

        notification.onclick = function() {
            chrome.tabs.create({url: 'http://www.kogan.com'+ event.data.url});
            _this.resetBadgeText(unreadEvents - 1);
        };
        notification.show();
        setTimeout(function() {
            notification.cancel();
        }, 5000);
    };

    Notifications.prototype.fetchLatestNotification = function() {

        $http.get(API_URL).success(function(data){

            var lastNotification = localStorage.getItem(NOTIFICATION_KEY);
            if(lastNotification != data[0].data.url) {
                _this.showNotification(data[0]);
                _this.resetBadgeText(unreadEvents + 1);
                localStorage.setItem(NOTIFICATION_KEY, data[0].data.url);
            }

            angular.forEach(data, function(value, key){
               value.data.url += UTM + '&utm_campaign=' + value.type ;
            });

            localStorage.setItem(NOTIFICATIONS, JSON.stringify(data));
        });
    };

    Notifications.prototype.getLatestPushNotification = function() {

        var count;
        var last_checked = localStorage.getItem(LAST_CHECK_KEY);

        $http.get(API_URL + "count/?timestamp=" + last_checked).success(function(data){
            count = data['count'];
            last_checked = data['timestamp'];
            if(count > 0) {
                _this.fetchLatestNotification();
            }
            _this.resetBadgeText(count);
            localStorage.setItem(LAST_CHECK_KEY, last_checked);
        });
    };

    new Notifications();

}


