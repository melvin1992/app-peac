'use strict';

angular.module('myApp.deductHours', [])
.controller('deductHoursController', function($q, $anchorScroll, $window, $location, $http, $scope) {
  $anchorScroll();

  if($window.sessionStorage["adminInfo"] == null){
    $location.path('loginasadmin');
  }


  $scope.searchParticpant = function(id){
    $http.get('/api/participants/'+id)
    .then(function(user){
      $scope.user = user.data;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  $scope.saveParticipant = function(user){
    $scope.showLoading = 'show';
    $http.put('/api/participants/'+user._id, user)
    .then(function(res){
      $scope.success = 'User has been updated!';
      $scope.user = null;
      $scope.showLoading = null;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }


});
