'use strict';

angular.module('myApp.adminLogin', [])
.controller('adminLoginController', function($anchorScroll, $scope, $location, $http, $window) {
  $anchorScroll();

  if($window.sessionStorage["adminInfo"] != null){
    $location.path('admin');
  }

  $scope.loginAdmin = function(admin){
    if(admin){
      let data ={
        username: admin.username,
        password: admin.password
      }
      $http.post('/api/login/admin', data)
      .then(function(res){
        delete(res.data.password);
        $window.sessionStorage["adminInfo"] = JSON.stringify(res.data);
        $location.path('admin');
      })
      .catch(function(err){
        $scope.admin = null;
        $scope.err = err.data;
      });
    }else{
      $scope.err = "Incorrect Login.";
    }
  }

});
