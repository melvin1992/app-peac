'use strict';

angular.module('myApp.paidReport', ['ngSanitize','ngCsv'])
.controller('paidReportController', function($anchorScroll, $scope, $location, $http, $window, $q) {
  $anchorScroll();

  let activeYear = "";

  if($window.sessionStorage["adminInfo"] == null){
    $location.path('admin');
  }else{
    getActiveYear()
    .then(function(res){
      activeYear = res;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  function getActiveYear(){
    let deferred = $q.defer();
    $http.get('/api/admin/settings')
    .then(function(res){
      deferred.resolve(res.data[0].activeYear);
    })
    .catch(function(err){
      deferred.reject(err);
    })
    return deferred.promise;
  }

  function getEventDetails(id){
    let deferred = $q.defer();
    $http.get('/api/events/'+id)
    .then(function(res){
      deferred.resolve(res.data);
    })
    .catch(function(err){
      deferred.reject(err);
    })
    return deferred.promise
  }

  $scope.findEventPerType = function(type){
    $http.get('/api/events?eventType='+type+'&eventYear='+activeYear)
    .then(function(res){
      $scope.eventList = res.data;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }


  $scope.getPaidReport = function(id){
    $http.get('/api/report/paidtransactions?eventId='+id)
    .then(function(res){
      $scope.paidReportCsv = res.data;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }


});
