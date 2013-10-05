angular.element(document).ready(function() {
    angular.module('myApp', []);
    angular.bootstrap(document, ['myApp']);
});


var body = document.getElementsByTagName('body');
body[0].setAttribute("data-ng-controller", "NotificationsController");


function NotificationsController($scope, $http) {

    try {
        $http.get(SEARCH_API_URL + '?keywords=' + product_name).success(function(data){
            if(data.objects.length) {
                var product = data.objects[0];
                if(product.your_price < price) {
                    chrome.runtime.sendMessage(product, function(response) {
                        console.log(response);
                    });
                }
            }
        });

    } catch (error) {
        console.log(error);
    }

}