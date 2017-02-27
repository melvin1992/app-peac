'use strict';

angular.module('myApp.myregistration', [])
.filter('offset',function(){
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
})
.controller('myRegistrationController', function($anchorScroll, $q, $scope, $location, $window, $http) {
  $anchorScroll();

  let userId = "";

  if($window.sessionStorage["userInfo"] == null){
    $location.path('/');
  }else{
    let userData = JSON.parse($window.sessionStorage["userInfo"]);
    userId = userData._id;

    getRegistrationList(userId);
  }

  $scope.registrationList = [];

  function getRegistrationList(userId){
    $http.get('/api/transactions?userID='+userId)
    .then (function(res){
      angular.forEach(res.data, function(value,key){

        let transId = value._id;
        $http.get('/api/participants?transactionID='+transId)
        .then (function(res){
          value.participantList = res.data;
          $scope.registrationList.push(value);
        })
        .catch (function(err){
          $scope.err = err.data;
        })

      })
    })
    .catch (function(err){
      $scope.err = err.data;
    })
  }

  function formatDate(date){
    let ndate = new Date(date);
    return (ndate.getMonth() + 1) + '/' + ndate.getDate() + '/' +  ndate.getFullYear();
  }

  function searchSchoolData(type, id){
    let url = "";
    if(type == 'SHS INSET' || type == 'SHS Orientation'){
      url = "/api/shs";
    }else{
      url = "/api/jhs";
    }

    $http.get(url+"?schoolId="+id)
    .then (function(res){
      $scope.schoolInfo = res.data[0];
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  function searchEventData(id){
    $http.get('/api/events/'+id)
    .then (function(res){
      $scope.eventInfo = res.data
    })
    .catch (function(err){
      $scope.err = err.data;
    })
  }

  $scope.editParticipants = function(data){
    $scope.editSuccess = null;
    $scope.editErr = null;
    $scope.user = data;
  }

  $scope.saveParticipant = function(user){
    let id = user._id;
    $http.put('/api/participants/'+id, user)
    .then (function(res){
      $scope.editSuccess = "Participant information has been updated";
    })
    .catch (function(err){
      $scope.editErr = err.data;
    })
  }

  $scope.showDetails = function(data){
    JsBarcode("#barcode", data.registrationCode);
    $scope.details = data;
    searchSchoolData(data.eventType, data.schoolID);
    searchEventData(data.eventID);
  }

  $scope.printDetails = function(){
    window.print();
  }

  //Pagination

  $scope.itemsPerPage = 5;
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
    return Math.ceil($scope.registrationList.length/$scope.itemsPerPage)-1;
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
