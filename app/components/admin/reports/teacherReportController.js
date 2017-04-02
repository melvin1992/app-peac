'use strict';

angular.module('myApp.teacherReport', ['ngSanitize','ngCsv'])
.controller('teacherReportController', function($anchorScroll, $scope, $location, $http, $window, $q) {
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

  let shsSubjects = [
    'English',
    'Filipino',
    'Earth and Life Science',
    'Physical Science',
    'Humanities',
    'General Math',
    'Statistics and Probability',
    'Media and Information Literacy',
    'Understanding Culture, Society, and Politics',
    'Personal Development',
    'Introduction to Philosophy of the Human Person',
    'Physical Education and Health'
  ];

  let jhsSubjects = [
    'Aral. Panlipunan (Regular: Grade 7 or 8)',
    'English (Regular: Grade 7 or 8)',
    'Filipino (Regular: Grade 7 or 8)',
    'Math (Regular: Grade 7 or 8)',
    'Science (Regular: Grade 7 or 8)',
    'Aral. Panlipunan (Regular: Grade 9 or 10)',
    'English (Regular: Grade 9 or 10)',
    'Filipino (Regular: Grade 9 or 10)',
    'Math (Regular: Grade 9 or 10)',
    'Science (Regular: Grade 9 or 10)',
    'Aral. Panlipunan (Advanced)',
    'English (Advanced)',
    'Filipino (Advanced)',
    'Math (Advanced)',
    'Science (Advanced)'
  ];

  $scope.findEventPerType = function(type){
    $http.get('/api/events?eventType='+type+'&eventYear='+activeYear)
    .then(function(res){
      $scope.eventList = res.data;
      if(type == 'SHS INSET'){
        $scope.subjectList = shsSubjects;
      }else{
        $scope.subjectList = jhsSubjects;
      }

    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  $scope.csvHeader = ['schoolId','schoolName','participantId','eventName','lastName','middleName','firstName','learningArea','status','registrationCode','claimed','presentHours','licenseStatus','licenseNumber','licenseExpiry','certificationDate'];

  function getParticipants(data){
    let url = '/api/participants?registrationCode='+data.registrationCode;

    if(data.subject != ''){
      url += '&learningArea='+data.subject;
    }

    $http.get(url)
    .then(function(participants){
      angular.forEach(participants.data, function(val){
        let users = {}
        users.schoolId = data.schoolID;
        users.schoolName = data.schoolName;
        users.participantId = val._id;
        users.eventName = data.eventName;
        users.lastName = val.lastName;
        users.middleName = val.middleName;
        users.firstName = val.firstName;
        users.learningArea = val.learningArea;
        users.status = data.status;
        users.registrationCode = data.registrationCode;
        users.claimed = val.claimed;
        users.presentHours = val.presentHours;
        users.licenseStatus = val.licenseStatus;
        users.licenseNumber = val.licenseNumber;
        users.licenseExpiry = val.licenseExpiry;
        users.certificationDate = val.certificateDate;

        $scope.participantReportCsv.push(users);
      })
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  $scope.getParticipantReport = function(id, status, subject){
    $scope.participantReportCsv = [];
    $scope.showLoading = "show";
    if(!subject){
      subject = '';
    }

    $http.get('/api/events/'+id)
    .then(function(res){

      let events = res.data;
      let url = '';
      if(status == 'all'){
        url ='/api/transactions?eventID='+id;
      }else{
        url = '/api/transactions?eventID='+id+'&status='+status;
      }

      $http.get(url)
      .then(function(trans){
        angular.forEach(trans.data, function(val){
          let data = {};
          data.schoolID = val.schoolID.trim();
          data.registrationCode = val.registrationCode;
          data.eventName = events.name;
          data.status = val.status;
          data.subject = subject;

          if(events.eventType == 'JHS INSET' || events.eventType == 'JHS Orientation'){
            $http.get('/api/jhs?schoolId='+data.schoolID)
            .then(function(school){
              let sDetail = school.data[0];
              data.schoolName = sDetail.name;
              getParticipants(data);
            })
            .catch(function(err){
              $scope.err = err.data;
            })
          }else{
            $http.get('/api/shs?schoolId='+data.schoolID)
            .then(function(school){
              let sDetail = school.data[0];
              data.schoolName = sDetail.name;
              getParticipants(data);
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
