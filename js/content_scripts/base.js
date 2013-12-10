angular.element(document).ready(function() {
    angular.module('myApp', []);
    angular.bootstrap(document, ['myApp']);
});


var body = document.getElementsByTagName('body');
body[0].setAttribute("data-ng-controller", "NotificationsController");


function NotificationsController($scope, $http) {
    if(product_name && price) {
        try {
            $http.get(SEARCH_API_URL + '?limit=1&keywords=' + product_name).success(function(data){
                if(data.objects.length) {
                    var product = data.objects[0];
                    var message = {
                        product: product,
                        competitor: competitor
                    };
                    if(product.your_price < price) {
                        message.cheaper = true;
                        chrome.runtime.sendMessage(message, function(response) {});
                    } else {
                        message.cheaper = false;
                        var payload = {
                            competitor_url: window.location.href,
                            competitor_price: price,
                            product: product.url
                        };
                        chrome.runtime.sendMessage(message, function(response) {});
                        $http({
                            url: COMPARE_API_URL,
                            method: "POST",
                            data: payload,
                        }).success(function (response) {});
                    }
                }
            });

        } catch (error) {
            console.log(error);
        }
    }
}