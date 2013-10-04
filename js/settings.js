var API_URL = 'http://www.kogan.com/au/api/events/';
var UTM = '?utm_source=kogan&utm_medium=chrome-extension';

var LAST_CHECK_KEY = 'last_checked';
var NOTIFICATION_KEY = 'notification_key';
var NOTIFICATIONS = 'notifications';
var OPTIONS_KEY = 'options';

// var EVENT_TYPES = [
//     {
//         'name': 'Price Drops',
//         'value': 'price-drop',
//         'checked': true,
//     },
//     {
//         'name': 'Free Shipping',
//         'value': 'free-shipping',
//         'checked': true,
//     },
//     {
//         'name': 'Back In Stock',
//         'value': 'in-stock',
//         'checked': true,
//     },
//     {
//         'name': 'New Products',
//         'value': 'new-product',
//         'checked': true,
//     },
//     {
//         'name': 'Blog Posts',
//         'value': 'new-post',
//         'checked': true,
//     },
// ];

var DEFAULT_OPTIONS = {
    'show_notification': '1',
    'poll_interval': '1',
    // 'event_types': EVENT_TYPES,
};
