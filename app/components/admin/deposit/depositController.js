'use strict';

angular.module('myApp.adminDeposit', [])
.filter('offset',function(){
  return function(input, start) {
    start = parseInt(start, 10);
    if(input){
      return input.slice(start);
    }
  };
})
.controller('depositController', function($q, $anchorScroll, $window, $location, $http, $scope) {
  $anchorScroll();

  if($window.sessionStorage["adminInfo"] == null){
    $location.path('loginasadmin');
  }else{
    showPaymentList();
  }

  function showPaymentList(){
    getPaymentList()
    .then(function(res){
      let data = [];
      angular.forEach(res,function(val,key){
        let regCodes = '';
        let totalAmount = 0;
        angular.forEach(val.registrationCodes,function(v,k){
          regCodes += v;
          if(k+1 != val.registrationCodes.length){
            regCodes += ',';
          }
          getAmount(v)
          .then(function(a){
            val.totalAmount += a;
          })
          .catch(function(err){
            $scoper.err = err.data;
          })
        })
        val.totalAmount = totalAmount;
        val.regCodes = regCodes;
        val.depositImgUrl = '../../../assets/uploads/'+val.depositImgUrl;
        data.push(val);
      })
      $scope.payments = data;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  function getPaymentList(){
    let deferred = $q.defer();
    $http.get('/api/deposits')
    .then(function(res){
      deferred.resolve(res.data);
    })
    .catch(function(err){
      deferred.reject(err);
    })
    return deferred.promise;
  }

  function getAmount(code){
    let deferred = $q.defer();
    $http.get('/api/transactions?registrationCode='+code)
    .then(function(res){
      deferred.resolve(res.data[0].totalAmount);
    })
    .catch(function(err){
      deferred.reject(err);
    })
    return deferred.promise;
  }

  function updateDeposit(data, id){
    let deferred = $q.defer();
    let depositUrl = '/api/deposits/'+id;
    $http.put(depositUrl,data)
    .then(function(res){
      deferred.resolve(res.data);
    })
    .catch(function(err){
      deferred.reject(err);
    })
    return deferred.promise;
  }

  function updateTransaction(data, id){
    let regUrl = '/api/transactions?registrationCode='+id;
    $http.get(regUrl)
    .then(function(res){
      let transId = res.data[0]._id;
      let transUrl = '/api/transactions/'+transId;
      $http.put(transUrl, data)
      .then(function(trans){
        console.log('Transaction updated!');
      })
      .catch(function(err){
        $scope.err = err.data;
      })
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  $scope.showDetails = function(payment){
    $scope.details = payment;
  }

  $scope.approveDeposit = function(data){
    let id = data._id;
    let payload = {
      status: 'approved'
    }
    updateDeposit(payload, id)
    .then(function(res){
      angular.forEach(data.registrationCodes,function(value,key){
        let payloadData = {
          status: 'paid'
        }
        updateTransaction(payloadData, value);
      })
    })
    .catch(function(err){
      $scope.err = err.data;
    })
    angular.element(document.querySelector('#openModal')).modal('hide');
    showPaymentList();
  }

  $scope.declineDeposit = function(data){
    let id = data._id;
    let payload = {
      status: 'declined'
    }
    updateDeposit(payload, id)
    .then(function(res){
      angular.forEach(data.registrationCodes,function(value,key){
        updateTransaction(payload, value);
      })
    })
    .catch(function(err){
      $scope.err = err.data;
    })
    angular.element(document.querySelector('#openModal')).modal('hide');
    showPaymentList();
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
    if($scope.payments){
      return Math.ceil($scope.payments.length/$scope.itemsPerPage)-1;
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