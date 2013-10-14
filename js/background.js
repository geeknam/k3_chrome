var KoganApp = angular.module('KoganApp', []);

var poll_interval = 1; //minute

var unreadEvents = 0;
var _this;

function NotificationsController($scope, $http) {

    var Notifications = function(){
        _this = this;
        this.options = null;
        this.init();
    };

    Notifications.prototype.init = function(){
        this.init_options();
        var interval = this.get_poll_interval();

        if (typeof(localStorage) != 'undefined') {
            var checkInterval = setInterval(this.getLatestPushNotification, interval * 60000);
            this.getLatestPushNotification();
        }

        // Listen for messages from content script
        this.listen();
        this.check_first_install();
    };

    Notifications.prototype.check_first_install = function() {
        // Check whether new version is installed
        chrome.runtime.onInstalled.addListener(function(details){
            if(details.reason == "install"){
                chrome.tabs.create({url: "options.html"});
            }
        });
    };

    Notifications.prototype.init_options = function() {
        this.options = localStorage[OPTIONS_KEY];
        if(!this.options){
            this.options = DEFAULT_OPTIONS;
            localStorage[OPTIONS_KEY] = JSON.stringify(this.options);
        }
        else{
            this.options = JSON.parse(this.options);
        }
    };

    Notifications.prototype.get_preferred_event_types = function() {
        var preferred = [];
        angular.forEach(this.options['event_types'], function(event, idx) {
            if(event.checked) {
                preferred.push(event.value);
            }
        });
        return preferred;
    };

    Notifications.prototype.get_poll_interval = function() {
        if(!this.options) {
            return poll_interval;
        }
        return parseInt(this.options['poll_interval']);
    };

    Notifications.prototype.listen = function() {
        chrome.runtime.onMessage.addListener(
            function(message, sender, sendResponse) {
                var product = message.product;
                if(message.cheaper) {
                    var body = product.title;
                    var title = 'Only $' + product.your_price + ' at Kogan';
                } else {
                    var body = "This happens very rarely but this price is even better than Kogan.";
                    var title = "We recommend you buy it";
                }
                var notification = webkitNotifications.createNotification(
                    'http://www.kogan.com/thumb/' + product.image + '?size=210x140',
                    title, body
                );

                if(message.cheaper) {
                    notification.onclick = function() {
                        chrome.tabs.create({
                            url: 'http://www.kogan.com'+ product.url + UTM + '&utm_campaign=price-match-' + message.competitor
                        });
                    };
                }

                notification.show();
                setTimeout(function() {
                    notification.cancel();
                }, 9000);

            }
        );
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

    Notifications.prototype.validate_notification = function(event) {
        this.init_options();
        var show_notification = this.options['show_notification'];
        var lastNotification = localStorage.getItem(NOTIFICATION_KEY);
        var preferred = this.get_preferred_event_types();
        if(lastNotification != event.data.url && show_notification == '1') {
            return preferred.indexOf(event.type) != -1;
        }
        return false;
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

            if(_this.validate_notification(data[0])) {
                _this.showNotification(data[0]);
                localStorage.setItem(NOTIFICATION_KEY, data[0].data.url);
            }

            angular.forEach(data, function(value, key){
               value.data.url += UTM + '&utm_campaign=' + value.type ;
            });

            localStorage.setItem(NOTIFICATIONS, JSON.stringify(data));
        });
    };

    Notifications.prototype.getLatestPushNotification = function() {
        if(_this.options.frequency == '1') {
            this.parse_summary_notification();
        } else {
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
        }
    };

    Notifications.prototype.show_summary = function() {
        var now = new Date();
        var hour = now.getHours();
        var last_shown = localStorage[LAST_SHOWN_SUMMARY];
        if(!last_shown) {
            if (hour > 14) {
                localStorage[LAST_SHOWN_SUMMARY] = now.getTime();
                return true;
            }
            return false;
        } else {
            last_shown = new Date(last_shown);
            if(last_shown.getDate() < now.getDate() && hour > 14) {
                localStorage[LAST_SHOWN_SUMMARY] = now.getTime();
                return true;
            }
            return false;
        }

    }

    Notifications.prototype.parse_summary_notification = function() {
        var show_summary = this.show_summary();
        if(show_summary) { 
            $http.get(API_URL).success(function(data){
                var summary = {};
                angular.forEach(data, function(value, key){
                    if(value.type in summary) {
                        summary[value.type] += 1;
                    } else {
                        summary[value.type] = 0;
                    }
                });
                _this.get_summary_notification(summary);
            });
        }
    }

    Notifications.prototype.get_summary_notification = function(summary) {
        var event_map = {}
        var message = [];
        angular.forEach(EVENT_TYPES, function(value, key) {
            event_map[value.value] = value.name;
        });
        for(prop in summary) {
            message.push(summary[prop] + ' ' + event_map[prop]);
        }
        message = message.join(', ');
        var notification = webkitNotifications.createNotification(
            'icon.png', 'Daily Summary', message
        );
        notification.onclick = function() {
            chrome.tabs.create({
                url: 'http://www.kogan.com/au/notification/all/' + UTM + '&utm_campaign=summary'
            });
        };
        notification.show();
        setTimeout(function() {
            notification.cancel();
        }, 5000);
    }

    new Notifications();

}


