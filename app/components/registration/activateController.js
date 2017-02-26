'use strict';

angular.module('myApp.activateAccount', [])
.controller('activateController', function($scope, $anchorScroll, $http, $location) {
  $anchorScroll();

  let code = $location.search().code;
  console.log(code);

  let payload = {
    code: code
  }

  $http.post('/api/accounts/accountVerification', payload)
  .then(function(res){

    if(res.data){
      $scope.user = "activated";
    }
  })

})
