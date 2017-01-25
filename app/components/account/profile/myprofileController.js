'use strict';

angular.module('myApp.myprofile', [])
.controller('myprofileController', function($anchorScroll, $scope, $window, $location, $http) {
  $anchorScroll();

  let userId = "";

  if($window.sessionStorage["userInfo"] == null){
    $location.path('/');
  }else{
    let userData = JSON.parse($window.sessionStorage["userInfo"]);
    userId = userData._id;

    $http.get('/api/accounts/'+userId)
    .then(function(res){
      delete(res.data.password);
      $scope.user = res.data;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  $scope.saveUser = function(user){

    $http.put('/api/accounts/'+userId, user)
    .then(function(res){
      $scope.err = null;
      $scope.success = "Information has been updated";
    })
    .catch(function(err){
      $scope.err = err.data;
    })

  };

  $scope.changePassword = function(pass){

    $http.get('/api/accounts/'+userId)
    .then(function(res){

      let oldpass = res.data.password;

      if(oldpass != pass.oldpass){
        $scope.err = "Old password didn't match.";
      }else if(pass.newpass != pass.confirmpass){
        $scope.err = "Password didn't match.";
      }else{
        let newpass = {
          password: pass.newpass
        }

        $http.put('/api/accounts/'+userId, newpass)
        .then(function(res){
          $scope.success = "Password changed!";
        })
        .catch(function(err){
          $scope.err = err.data;
        })
      }

    })
    .catch(function(err){
      $scope.err = err.data;
    })

  }

});
