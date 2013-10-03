var KoganApp = angular.module('KoganApp', []);

function OptionsController($scope) {
    var options = localStorage[OPTIONS_KEY];
    if(!options){
        options = DEFAULT_OPTIONS;
    }
    if(typeof options == 'string') {
        options = JSON.parse(options);
    }

    $scope.show_notification = options['show_notification'];
    $scope.poll_interval = options['poll_interval'];

    $scope.save_options = function() {
        var options = {
            'show_notification': this.show_notification,
            'poll_interval': this.poll_interval,
        };
        localStorage[OPTIONS_KEY] = JSON.stringify(options);
    };
}