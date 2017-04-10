'use strict';

angular.module('myApp.login', [])
.controller('loginController', function($scope, $anchorScroll, $location, $http, $window) {
  $anchorScroll();

  if($window.sessionStorage["userInfo"] != null){
    $location.path('profile');
  }

  $scope.registerRedirect = function(){
    $location.path('register');
  }

  $scope.loginUser = function(user){
    if(user){
      let data = {
        username: user.username,
        password: user.password
      }

      $http.post('/api/login', data)
      .then(function(res){
        delete(res.data.password);
        $window.sessionStorage["userInfo"] = JSON.stringify(res.data);
        $location.path('myregistration');
      })
      .catch(function(err){
        $scope.user = null;
        $scope.err = err.data;
      });
    }else{
      $scope.err = "Incorrect Login.";
    }
  }

  $scope.forgotpassword = function(data){
    $scope.showLoading = true;
    $scope.forgotErr = null;
    $scope.forgotSuccess = null;
    if(data.username != "" && data.email != ""){
      $http.post('/api/login/forgotpass', data)
      .then(function(res){
        $scope.forgotSuccess = "Your password has been sent to your email.";
        $scope.showLoading = false;
      })
      .catch(function(err){
        $scope.forgotErr = err.data;
        $scope.showLoading = false;
      })
    }else{
      $scope.forgotErr = "Please fillup all the fields";
    }
  }


});
