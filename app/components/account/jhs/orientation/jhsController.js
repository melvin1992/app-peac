'use strict';

angular.module('myApp.jhsOrientation', [])
.controller('jhsController', function($anchorScroll, $q, $http, $window, $scope, $location) {
  $anchorScroll();

  let userId = '';
  let jhsId = '';

  if($window.sessionStorage["userInfo"] == null){
    $location.path('/');
  }else{
    let userData = JSON.parse($window.sessionStorage["userInfo"]);
    userId = userData._id;
    jhsId = userData.jhsSchool.schoolID;

    if(jhsId != ""){
      getSchoolData(jhsId);
    }else{
      $scope.hideSchool = null;
    }

    getEventList('eventType=JHS Orientation')
    .then(function(res){
      $scope.eventList = res;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  function clearData(){
    $scope.p1 = null;
    $scope.showP1 = false;
    $scope.displayP1 = null;
    $scope.disableP1 = false;
    $scope.p2 = null;
    $scope.showP2 = false;
    $scope.displayP2 = null;
    $scope.disableP2 = false;

    $scope.eventData = null;
  }

  function getSchoolData(id){
    let jhsUrl = '/api/jhs?schoolId='+id;
    $http.get(jhsUrl)
    .then(function(res){
      $scope.schoolInfo = res.data[0];
      $scope.hideSchool = "hide";
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

  function getEventList(query){
    let deferred = $q.defer();
    getActiveYear()
    .then(function(year){
      let eventUrl = '/api/events?eventYear='+year+'&'+query;
      $http.get(eventUrl)
      .then(function(res){
        deferred.resolve(res.data);
      })
      .catch(function(err){
        deferred.reject(err.data);
      })
    })
    .catch(function(err){
      deferred.reject(err.data);
    })
    return deferred.promise;
  }

  function findSchool(id){
    let deferred = $q.defer();
    $http.get('/api/jhs?schoolId='+id)
    .then(function(res){
      deferred.resolve(res.data[0]);
    })
    .catch(function(err){
      deferred.reject(err);
    })
    return deferred.promise;
  }

  function createRegistrationCode(user, events){
    let code = "";
    let ndate = new Date();
    code += user.slice(0,5) + '-';
    code += ndate.valueOf();
    return code;
  }

  function updateAccountInfo(){
    let deferred = $q.defer();

    let data = {
      jhsSchool:{
        schoolID: $scope.schoolInfo.schoolId,
        schoolName: $scope.schoolInfo.name
      }
    };

    $http.put('/api/accounts/'+userId, data)
    .then(function(res){
      deferred.resolve(res);
    })
    .catch(function(err){
      deferred.reject(err);
    })

    return deferred.promise;
  }

  function showExistParticipants(userId, eventId, schoolId){
    let participantUrl = '/api/participants?userID='+userId+'&eventID='+eventId+'&schoolID='+schoolId;
    $http.get(participantUrl)
    .then(function(res){

      angular.forEach(res.data,function(value,key){
        if(value.designation == 'Schoolhead'){
          $scope.p1 = value;
          $scope.showP1 = true;
          $scope.displayP1 = "show";
          $scope.disableP1 = true;
        }else{
          $scope.p2 = value;
          $scope.showP2 = true;
          $scope.displayP2 = "show";
          $scope.disableP2 = true;
        }
      });

    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  $scope.showSearchSchool = function(){
    $scope.hideSchool = null;
  }

  $scope.searchSchool = function(id){
    findSchool(id)
    .then(function(res){
      $scope.schoolInfo = res;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  $scope.findEvent = function(eventName){
    clearData();
    if(eventName){
      let schoolId = $scope.schoolInfo.schoolId;
      getEventList('name='+eventName.name)
      .then(function(res){
        $scope.eventData = res[0];
        showExistParticipants(userId, res[0]._id, schoolId);
      })
      .catch(function(err){
        $scope.err = err.data;
      })
    }else{
      $scope.eventData = null;
    }
  }

  $scope.submitEventInformation = function(){
    let schoolId = $scope.schoolInfo.schoolId;
    let eventId = $scope.eventData._id;
    let eventType = $scope.eventData.eventType;
    let fee = $scope.eventData.eventFee;
    let regCode = createRegistrationCode(userId,eventId);

    let transaction = {
      userID: userId,
      eventID: eventId,
      eventType: eventType,
      schoolID: schoolId,
      registrationCode: regCode,
      participantsCount: participantCount,
      totalAmount: participantCount * fee
    }

    let participants = [];
    if($scope.displayP1 != null){
      $scope.p1.designation = "Schoolhead";
      participants.push($scope.p1);
    }
    if($scope.displayP2 != null){
      $scope.p2.designation = "IT Person";
      participants.push($scope.p2);
    }

    let submitCount = 0;

    updateAccountInfo()
    .then(function(res){

      $http.post('/api/transactions', transaction)
      .then(function(res){
        let transId = res.data._id;

        angular.forEach(participants,function(value,key){
          if(value.registrationCode == null){
            value.eventID = eventId;
            value.eventType = eventType;
            value.registrationCode = regCode;
            value.transactionID = transId;
            value.userID = userId;
            value.schoolID = schoolId;
            $http.post('/api/participants', value)
            .then(function(res){
              console.log(res.data._id);
              //update event limits
            })
            .catch(function(err){
              $scope.err = err.data;
            })
          }
        });
        $scope.success = "Participants has been registered";
        $scope.eventSearch = "";
        clearData();
      })
      .catch(function(err){
        $scope.err = err.data;
      })

    })
    .catch(function(err){
      $scope.err = err.data;
    })

  }

  let participantCount = 0;

  $scope.addP1 = function(show){
    if(show){
      $scope.displayP1 = "show";
      participantCount++;
    }else{
      $scope.displayP1 = null;
      participantCount--;
    }
  }
  $scope.addP2 = function(show){
    if(show){
      $scope.displayP2 = "show";
      participantCount++;
    }else{
      $scope.displayP2 = null;
      participantCount--;
    }
  }

});
