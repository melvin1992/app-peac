'use strict';

angular.module('myApp.reportEvent', [])
.controller('reportEventController', function($anchorScroll, $scope, $location, $http, $window, $q) {
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

    let JHSlearningArea = [
      {
        "learningArea": 'Aral. Panlipunan (Regular: Grade 7 or 8)',
        "code": "AP_regular1",
        "paid": 0,
        "registered": 0,
        "limits": 0
      },
      {
        "learningArea": 'English (Regular: Grade 7 or 8)',
        "code": "English_regular1",
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Filipino (Regular: Grade 7 or 8)',
        "code": "Filipino_regular1",
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Math (Regular: Grade 7 or 8)',
        "code": "Math_regular1",
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Science (Regular: Grade 7 or 8)',
        "code": "Science_regular1",
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Aral. Panlipunan (Regular: Grade 9 or 10)',
        "code": "AP_regular2",
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'English (Regular: Grade 9 or 10)',
        "code": "English_regular2",
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Filipino (Regular: Grade 9 or 10)',
        "code": "Filipino_regular2",
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Math (Regular: Grade 9 or 10)',
        "code": "Math_regular2",
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Science (Regular: Grade 9 or 10)',
        "code": "Science_regular2",
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Aral. Panlipunan (Advanced)',
        "code": "AP_advanced",
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'English (Advanced)',
        "code": "English_advanced",
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Filipino (Advanced)',
        "code": "Filipino_advanced",
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Math (Advanced)',
        "code": "Math_advanced",
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Science (Advanced)',
        "code": "Science_advanced",
        "paid": 0,
        "registered": 0,
        "limit": 0
      }
    ];

    let SHSlearningArea = [
      {
        "learningArea": 'English',
        "code": 'English',
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Filipino',
        "code": 'Filipino',
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Earth and Life Science',
        "code": 'EarthLifeScience',
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Physical Science',
        "code": 'PhysicalScience',
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Humanities',
        "code": 'Humanities',
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'General Math',
        "code": 'GeneralMath',
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Statistics and Probability',
        "code": 'StatisticsProbability',
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Media and Information Literacy',
        "code": 'MediaInformationLiteracy',
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Understanding Culture, Society, and Politics',
        "code": 'CutureSocietyPolitics',
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Personal Development',
        "code": 'PersonalDevelopment',
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Introduction to Philosophy of the Human Person',
        "code": 'Philosophy',
        "paid": 0,
        "registered": 0,
        "limit": 0
      },
      {
        "learningArea": 'Physical Education and Health',
        "code": 'PhysicalEducation',
        "paid": 0,
        "registered": 0,
        "limit": 0
      }
    ];


    let learningArea = [];

    if(data.eventType == 'JHS INSET'){
      learningArea = JHSlearningArea;
    }else{
      learningArea = SHSlearningArea;
    }

    $http.get('/api/transactions?eventID='+data.eventId)
    .then(function(trans){

      angular.forEach(trans.data, function(val){
        let regCode = val.registrationCode;
        let status = val.status;

        $http.get('/api/participants?registrationCode='+regCode)
        .then(function(parti){

          angular.forEach(parti.data, function(user){

            if(status == 'paid'){
              angular.forEach(learningArea, function(jhs){
                if(user.learningArea == jhs.learningArea){
                  jhs.paid += 1;
                  jhs.registered += 1;
                }
              })

            }else if(status == 'pending' || status =='processing'){

              angular.forEach(learningArea, function(jhs){
                if(user.learningArea == jhs.learningArea){
                  jhs.registered += 1;
                }
              })

            }

          })

        })
        .catch(function(err){
          $scope.err = err.data;
        })

      })

      $scope.showLoading = null;
      $scope.payload = learningArea;

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
