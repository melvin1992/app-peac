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

  // function compareRegionCode(eventRegion, schoolRegion){
  //   let sRegion = schoolRegion.toString();
  //   if(sRegion.length == 8){
  //     sRegion = "0" + sRegion
  //   }
  //
  //   if(eventRegion.indexOf(sRegion) == -1){
  //     $scope.regionWarning = "show";
  //   }else{
  //     $scope.regionWarning = null;
  //   }
  // }

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
      value.limit = 0;
      value.limitExceed = false;
    })
  }

  function clearData(){
    createLearningArea();
    $scope.eventData = null;
    $scope.regionWarning = null;
    $scope.selectedData = [];
  }

  function showSubjectLimits(event){
    angular.forEach(event.jhsLimits, function(val,key){
      angular.forEach($scope.learningArea, function(pval){
        if(pval.code == key){
          pval.limit = val;

          if(val == 0){
            pval.limitExceed = true;
          }else{
            pval.limitExceed = false;
          }

        }
      })
    })
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
      $http.get('/api/events/'+eventName)
      .then(function(res){
        $scope.eventData = res.data;
        showSubjectLimits(res.data);
        // compareRegionCode($scope.eventData.region, $scope.schoolInfo.region);
        showExistParticipants(userId, res.data._id, schoolId);
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
      "learningArea": 'Aral. Panlipunan (Regular: Grade 7 or 8)',
      "code": "AP_regular1",
      "limit": 0
    },
    {
      "learningArea": 'English (Regular: Grade 7 or 8)',
      "code": "English_regular1",
      "limit": 0
    },
    {
      "learningArea": 'Filipino (Regular: Grade 7 or 8)',
      "code": "Filipino_regular1",
      "limit": 0
    },
    {
      "learningArea": 'Math (Regular: Grade 7 or 8)',
      "code": "Math_regular1",
      "limit": 0
    },
    {
      "learningArea": 'Science (Regular: Grade 7 or 8)',
      "code": "Science_regular1",
      "limit": 0
    },
    {
      "learningArea": 'Aral. Panlipunan (Regular: Grade 9 or 10)',
      "code": "AP_regular2",
      "limit": 0
    },
    {
      "learningArea": 'English (Regular: Grade 9 or 10)',
      "code": "English_regular2",
      "limit": 0
    },
    {
      "learningArea": 'Filipino (Regular: Grade 9 or 10)',
      "code": "Filipino_regular2",
      "limit": 0
    },
    {
      "learningArea": 'Math (Regular: Grade 9 or 10)',
      "code": "Math_regular2",
      "limit": 0
    },
    {
      "learningArea": 'Science (Regular: Grade 9 or 10)',
      "code": "Science_regular2",
      "limit": 0
    },
    {
      "learningArea": 'Aral. Panlipunan (Advanced)',
      "code": "AP_advanced",
      "limit": 0
    },
    {
      "learningArea": 'English (Advanced)',
      "code": "English_advanced",
      "limit": 0
    },
    {
      "learningArea": 'Filipino (Advanced)',
      "code": "Filipino_advanced",
      "limit": 0
    },
    {
      "learningArea": 'Math (Advanced)',
      "code": "Math_advanced",
      "limit": 0
    },
    {
      "learningArea": 'Science (Advanced)',
      "code": "Science_advanced",
      "limit": 0
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

    let payload = {
      data: $scope.selectedData,
      transaction: transaction
    };

    updateAccountInfo()
    .then(function(res){
      $window.sessionStorage["userInfo"] = JSON.stringify(res.data);

      $http.post('/api/transactions', payload)
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
