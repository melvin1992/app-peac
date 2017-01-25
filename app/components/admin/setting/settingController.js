'use strict';

angular.module('myApp.adminSetting', [])
.controller('adminSettingController', function($anchorScroll, $window, $location, $http, $scope) {
  $anchorScroll();

  let adminId = "";

  if($window.sessionStorage["adminInfo"] == null){
    $location.path('loginasadmin');
  }else{
    let adminData = JSON.parse($window.sessionStorage["adminInfo"]);
    adminId = adminData._id;

    $http.get('/api/admin/accounts/'+adminId)
    .then(function(res){
      delete(res.data.password);
      $scope.admin = res.data;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }


  function getActiveYear(){
    $http.get('/api/admin/settings')
    .then(function(res){
      $scope.activeYear = res.data[0].activeYear;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }
  getActiveYear();

  $scope.updateActiveYear = function(year){
    if(year){
      let admin = $scope.admin.username;
      let data = {
        pastYear: $scope.activeYear,
        activeYear: year,
        modifiedBy: admin
      }
      $http.post('/api/admin/settings',data)
      .then(function(res){
        $scope.success = "Active year has been changed.";
        getActiveYear();
      })
      .catch(function(err){
        $scope.err = err.data;
      })
    }
  }



  $scope.saveAdmin = function(admin){
    $http.put('/api/admin/accounts/'+adminId, admin)
    .then(function(res){
      $scope.err = null;
      $scope.adminSuccess = "Information has been updated";
    })
    .catch(function(err){
      $scope.adminErr = err.data;
    })
  }

  $scope.changePassword = function(pass){
    $http.get('/api/admin/accounts/'+adminId)
    .then(function(res){

      let oldpass = res.data.password;

      if(oldpass != pass.oldpass){
        $scope.passErr = "Old password didn't match.";
      }else if(pass.newpass != pass.confirmpass){
        $scope.passErr = "Password didn't match.";
      }else{
        let newpass = {
          password: pass.newpass
        }

        $http.put('/api/admin/accounts/'+adminId, newpass)
        .then(function(res){
          $scope.passSuccess = "Password changed!";
        })
        .catch(function(err){
          $scope.passErr = err.data;
        })
      }

    })
    .catch(function(err){
      $scope.passErr = err.data;
    })
  }

  $scope.createAdmin = function(newUser){
    if(newUser && newUser.password && newUser.confirmpass && newUser.firstName && newUser.middleName
      && newUser.lastName && newUser.email ){

      if (newUser.password != newUser.confirmpass){
        return $scope.regErr = "Password didn't match";
      } else {
        $http.post('/api/admin/accounts', newUser)
        .then(function(res){
          $scope.regErr = null;
          $scope.regSuccess = "success";
          return $scope.newUser = null;
        })
        .catch(function(err){
          return $scope.regErr = err.data;
        });
      }
    }else{
      return $scope.regErr = "Fill up required fields"
    }
  }

  let yearList = [];
  for(let x = 2017; x<=2050; x++){
    yearList.push(x);
  }
  $scope.years = yearList;


});
