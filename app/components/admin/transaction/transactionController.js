'use strict';

angular.module('myApp.adminTransaction', [])
.filter('offset',function(){
  return function(input, start) {
    start = parseInt(start, 10);
    if(input){
      return input.slice(start);
    }
  };
})
.controller('transactionController', function($q, $anchorScroll, $window, $location, $http, $scope) {
  $anchorScroll();

  if($window.sessionStorage["adminInfo"] == null){
    $location.path('loginasadmin');
  }
  // else{
  //   showTransactionList('');
  // }

  function showTransactionList(query){
    getTransactionList(query)
    .then(function(res){
      $scope.transactions = res;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  function getTransactionList(query){
    let deferred = $q.defer();
    $http.get('/api/transactions?'+query)
    .then(function(res){
      deferred.resolve(res.data);
    })
    .catch(function(err){
      deferred.reject(err);
    })
    return deferred.promise;
  }

  function addParticipants(params){
    $http.post('/api/events/addparticipants', params)
    .then(function(res){
      console.log('Limits updated');
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  $scope.showParticipants = function(data){
    let transId = data._id;
    $http.get('/api/participants?transactionID='+transId)
    .then(function(res){
      $scope.users = res.data;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  $scope.showNotif = function(trans){
    $scope.trans_id = trans;
  }

  let learningArea = [
    {
      "learningArea": 'Aral. Panlipunan (Regular: Grade 7 or 8)',
      "code": "AP_regular1"
    },
    {
      "learningArea": 'English (Regular: Grade 7 or 8)',
      "code": "English_regular1"
    },
    {
      "learningArea": 'Filipino (Regular: Grade 7 or 8)',
      "code": "Filipino_regular1"
    },
    {
      "learningArea": 'Math (Regular: Grade 7 or 8)',
      "code": "Math_regular1"
    },
    {
      "learningArea": 'Science (Regular: Grade 7 or 8)',
      "code": "Science_regular1"
    },
    {
      "learningArea": 'Aral. Panlipunan (Regular: Grade 9 or 10)',
      "code": "AP_regular2"
    },
    {
      "learningArea": 'English (Regular: Grade 9 or 10)',
      "code": "English_regular2"
    },
    {
      "learningArea": 'Filipino (Regular: Grade 9 or 10)',
      "code": "Filipino_regular2"
    },
    {
      "learningArea": 'Math (Regular: Grade 9 or 10)',
      "code": "Math_regular2"
    },
    {
      "learningArea": 'Science (Regular: Grade 9 or 10)',
      "code": "Science_regular2"
    },
    {
      "learningArea": 'Aral. Panlipunan (Advanced)',
      "code": "AP_advanced"
    },
    {
      "learningArea": 'English (Advanced)',
      "code": "English_advanced"
    },
    {
      "learningArea": 'Filipino (Advanced)',
      "code": "Filipino_advanced"
    },
    {
      "learningArea": 'Math (Advanced)',
      "code": "Math_advanced"
    },
    {
      "learningArea": 'Science (Advanced)',
      "code": "Science_advanced"
    },
    {
      "learningArea": 'English',
      "code": 'English'
    },
    {
      "learningArea": 'Filipino',
      "code": 'Filipino'
    },
    {
      "learningArea": 'Earth and Life Science',
      "code": 'EarthLifeScience'
    },
    {
      "learningArea": 'Physical Science',
      "code": 'PhysicalScience'
    },
    {
      "learningArea": 'Humanities',
      "code": 'Humanities'
    },
    {
      "learningArea": 'General Math',
      "code": 'GeneralMath'
    },
    {
      "learningArea": 'Statistics and Probability',
      "code": 'StatisticsProbability'
    },
    {
      "learningArea": 'Media and Information Literacy',
      "code": 'MediaInformationLiteracy'
    },
    {
      "learningArea": 'Understanding Culture, Society, and Politics',
      "code": 'CutureSocietyPolitics'
    },
    {
      "learningArea": 'Personal Development',
      "code": 'PersonalDevelopment'
    },
    {
      "learningArea": 'Introduction to Philosophy of the Human Person',
      "code": 'Philosophy'
    },
    {
      "learningArea": 'Physical Education and Health',
      "code": 'PhysicalEducation'
    }
  ];

  $scope.deleteTransaction = function(id){
    let data = {};

    $http.delete('/api/transactions/'+id)
    .then(function(res){
      let params = res.data
      data.eventId = params.eventID
      data.count = {};
      $http.get('/api/participants?registrationCode='+params.registrationCode)
      .then(function(users){
        angular.forEach(users.data, function(val){
          if(params.eventType == 'JHS INSET' || params.eventType == 'SHS INSET'){
            angular.forEach(learningArea, function(subj){
              if(subj.learningArea == val.learningArea){
                data.count[subj.code] =+ 1;
              }
            })
          }else{
            data.count = params.participantsCount;
          }
          $http.delete('/api/participants/'+val._id)
          .catch(function(err){
            $scope.err = err.data;
          })
        })
        addParticipants(data);
        showTransactionList('');
      })
      .catch(function(err){
        $scope.err = err.data;
      })
    })
    .catch(function(err){
      $scope.err = err.data;
    })
    angular.element(document.querySelector('#deleteModal')).modal('hide');
  }

  $scope.searchListType = ["schoolID","registrationCode"];

  $scope.searchData = function(data, type){
    if(type){
      if(data == ''){
        showTransactionList('');
      }else{
        showTransactionList(type+'='+data);
      }
    }else{
      showTransactionList('');
    }
  }

  $scope.showTransaction = function(data){
    $scope.editTrans = data;
  }

  $scope.updateTransaction = function(data){
    let id = data._id;

    $http.put('/api/transactions/'+id, data)
    .then(function(res){
      $scope.success = 'Transaction updated!';
    })
    .catch(function(err){
      $scope.err = err.data;
    })
    angular.element(document.querySelector('#editModal')).modal('hide');
  }

  $scope.deleteParticipant = function(id){
    $http.delete('/api/participants/'+id)
    .then(function(res){
      let user = res.data;
      let data = {
        eventId: user.eventID,
        count: {}
      }
      if(user.eventType == 'JHS INSET' || user.eventType == 'SHS INSET'){
        angular.forEach(learningArea, function(subj){
          if(subj.learningArea == user.learningArea){
            data.count[subj.code] = 1;
          }
        })
      }else{
        data.count = 1;
      }
      addParticipants(data);

      let transQuery = {
        _id: user.transactionID
      }

      $scope.showParticipants(transQuery);
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  //Pagination

  $scope.itemsPerPage = 15;
  $scope.currentPage = 0;

  $scope.range = function() {
    var rangeSize = 5;
    var ret = [];
    var start;

    start = $scope.currentPage;
    if ( start > $scope.pageCount()-rangeSize ) {
      start = $scope.pageCount()-rangeSize+1;
    }

    for (var i=start; i<start+rangeSize; i++) {
      ret.push(i);
    }
    return ret;
  };

  $scope.prevPage = function() {
    if ($scope.currentPage > 0) {
      $scope.currentPage--;
    }
  };

  $scope.prevPageDisabled = function() {
    return $scope.currentPage === 0 ? "disabled" : "";
  };

  $scope.pageCount = function() {
    if($scope.transactions){
      return Math.ceil($scope.transactions.length/$scope.itemsPerPage)-1;
    }
  };

  $scope.nextPage = function() {
    if ($scope.currentPage < $scope.pageCount()) {
      $scope.currentPage++;
    }
  };

  $scope.nextPageDisabled = function() {
    return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
  };

  $scope.setPage = function(n) {
    $scope.currentPage = n;
  };

});
