'use strict';

angular.module('myApp.reportEvent', [])
.controller('reportEventController', function($anchorScroll, $scope, $location, $http, $window, $q) {
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

  function orientationReport(data){
    let paid = 0;
    let registered = 0;
    let payload = {};

    $http.get('/api/transactions?eventID='+data.eventId)
    .then(function(trans){

      angular.forEach(trans.data, function(val){
        if(val.status == 'paid'){
          paid += val.participantsCount;
          registered += val.participantsCount;
        }else if(val.status == 'pending' || val.status == 'processing'){
          registered += val.participantsCount;
        }
      })

      payload.name = data.eventName;
      payload.paid = paid;
      payload.registered = registered;
      payload.limits = registered + data.limits;

      $scope.showLoading = null;
      $scope.payload = payload;
    })
    .catch(function(err){
      $scope.err = err.data;
    })

  }

  function insetReport(data){

    let arrCode = [];
    let payload = {};

    $http.get('/api/transactions?eventID='+data.eventId)
    .then(function(trans){

      angular.forEach(trans.data, function(val){
        let regCode = val.registrationCode;
        let status = val.status;

        $http.get('/api/participants?registrationCode='+regCode)
        .then(function(parti){

          angular.forEach(parti.data, function(user){
            if(status != 'declined'){
              payload[user.learningArea] =+ 1;
            }  
          })

        })
        .catch(function(err){
          $scope.err = err.data;
        })

      })

      console.log(payload);

    })
    .catch(function(err){
      $scope.err = err.data;
    })

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

  $scope.getEventReport = function(event){
    $scope.showLoading = 'show';
    let data = {};

    getEventDetails(event)
    .then(function(event){
      data.eventName = event.name;
      data.eventId = event._id;
      data.eventType = event.eventType;
      data.limits = event.limits;

      if(event.eventType == 'JHS Orientation' || event.eventType == 'SHS Orientation'){
        orientationReport(data);
      }else{
        insetReport(data);
      }

    })
    .catch(function(err){
      $scope.err = err.data;
    })



  }


});
