'use strict';

angular.module('myApp.payment', [])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
.controller('paymentController', function($anchorScroll, $q, $http, $window, $location, $scope) {
  $anchorScroll();

  let userId = "";

  if($window.sessionStorage["userInfo"] == null){
    $location.path('/');
  }else{
    let userData = JSON.parse($window.sessionStorage["userInfo"]);
    userId = userData._id;
  }

  $scope.details = {
    amount: 0,
    participants: 0
  }

  function updateDepositDetail(regCode){
    $http.get('/api/transactions?registrationCode='+regCode)
    .then (function(res){
      let old_amount = $scope.details.amount;
      let old_participant = $scope.details.participants;

      let data = res.data[0];

      let new_amount = old_amount + data.totalAmount;
      let new_participant = old_participant + data.participantsCount;

      $scope.details = {
        amount: new_amount,
        participants: new_participant
      }
    })
    .catch (function(err){
      $scope.err = err.data;
    })
  }

  function checkStatus(regCode){
    let deferred = $q.defer();

    $http.get('/api/transactions?registrationCode='+regCode)
    .then (function(res){
      deferred.resolve(res.data[0].status);
    })
    .catch (function(err){
      deferred.reject(err);
    })

    return deferred.promise;
  }

  $scope.participantList = [];

  $scope.findRegistration = function(regCode){
    checkStatus(regCode)
    .then (function(status){
      $http.get('/api/participants?registrationCode='+regCode+'&userID='+userId)
      .then(function(res){
        if(res.data.length != 0){
          if(status == "pending" || status == "declined"){
            let regCode = res.data[0].registrationCode;
            let exist = $scope.participantList.some(function(el){
              return el.registrationCode == regCode;
            })
            if(!exist){
              updateDepositDetail(regCode);
              angular.forEach(res.data,function(value,key){
                $scope.participantList.push(value);
              })
            }
            $scope.err = null;
            $scope.regCode = null;
          }else{
            $scope.err = "Registration code " + regCode + " is already " + status + ".";
          }
        }else{
          $scope.err = "Registration code does not exist";
        }
      })
      .catch(function(err){
        $scope.err = err.data;
      })
    })
    .catch (function(err){
      $scope.err = err.data;
    })
  }

  function uploadData(file, uploadUrl, data){
    let deferred = $q.defer();

    var fd = new FormData();
    fd.append('file', file);
    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
    })
    .then(function(res){
      deferred.resolve(res.data);
    })
    .catch(function(err){
      deferred.reject(err);
    })

    return deferred.promise;
  }

  $scope.submitData = function(){
    $anchorScroll();
    let file = $scope.myFile;
    let uploadUrl = "/api/deposits/upload";
    uploadData(file, uploadUrl)
    .then(function(imgPath){

      let codeList = [];
      angular.forEach($scope.participantList,function(value,key){
        let exist = codeList.some(function(el){
          return el == value.registrationCode;
        })
        if(!exist){
          codeList.push(value.registrationCode);
        }
      })

      let data = {
        userId: userId,
        registrationCodes: codeList,
        depositReferenceNo: $scope.refNo,
        depositImgUrl: imgPath
      }

      $http.post('/api/deposits',data)
      .then (function(res){
        $scope.success = "Transaction payment has been sent. Please wait 1-2 days for verification";
        $scope.clearData();
      })
      .catch (function(err){
        $scope.err = err.data;
      })

    })
    .catch(function(err){
      $scope.err = err.data;
    })

  }

  $scope.clearData = function(){
    $scope.participantList = [];
    $scope.regCode = null;
  }


});
