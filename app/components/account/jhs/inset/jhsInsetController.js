'use strict';

angular.module('myApp.jhsInset', [])
.controller('jhsInsetController', function($anchorScroll, $q, $scope, $window, $http, $location) {
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
    }

    getEventList('eventType=JHS INSET')
    .then(function(res){
      $scope.eventList = res;
    })
    .catch(function(err){
      $scope.err = err.data;
    })

    createLearningArea();
  }

  function getSchoolData(id){
    let jhsUrl = '/api/jhs?schoolId='+id;
    $http.get(jhsUrl)
    .then(function(res){
      $scope.schoolInfo = res.data[0];
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  function searchSchoolData(id){
    let jhsUrl = '/api/accounts?jhsSchool.schoolID='+id;
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

  function createRegistrationCode(user, events){
    let code = "";
    let ndate = new Date();
    let dval = ndate.valueOf().toString();
    code += user.slice(0,5) + '-';
    code += events.slice(0,5) + '-';
    code += dval.slice(-5);
    return code;
  }

  function showExistParticipants(userId, eventId, schoolId){
    let participantUrl = '/api/participants?userID='+userId+'&eventID='+eventId+'&schoolID='+schoolId;
    $http.get(participantUrl)
    .then(function(res){

      angular.forEach(res.data, function(pval,pkey){
        angular.forEach($scope.learningArea, function(val,key){
          if(pval.learningArea == val.learningArea){
            val.title = pval.title;
            val.firstName = pval.firstName;
            val.middleName = pval.middleName;
            val.lastName = pval.lastName;
            val.suffix = pval.suffix;
            val.gender = pval.gender;
            val.birthdate = pval.birthdate;
            val.email = pval.email;
            val.contactNo = pval.contactNo;
            val.teachingYears = pval.teachingYears;
            val.licenseStatus = pval.licenseStatus;
            val.licenseNumber = pval.licenseNumber;
            val.licenseExpiry = pval.licenseExpiry;
            val.certificateDate = pval.certificateDate;
            val.show = true;
            val.display = "show";
            val.disabled = true;
            val.registrationCode = pval.registrationCode;
          }
        })
      })

    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  function compareRegionCode(eventRegion, schoolRegion){
    let sRegion = schoolRegion.toString();
    if(sRegion.length == 8){
      sRegion = "0" + sRegion
    }

    if(eventRegion.indexOf(sRegion) == -1){
      $scope.regionWarning = "show";
    }else{
      $scope.regionWarning = null;
    }
  }

  function createLearningArea(){
    angular.forEach($scope.learningArea,function(value,key){
      value.title = '';
      value.firstName = '';
      value.middleName = '';
      value.lastName = '';
      value.suffix = '';
      value.gender = '';
      value.birthdate = '';
      value.email = '';
      value.contactNo = '';
      value.teachingYears = '';
      value.licenseStatus = '';
      value.licenseNumber = '';
      value.licenseExpiry = '';
      value.certificateDate = '';
      value.show = null;
      value.display = null;
      value.disabled = null;
      value.registrationCode = null;
    })
  }

  function clearData(){
    createLearningArea();
    $scope.eventData = null;
    $scope.regionWarning = null;
  }

  $scope.searchSchool = function(id){
    $scope.eventSearch = "";
    clearData();
    searchSchoolData(id);
  }

  $scope.reset = function(){
    clearData();
  }

  $scope.findEvent = function(eventName){
    clearData();
    $scope.success = null;
    if(eventName){
      let schoolId = $scope.schoolInfo.schoolId;
      getEventList('name='+eventName.name)
      .then(function(res){
        let maxLimit = res[0].limits;
        $scope.maxLimit = maxLimit;
        $scope.eventData = res[0];
        compareRegionCode($scope.eventData.region, $scope.schoolInfo.region);
        showExistParticipants(userId, res[0]._id, schoolId);
      })
      .catch(function(err){
        $scope.err = err.data;
      })
    }else{
      $scope.eventData = null;
    }
  }

  $scope.learningArea = [
    {
      "learningArea": 'Aral. Panlipunan (Regular: Grade 7 or 8)'
    },
    {
      "learningArea": 'English (Regular: Grade 7 or 8)'
    },
    {
      "learningArea": 'Filipino (Regular: Grade 7 or 8)'
    },
    {
      "learningArea": 'Math (Regular: Grade 7 or 8)'
    },
    {
      "learningArea": 'Science (Regular: Grade 7 or 8)'
    },
    {
      "learningArea": 'Aral. Panlipunan (Regular: Grade 9 or 10)'
    },
    {
      "learningArea": 'English (Regular: Grade 9 or 10)'
    },
    {
      "learningArea": 'Filipino (Regular: Grade 9 or 10)'
    },
    {
      "learningArea": 'Math (Regular: Grade 9 or 10)'
    },
    {
      "learningArea": 'Science (Regular: Grade 9 or 10)'
    },
    {
      "learningArea": 'Aral. Panlipunan (Advanced)'
    },
    {
      "learningArea": 'English (Advanced)'
    },
    {
      "learningArea": 'Filipino (Advanced)'
    },
    {
      "learningArea": 'Math (Advanced)'
    },
    {
      "learningArea": 'Science (Advanced)'
    }

  ];

  $scope.selectedData = [];

  $scope.showPanel = function(status, area){
    angular.forEach($scope.learningArea,function(value,key){
      if(value.learningArea == area){
        if(!status){
          value.display = "show";
          $scope.selectedData.push(value);
        }else{
          value.display = null;
          if($scope.selectedData.indexOf(value.name) == -1){
            let index = $scope.selectedData.indexOf(value);
            $scope.selectedData.splice(index, 1);
          }
        }
      }
    })
  }

  $scope.submitEventInformation = function(){
    let schoolId = $scope.schoolInfo.schoolId;
    let eventId = $scope.eventData._id;
    let eventType = $scope.eventData.eventType;
    let fee = $scope.eventData.eventFee;
    let eventHours = $scope.eventData.hours;
    let regCode = createRegistrationCode(userId,eventId);
    let participantCount = $scope.selectedData.length;

    let transaction = {
      userID: userId,
      eventID: eventId,
      eventType: eventType,
      schoolID: schoolId,
      registrationCode: regCode,
      participantsCount: participantCount,
      totalAmount: participantCount * fee
    }

    updateAccountInfo()
    .then(function(res){

      $http.post('/api/transactions', transaction)
      .then(function(res){
        let transId = res.data._id;
        angular.forEach($scope.selectedData, function(value,key){
          if(value.registrationCode == null){
            value.eventID = eventId;
            value.eventType = eventType;
            value.registrationCode = regCode;
            value.transactionID = transId;
            value.userID = userId;
            value.schoolID = schoolId;
            value.presentHours = eventHours;
            delete(value.show);
            delete(value.display);
            delete(value.disabled);
            delete(value.$$hashKey);
            $http.post('/api/participants', value)
            .then(function(res){
              console.log(res.data._id);
              if(key == $scope.selectedData.length -1){
                clearData();
              }
            })
            .catch(function(err){
              $scope.err = err.data;
            })
          }
        });
        $anchorScroll();
        $scope.success = "Participants has been registered";
        $scope.eventSearch = "";
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
