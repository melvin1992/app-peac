'use strict';

angular.module('myApp.participantReport', ['ngSanitize','ngCsv'])
.controller('participantReportController', function($anchorScroll, $scope, $location, $http, $window, $q) {
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

  function getParticipants(data){
    $http.get('/api/participants?registrationCode='+data.registrationCode)
    .then(function(participants){

      angular.forEach(participants.data, function(val){
        let users = {}

        let subject = '';
        if(val.learningArea){
          subject = val.learningArea;
        }

        users.schoolID = data.schoolID;
        users.registrationCode = val.registrationCode;
        users.eventName = data.eventName;
        users.schoolName = data.schoolName;
        users.lastName = val.lastName;
        users.middleName = val.middleName;
        users.firstName = val.firstName;
        users.learningArea = subject;
        users.status = data.status;
        users.claimed = val.claimed;

        $scope.participantReportCsv.push(users);
      })

    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  $scope.csvHeader = ['schoolID','registrationCode','eventName','schoolName','lastName','middleName','firstName','learningArea','status','claimed'];

  $scope.getParticipantReport = function(id, status){
    $scope.participantReportCsv = [];
    $scope.showLoading = "show";

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
