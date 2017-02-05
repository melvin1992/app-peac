'use strict';

angular.module('myApp.payment', [])
.controller('paymentController', function($anchorScroll, $q, $http, $window, $location, $scope) {
  $anchorScroll();

  //update status to processing
  //update deposit number
  //update deposit img url

  let userId = "";

  if($window.sessionStorage["userInfo"] == null){
    $location.path('/');
  }else{
    let userData = JSON.parse($window.sessionStorage["userInfo"]);
    userId = userData._id;
  }

  $scope.participantList = [];

  $scope.findRegistration = function(regCode){
    $http.get('/api/participants?registrationCode='+regCode+'&userID='+userId)
    .then(function(res){
      if(res.data.length != 0){
        let regCode = res.data[0].registrationCode;
        let exist = $scope.participantList.some(function(el){
          return el.registrationCode == regCode;
        })

        if(!exist){
          //update transaction Details send regCode
          angular.forEach(res.data,function(value,key){
            $scope.participantList.push(value);
          })
        }
        $scope.err = null;
        $scope.regCode = null;
      }else{
        $scope.err = "Registration code does not exist";
      }
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  $scope.submitData = function(){

    let codeList = [];

    angular.forEach($scope.participantList,function(value,key){

      let exist = codeList.some(function(el){
        return el == value.registrationCode;
      })
      if(!exist){
        codeList.push(value.registrationCode);
      }

    })

    console.log(codeList);

  }

  $scope.clearData = function(){
    $scope.participantList = [];
    $scope.regCode = null;
  }

  $scope.details = {
    amount: "10,000",
    participants: "10"
  }



});
