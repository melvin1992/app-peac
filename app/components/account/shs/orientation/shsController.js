'use strict';

angular.module('myApp.shsOrientation', [])
.controller('shsController', function($anchorScroll, $scope, $window, $location, $http, $q) {
  $anchorScroll();

  let userId = '';
  let shsId = '';

  if($window.sessionStorage["userInfo"] == null){
    $location.path('/');
  }else{
    let userData = JSON.parse($window.sessionStorage["userInfo"]);
    userId = userData._id;
    shsId = userData.shsSchool.schoolID;

    if(shsId != ""){
      getSchoolData(shsId);
    }

    getEventList('eventType=SHS Orientation')
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

    $scope.disableSubmit == false;
  }

  function compareRegionCode(eventRegion, schoolRegion){
    let sRegion = schoolRegion.toString();
    if(sRegion.length == 1){
      sRegion = "0" + sRegion + "0000000";
    }else{
      schoolRegion = schoolRegion + "0000000";
    }

    if(eventRegion.indexOf(sRegion) == -1){
      $scope.regionWarning = "show";
    }else{
      $scope.regionWarning = null;
    }
  }

  function getSchoolData(id){
    let jhsUrl = '/api/shs?schoolId='+id;
    $http.get(jhsUrl)
    .then(function(res){
      if(res.data[0]){
        $scope.schoolInfo = res.data[0];
      }else{
        $scope.err = "School doesn't exist.";
      }
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
    let jhsUrl = '/api/accounts?shsSchool.schoolID='+id;
    $http.get(jhsUrl)
    .then(function(res){
      if(!res.data[0]){
        getSchoolData(id);
        $scope.err = null;
      }else{
        $scope.err = "School already assigned to another account";
      }
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  function createRegistrationCode(user, events){
    let code = "";
    let ndate = new Date();
    let dval = ndate.valueOf().toString();
    code += user.slice(0,5) + '-';
    code += events.slice(0,5) + '-';
    code += dval.slice(-5);
    return code;
  }

  function updateAccountInfo(){
    let deferred = $q.defer();

    let data = {
      shsSchool:{
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

  $scope.searchSchool = function(id){
    $scope.eventSearch = "";
    clearData();
    findSchool(id);
  }

  $scope.findEvent = function(eventName){
    clearData();
    if(eventName){
      let schoolId = $scope.schoolInfo.schoolId;
      $http.get('/api/events/'+eventName)
      .then(function(res){
        let maxLimit = res.data.limits;
        $scope.maxLimit = maxLimit;
        $scope.eventData = res.data;
        compareRegionCode($scope.eventData.region, $scope.schoolInfo.region);
        showExistParticipants(userId, res.data._id, schoolId);
      })
      .catch(function(err){
        $scope.err = err.data;
      })
    }else{
      $scope.eventData = null;
    }
  }

  $scope.submitEventInformation = function(){
    $scope.disableSubmit == true;

    let schoolId = $scope.schoolInfo.schoolId;
    let eventId = $scope.eventData._id;
    let eventType = $scope.eventData.eventType;
    let fee = $scope.eventData.eventFee;
    let eventHours = $scope.eventData.hours;
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

    console.log(transaction);

    let participants = [];
    if($scope.displayP1 != null){
      $scope.p1.designation = "Schoolhead";
      participants.push($scope.p1);
    }
    if($scope.displayP2 != null){
      $scope.p2.designation = "IT Person";
      participants.push($scope.p2);
    }

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
            value.presentHours = eventHours;
            $http.post('/api/participants', value)
            .then(function(res){
              console.log(res.data._id);
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
