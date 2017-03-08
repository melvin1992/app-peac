'use strict';

angular.module('myApp.register', [])
.controller('registerController', function($scope, $anchorScroll, $http) {
  $anchorScroll();

  $scope.createUser = function(account) {
    if(account && account.username && account.password && account.confirmpass && account.firstName
      && account.middleName && account.lastName && account.email && account.confirmemail){

      if(account.password != account.confirmpass){
        return $scope.err = "Password didn't match.";
      }else if(account.email != account.confirmemail){
        return $scope.err = "Email didn't match.";
      }else{

        account.email = account.email.replace(/ /g, '');
        $http.post('/api/accounts', account)
        .then(function(res){
          $scope.err = null;
          $scope.success = "success";
          $scope.account = "";
          return
        })
        .catch(function(err){
          return $scope.err = err.data;
        });

      }
    }else{
      return $scope.err = "Fill up required fields"
    }

  }


});
