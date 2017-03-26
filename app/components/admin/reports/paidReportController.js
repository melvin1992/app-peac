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

  $scope.csvHeader = ['schoolID','amount','amountInWords','eventName','eventDate','eventVenue','schoolName']


  $scope.getPaidReport = function(id){
    $scope.showLoading = "show";

    let payload = [];

    $http.get('/api/events/'+id)
    .then(function(res){

      let events = res.data;

      $http.get('/api/transactions?eventID='+id+'&status=paid')
      .then(function(trans){

        angular.forEach(trans.data, function(val){
          let data = {};
          data.schoolID = val.schoolID;
          data.amount = val.totalAmount;
          data.amountInWords = val.amountInWords;
          data.eventName = events.name;
          data.eventDate = events.eventDate;
          data.eventVenue = events.venue;

          if(events.eventType == 'JHS INSET' || events.eventType == 'JHS Orientation'){
            $http.get('/api/jhs?schoolId='+data.schoolID)
            .then(function(school){
              let sDetail = school.data[0];
              data.schoolName = sDetail.name;
            })
            .catch(function(err){
              $scope.err = err.data;
            })
          }else{
            $http.get('/api/shs?schoolId='+data.schoolID)
            .then(function(school){
              let sDetail = school.data[0];
              data.schoolName = sDetail.name;
            })
            .catch(function(err){
              $scope.err = err.data;
            })
          }
          payload.push(data);
        })
         $scope.paidReportCsv = payload;
         $scope.showLoading = null;
      })
      .catch(function(err){
        $scope.err = err.data;
      })

    })
    .catch(function(err){
      $scope.err = err.data;
    })

  }


});
