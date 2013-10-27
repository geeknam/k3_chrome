var API_URL = 'http://www.kogan.com/au/api/events/';
var UTM = '?utm_source=kogan&utm_medium=chrome-extension';

var LAST_CHECK_KEY = 'last_checked';
var LAST_SHOWN_SUMMARY = 'last_shown_summary';
var NOTIFICATION_KEY = 'notification_key';
var NOTIFICATIONS = 'notifications';
var OPTIONS_KEY = 'options';

var EVENT_TYPES = [
    {
        'name': 'Category Events',
        'value': 'category',
        'checked': true,
    },
    {
        'name': 'Price Drops',
        'value': 'price-drop',
        'checked': true,
    },
    {
        'name': 'Free Shipping',
        'value': 'free-shipping',
        'checked': true,
    },
    {
        'name': 'Back In Stock',
        'value': 'product-instock',
        'checked': true,
    },
    {
        'name': 'New Products',
        'value': 'new-product',
        'checked': true,
    },
    {
        'name': 'Blog Posts',
        'value': 'new-post',
        'checked': true,
    },
    {
        'name': 'Media Articles',
        'value': 'new-newsroompost',
        'checked': true,
    },
];

var DEFAULT_OPTIONS = {
    'show_notification': '1',
    'poll_interval': '1',
    'event_types': EVENT_TYPES,
    'frequency': '1'
};


var SEARCH_API_URL = "http://www.kogan.com/au/api/search/";