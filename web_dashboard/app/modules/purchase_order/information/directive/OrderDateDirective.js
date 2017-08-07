app.directive("orderDate", ["$rootScope", function($rootScope) {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            elem.bind('keyup', function() {
                var user_is_master = parseInt($rootScope.logged_user.master);

                var input_date = elem[0].value;
                input_date = input_date.split("/");

                // MX to US date
                var string_date = "{0}/{1}/{2}".format(input_date[0], input_date[1], input_date[2]);
                var input_date = new Date(string_date);
                var current_date = new Date();

                var diff_days = parseInt((current_date - input_date) / (1000 * 60 * 60 * 24));

                if (user_is_master) {
                    $rootScope.order_date_status = true;
                    scope.$apply(function() {
                        scope.invoice.dorder = string_date;
                    });
                } else {
                    if ((diff_days < 30) && (diff_days > 0)) {
                        $rootScope.order_date_status = true;
                        scope.$apply(function() {
                            scope.invoice.dorder = string_date;
                        });
                    } else {
                        $rootScope.order_date_status = false;
                        scope.$apply(function() {
                            scope.invoice.dorder = string_date;
                        });
                    }
                }

            });
        }
    };
}]);
