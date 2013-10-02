var minutesPerCheck = 10;

var unreadEvents = 0;
var lastCheckKey = 'last_checked';
var notificationKey = 'notification_key';
var _this;

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
};

Notifications.prototype.fetchLatestNotification = function() {
    $.getJSON("http://www.kogan.com/au/api/events/", function(data) {
        localStorage.setItem("notifications", JSON.stringify(response));
        var lastNotifcation = localStorage.getItem(notificationKey);
        if(lastNotifcation != data[0].data.url) {
            _this.showNotification(data[0]);
            _this.resetBadgeText(unreadEvents + 1);
            localStorage.setItem(notificationKey, data[0].data.url);
        }
    });
};

Notifications.prototype.getLatestPushNotification = function() {

    var count;
    var last_checked = localStorage.getItem(lastCheckKey);
    $.getJSON("http://www.kogan.com/au/api/events/count/", {'timestamp': last_checked}, function(data) {
        count = data['count'];
        last_checked = data['timestamp'];

        if(count > 0) {
            _this.fetchLatestNotification();
        }
        _this.resetBadgeText(count);
        localStorage.setItem(lastCheckKey, last_checked);
    });

};

new Notifications();
