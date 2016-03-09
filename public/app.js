var app = angular.module('MeanApp', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
				templateUrl : 'login.html',
				controller  : 'mainController'
		})
		.when('/crud', {
				templateUrl : 'crud.html',
				controller  : 'NewsController'
		})
});

app.controller('mainController' , function($scope, $http) {
	$scope.name = 'mainController';
	$scope.loggedIn = false;
	$scope.message = 'mainController Everyone come and see how good I look!';
});

app.controller('loginController' , function($scope, $http, $location) {
	$scope.name = 'loginController';
	$scope.login = function() {
			$scope.$parent.$parent.loggedIn = true;
			$location.path('/crud');
	};
});


app.controller('NewsController' , function($scope, $http) {

    $scope.saveEmployee = function() {
        if ($scope.employee) {

            if($scope.employee._id) {
                $http({
                    method: 'POST',
                    url: '/updateEmployee',
                    data: $scope.employee
                }).then(function successCallback(response) {
                    if (response.data === 'SUCCESS')

                        var pos = $scope.employeeList.map(function (rec) {
                            return rec._id === $scope.employee._id;
                        }).indexOf(true);

                        $scope.employeeList[pos] = $scope.employee;
                        delete $scope.employee;
                        $scope.employeeForm.$setSubmitted(true);
                        $scope.employeeForm.$setPristine(true);
                    }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            } else {
                $http({
                    method: 'POST',
                    url: '/addEmployee',
                    data: $scope.employee
                }).then(function successCallback(response) {
                    if (response.data === 'SUCCESS')
                         $scope.employeeList.push($scope.employee);
                         $scope.employee = {};
                        $scope.employeeForm.$setSubmitted(true);
                        $scope.employeeForm.$setPristine(true);
                    }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }
        }
    }

    $scope.editEmployee = function(employee) {
        $scope.employee = employee;
    }

    $scope.deleteEmployee = function(employee) {
        $http({
                    method: 'POST',
                    url: '/deleteEmployee',
                    data: {id: employee._id}
                }).then(function successCallback(response) {
                    if (response.data.message === 'SUCCESS')
                        var pos = $scope.employeeList.map(function (rec) {
                            return rec._id === response.data.id;
                        }).indexOf(true);

                        $scope.employeeList.splice(pos, 1);

                    }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
    }

    $http({
		method: 'GET',
		url: '/getEmployees'
	}).then(function successCallback(response) {
		// this callback will be called asynchronously
		// when the response is available
		$scope.employeeList = response.data;
		}, function errorCallback(response) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
	});
});
