'use strict';

angular.module('myApp.paidReport', ['ngSanitize','ngCsv'])
.controller('paidReportController', function($anchorScroll, $scope, $location, $http, $window, $q) {
  $anchorScroll();

  let activeYear = "";

  // if($window.sessionStorage["adminInfo"] == null){
  //   $location.path('admin');
  // }else{
    getActiveYear()
    .then(function(res){
      activeYear = res;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  // }

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

  $scope.csvHeader = ['schoolID','amount','amountInWords','eventName','eventDate','eventVenue','schoolName','email']

  function createCSV(data){

    $http.get('/api/accounts/'+data.userID)
    .then(function(users){
      let user = users.data;
      data.email = user.email;
      delete data.userID;
      $scope.paidReportCsv.push(data);
    })
    .catch(function(err){
      $scope.err = err.data;
    })

  }

  $scope.getPaidReport = function(id){
    $scope.showLoading = "show";

    $scope.paidReportCsv = [];

    $http.get('/api/events/'+id)
    .then(function(res){

      let events = res.data;

      $http.get('/api/transactions?eventID='+id+'&status=paid')
      .then(function(trans){

        if(trans.data.length == 0){
          $scope.noData = "show";
          $scope.showTable = null;
        }else{
          $scope.noData = null;
          $scope.showTable = "show";
        }

        angular.forEach(trans.data, function(val){
          let data = {};
          data.schoolID = val.schoolID.trim();
          data.amount = val.totalAmount;
          data.amountInWords = val.amountInWords;
          data.eventName = events.name;
          data.eventDate = events.eventDate;
          data.eventVenue = events.venue;
          data.userID = val.userID;

          if(events.eventType == 'JHS INSET' || events.eventType == 'JHS Orientation'){
            $http.get('/api/jhs?schoolId='+data.schoolID)
            .then(function(school){
              let sDetail = school.data[0];
              data.schoolName = sDetail.name;
              createCSV(data);
            })
            .catch(function(err){
              $scope.err = err.data;
            })
          }else{
            $http.get('/api/shs?schoolId='+data.schoolID)
            .then(function(school){
              let sDetail = school.data[0];
              data.schoolName = sDetail.name;
              createCSV(data);
            })
            .catch(function(err){
              $scope.err = err.data;
            })
          }
        })
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
