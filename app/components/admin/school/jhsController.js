'use strict';

angular.module('myApp.adminJHS', [])
.filter('offset',function(){
  return function(input, start) {
    start = parseInt(start, 10);
    if(input){
      return input.slice(start);
    }
  };
})
.controller('jhsAdminController', function($q, $anchorScroll, $window, $location, $http, $scope) {
  $anchorScroll();

  if($window.sessionStorage["adminInfo"] == null){
    $location.path('loginasadmin');
  }else{
    // showSchoolList();
    getRegionList();
    getProvinceList();
  }

  function showSchoolList(){
    getSchoolList()
    .then(function(res){
      $scope.schools = res;
      $scope.showLoading = null;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  function getSchoolList(){
    let deferred = $q.defer();
    $http.get('/api/jhs')
    .then(function(res){
      deferred.resolve(res.data);
    })
    .catch(function(err){
      deferred.reject(err);
    })
    return deferred.promise;
  }

  function getRegionList(){
    $http.get('/api/locations/regions')
    .then(function(res){
      $scope.regionList = res.data;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  function getProvinceList(){
    $http.get('/api/locations/provinces')
    .then(function(res){
      $scope.provinceList = res.data;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  $scope.searchSchool = function(id){
    $scope.showLoading = "show";
    if(id != ''){
      $http.get('/api/jhs?schoolId='+id)
      .then(function(res){
        $scope.schools = res.data;
        $scope.showLoading = null;
      })
      .catch(function(err){
        $scope.err = err.data;
      })
    }else{
      showSchoolList();
    }
  }

  $scope.editSchool = function(data){
    if(data.region.toString().length == 8){
      let reg = data.region.toString();
      data.region = "0" + reg;
    }else{
      data.region = data.region.toString();
    }

    if(data.province.toString().length == 8){
      let pro = data.province.toString();
      data.province = "0" + pro;
    }else{
      data.province = data.province.toString();
    }

    $scope.schoolData = data;
    $scope.schoolEdit = "true";
    angular.element(document.querySelector('#openModal')).modal('show');
  }

  $scope.cleardata = function(){
    $scope.schoolData = null;
    $scope.schoolEdit = null;
    $scope.errSchool = null;
  }

  $scope.saveSchool = function(data){
    if($scope.schoolEdit == "true"){
      let id = data._id;
      $http.put('/api/jhs/'+id, data)
      .then(function(res){
        $scope.success = "School updated!";
        angular.element(document.querySelector('#openModal')).modal('hide');
      })
      .catch(function(err){
        $scope.errSchool = err.data;
      })
    }else{
      $http.post('/api/jhs', data)
      .then(function(res){
        $scope.success = "New school added!";
        angular.element(document.querySelector('#openModal')).modal('hide');
      })
      .catch(function(err){
        $scope.errSchool = err.data;
      })
    }
  }

  $scope.showNotif = function(id){
    $scope.deleteId = id;
  }

  $scope.deleteSchool = function(id){
    $http.delete('/api/jhs/'+id)
    .then(function(res){
      $scope.success = "Record removed.";
      showSchoolList();
      angular.element(document.querySelector('#deleteModal')).modal('hide');
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
    if($scope.schools){
      return Math.ceil($scope.schools.length/$scope.itemsPerPage)-1;
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
