'use strict';

angular.module('myApp.adminUser', [])
.filter('offset',function(){
  return function(input, start) {
    start = parseInt(start, 10);
    if(input){
      return input.slice(start);
    }
  };
})
.controller('userController', function($q, $anchorScroll, $window, $location, $http, $scope) {
  $anchorScroll();

  if($window.sessionStorage["adminInfo"] == null){
    $location.path('loginasadmin');
  }else{
    showUserList('');
  }

  function showUserList(query){
    getUserList(query)
    .then(function(res){
      $scope.users= res;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  function getUserList(query){
    let deferred = $q.defer();
    $http.get('/api/accounts?'+query)
    .then(function(res){
      deferred.resolve(res.data);
    })
    .catch(function(err){
      deferred.reject(err);
    })
    return deferred.promise;
  }

  $scope.showNotif = function(user){
    $scope.userData = user;
  }

  $scope.deleteUser = function(id){
    $http.delete('/api/accounts/'+id)
    .then(function(res){
      showUserList('');
    })
    .catch(function(err){
      $scope.err = err.data;
    })
    angular.element(document.querySelector('#deleteModal')).modal('hide');
  }

  $scope.editUser = function(user){
    $scope.userSuccess = null;
    $scope.userErr = null;
    $scope.userEdit = 'true';
    $scope.user = user;
  }

  $scope.addUser = function(){
    $scope.userSuccess = null;
    $scope.userErr = null;
    $scope.userEdit = null;
    $scope.user = null;
  }

  $scope.saveUser = function(user){
    if($scope.userEdit != null){
      let userId = user._id;
      $http.put('/api/accounts/'+userId, user)
      .then(function(res){
        $scope.userSuccess = "User information has been updated.";
      })
      .catch(function(err){
        $scope.userErr = err.data;
      })
    }else{
      $http.post('/api/accounts', user)
      .then(function(res){
        showUserList('');
        $scope.userSuccess = "New user has been added.";
      })
      .catch(function(err){
        $scope.userErr = err.data;
      })
    }
  }

  $scope.searchListType = [
    {
      "name":"SHS School ID",
      "query": "shsSchool.schoolID"
    },
    {
      "name":"JHS School ID",
      "query": "jhsSchool.schoolID"
    },
    {
      "name":"Username",
      "query":"username"
    }
  ];

  $scope.searchData = function(data, type){
    if(type){
      showUserList(type+'='+data);
    }else{
      showUserList('');
    }
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
    if($scope.users){
      return Math.ceil($scope.users.length/$scope.itemsPerPage)-1;
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
