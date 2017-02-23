'use strict';

angular.module('myApp.attendance', [])
.controller('attendanceController', function($scope, $anchorScroll, $location, $http, $window, $q) {
  $anchorScroll();

  let queryString = $location.search();
  let eventId = queryString.eventId;
  findEventInfomation(eventId);

  function findEventInfomation(eventId){
    $http.get('/api/events/'+eventId)
    .then(function(res){
      if(res.data != 'null'){
        if(res.data.status == 'active'){
          $scope.events = res.data;
        }else{
          $scope.err = "Event is already inactive";
        }
      }else{
        $scope.err = "Event ID do not exist!";
      }
    })
    .catch(function(err){
      $scope.err = "Event ID do not exist!";
    })
  }

  function getParticipantList(regCode){
    let deferred = $q.defer();
    $http.get('/api/participants?registrationCode='+regCode)
    .then(function(res){
      deferred.resolve(res.data);
    })
    .catch(function(err){
      deferred.reject(err);
    })
    return deferred.promise;
  }

  function getCodeStatus(regCode){
    let deferred = $q.defer();
    let transUrl = '/api/transactions?registrationCode='+regCode+'&eventID='+eventId;
    $http.get(transUrl)
    .then(function(res){
      deferred.resolve(res.data[0]);
    })
    .catch(function(err){
      deferred.reject(err);
    })
    return deferred.promise;
  }

  function updateUserData(data, user){
    let userUrl = '/api/participants/'+user;
    $http.put(userUrl,data)
    .then(function(res){
      console.log('data change');
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  $scope.findRegistrationCode = function(regCode){
    if(regCode.length == 17){
      getCodeStatus(regCode)
      .then(function(stat){
        if(stat){
          $scope.err = null;
          $scope.code = stat;
          getParticipantList(regCode)
          .then(function(res){
            $scope.participants = res;
          })
          .catch(function(err){
            $scope.err = err.data;
          })
        }else{
          $scope.err = "Invalid registration code.";
        }
      })
      .catch(function(err){
        $scope.err = err.data;
      })
    }else{
      $scope.code = null;
      $scope.participants = null;
    }
  }

  $scope.changeAttendance = function(status, user){
    if(status == true) { status = 1 } else { status = 0 }
    let data = {
      status: status
    }
    updateUserData(data, user);
  }

  $scope.changeClaimed = function(status, user){
    if(status == true) { status = 1 } else { status = 0 }
    let data = {
      claimed: status
    }
    updateUserData(data, user);
  }

});
