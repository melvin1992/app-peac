'use strict';

angular.module('myApp.shsInset', [])
.controller('shsInsetController', function($anchorScroll, $q, $window, $location, $http, $scope) {
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

    getEventList('eventType=SHS INSET')
    .then(function(res){
      $scope.eventList = res;
    })
    .catch(function(err){
      $scope.err = err.data;
    })

    createLearningArea();
  }

  function getSchoolData(id){
    let shsUrl = '/api/shs?schoolId='+id;
    $http.get(shsUrl)
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

  function createRegistrationCode(user, events){
    let code = "";
    let ndate = new Date();
    let dval = ndate.valueOf().toString();
    code += user.slice(0,5) + '-';
    code += events.slice(0,5) + '-';
    code += dval.slice(-5);
    return code;
  }

  function clearData(){
    createLearningArea();
    $scope.eventData = null;
    $scope.regionWarning = null;
    $scope.selectedData = [];
  }

  // function compareRegionCode(eventRegion, schoolRegion){
  //   let sRegion = schoolRegion.toString();
  //   if(sRegion.length == 1){
  //     sRegion = "0" + sRegion + "0000000";
  //   }else{
  //     schoolRegion = schoolRegion + "0000000";
  //   }
  //
  //   if(eventRegion.indexOf(sRegion) == -1){
  //     $scope.regionWarning = "show";
  //   }else{
  //     $scope.regionWarning = null;
  //   }
  // }

  function showExistParticipants(userId, event, schoolId){
    let participantUrl = '/api/participants?userID='+userId+'&eventID='+event._id+'&schoolID='+schoolId;
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

  function showSubjectLimits(event){
    angular.forEach(event.shsLimits, function(val,key){
      angular.forEach($scope.learningArea, function(pval){
        if(pval.code == key){
          pval.limit = val;

          if(val <= 0){
            pval.limitExceed = true;
          }else{
            pval.limitExceed = false;
          }

        }
      })
    })
  }

  $scope.learningArea = [
    {
      "learningArea": 'English',
      "code": 'English',
      "limit": 0
    },
    {
      "learningArea": 'Filipino',
      "code": 'Filipino',
      "limit": 0
    },
    {
      "learningArea": 'Earth and Life Science',
      "code": 'EarthLifeScience',
      "limit": 0
    },
    {
      "learningArea": 'Physical Science',
      "code": 'PhysicalScience',
      "limit": 0
    },
    {
      "learningArea": 'Humanities',
      "code": 'Humanities',
      "limit": 0
    },
    {
      "learningArea": 'General Math',
      "code": 'GeneralMath',
      "limit": 0
    },
    {
      "learningArea": 'Statistics and Probability',
      "code": 'StatisticsProbability',
      "limit": 0
    },
    {
      "learningArea": 'Media and Information Literacy',
      "code": 'MediaInformationLiteracy',
      "limit": 0
    },
    {
      "learningArea": 'Understanding Culture, Society, and Politics',
      "code": 'CutureSocietyPolitics',
      "limit": 0
    },
    {
      "learningArea": 'Personal Development',
      "code": 'PersonalDevelopment',
      "limit": 0
    },
    {
      "learningArea": 'Introduction to Philosophy of the Human Person',
      "code": 'Philosophy',
      "limit": 0
    },
    {
      "learningArea": 'Physical Education and Health',
      "code": 'PhysicalEducation',
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
        showExistParticipants(userId, res.data, schoolId);
      })
      .catch(function(err){
        $scope.err = err.data;
      })
    }else{
      $scope.eventData = null;
    }
  }

  $scope.reset = function(){
    clearData();
  }

  $scope.searchSchool = function(id){
    $scope.eventSearch = "";
    clearData();
    searchSchoolData(id);
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
    };

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

  $scope.verifyData = function(){
    let errMsg = [];

    angular.forEach($scope.selectedData, function(val){
      if(val.firstName == ''){
        errMsg.push('Learning area: ' + val.learningArea + ': Missing first name');
      }else if(val.lastName == ''){
        errMsg.push('Learning area: ' + val.learningArea + ': Missing last name');
      }else if(val.contactNo == ''){
        errMsg.push('Learning area: ' + val.learningArea + ': Missing contact number');
      }else if(val.email == ''){
        errMsg.push('Learning area: ' + val.learningArea + ': Missing email');
      }else if(val.teachingYears == ''){
        errMsg.push('Learning area: ' + val.learningArea + ': Missing teaching years');
      }else if(val.licenseStatus == ''){
        errMsg.push('Learning area: ' + val.learningArea + ': Missing license status');
      }
    })

    if(errMsg.length != 0){
      $anchorScroll();
      $scope.err = errMsg;
    }else{
      angular.element(document.querySelector('#openModal')).modal('show');
      $scope.err = null;
    }
  }


});
