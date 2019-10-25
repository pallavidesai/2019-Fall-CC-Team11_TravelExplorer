'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [])
    .controller('View1Ctrl', function ($scope, $http) {
        $scope.sendmail = function () {
            alert("hellooooo");
            var placeEntered = $scope.formData.email;
            if (placeEntered != null && placeEntered != "") {
                $scope.finalErr ="Mail successfully sent";
                $http.get('http://127.0.0.1:8081/getDataEmail?searchkey='+$scope.formData.email+'&searchkey1='+$scope.formData.mes+'&searchkey2='+$scope.formData.sub).then(function(data)
                {
                    alert("success");

                },function(err)
                {
                    console.log(err);
                })
            }
        }

    });
