angular.element(document).ready(function() {
    angular.module('myApp', []);
    angular.bootstrap(document, ['myApp']);
});


var body = document.getElementsByTagName('body');
body[0].setAttribute("data-ng-controller", "NotificationsController");


function NotificationsController($scope, $http) {

    try {
        $http.get(SEARCH_API_URL + '?limit=1&keywords=' + product_name).success(function(data){
            if(data.objects.length) {
                var product = data.objects[0];
                var message = {
                    product: product,
                };
                if(product.your_price < price) {
                    message.cheaper = true;
                    chrome.runtime.sendMessage(message, function(response) {});
                } else {
                    message.cheaper = false;
                    chrome.runtime.sendMessage(message, function(response) {});
                }
            }
        });

    } catch (error) {
        console.log(error);
    }

}