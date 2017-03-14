'use strict';

angular.module('myApp.adminEvent', [])
.filter('offset',function(){
  return function(input, start) {
    start = parseInt(start, 10);
    if(input){
      return input.slice(start);
    }
  };
})
.controller('eventController', function($q, $anchorScroll, $window, $location, $http, $scope) {
  $anchorScroll();

  if($window.sessionStorage["adminInfo"] == null){
    $location.path('loginasadmin');
  }else{
    showEventList();

    getRegionList()
    .then(function(res){
      $scope.regionList = res;
    })
    .catch(function(err){
      $scope.err = err.data;
    })

    getProvinceList()
    .then(function(res){
      $scope.provinceList = res;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  function showEventList(){
    getEventList()
    .then(function(res){
      $scope.eventList = res;
    })
    .catch(function(err){
      $scope.err = err.data;
    })
  }

  function getEventList(){
    let deferred = $q.defer();
    getActiveYear()
    .then(function(year){
      $scope.activeYear = year;
      $http.get('/api/events?eventYear='+year)
      .then(function(res){
        deferred.resolve(res.data);
      })
      .catch(function(err){
        deferred.reject(err.data);
      })
    })
    .catch(function(err){
      deferred.reject(err.data);
    })
    return deferred.promise;
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

  function getRegionList(){
    let deferred = $q.defer();
    $http.get('/api/locations/regions')
    .then(function(res){
      deferred.resolve(res.data);
    })
    .catch(function(err){
      deferred.reject(err);
    })
    return deferred.promise;
  }

  function getProvinceList(){
    let deferred = $q.defer();
    $http.get('/api/locations/provinces')
    .then(function(res){
      deferred.resolve(res.data);
    })
    .catch(function(err){
      deferred.reject(err);
    })
    return deferred.promise;
  }

  function formatDate(date){
    let ndate = new Date(date);
    return (ndate.getMonth() + 1) + '/' + ndate.getDate() + '/' +  ndate.getFullYear();
  }

  function clearData(){
    $scope.err = null;
    $scope.success = null;
    $scope.eventErr = null;
    $scope.eventSuccess = null;
    $scope.eventData = null;
    $scope.eventEdit = null;
  }

  function addEventData(eventData){
    let regions = [];
    let provinces = [];
    angular.forEach(eventData.region,function(value,key){
      regions.push(value.code);
    });
    angular.forEach(eventData.province,function(value,key){
      provinces.push(value.code);
    });
    eventData.region = regions;
    eventData.province = provinces;

    $http.post('/api/events', eventData)
    .then(function(res){
      $scope.eventSuccess = "Event has been added.";
      $scope.eventData = null;
      showEventList();
    })
    .catch(function(err){
      $scope.eventErr = err.data;
    })
  }

  function saveEventData(eventData){
    let regions = [];
    let provinces = [];
    let id = eventData._id;

    angular.forEach(eventData.region,function(value,key){
      regions.push(value.code);
    });
    angular.forEach(eventData.province,function(value,key){
      provinces.push(value.code);
    });

    if(regions[0] != null){
      eventData.region = regions;
    }
    if(provinces[0] != null){
      eventData.province = provinces;
    }

    $http.put('/api/events/'+id, eventData)
    .then(function(res){
      $scope.eventSuccess = "Event has been updated";
      showEventList();
    })
    .catch(function(err){
      $scope.eventErr = err.data;
    })

  }

  $scope.years = ['2017','2018','2019','2020','2021','2022','2023','2024','2024','2026','2027','2028','2029','2030'];
  $scope.eventType = ['JHS INSET','JHS Orientation','SHS INSET','SHS Orientation'];

  $scope.clearEventData = function(){
    clearData();
  }

  $scope.saveEvent = function(eventData){
    console.log(eventData);
    if(eventData && eventData.name && eventData.venue && eventData.eventDate
    && eventData.eventType && eventData.eventYear && eventData.eventFee
    && eventData.region && eventData.deadline){

      if($scope.eventEdit == null){
        addEventData(eventData);
      }else{
        saveEventData(eventData);
      }

    }else{
      $scope.eventErr = "Fill up all required fields.";
    }
  }

  $scope.editEvent = function(eventData){
    clearData();
    eventData.deadline = formatDate(eventData.deadline);
    $scope.eventData = eventData;
    $scope.eventEdit = "true";
  }

  $scope.showNotif = function(eventData){
    clearData();
    $scope.eventData = eventData;
  }

  $scope.deleteEvent = function(id){
    $http.delete('/api/events/'+id)
    .then(function(res){
      showEventList();
    })
    .catch(function(err){
      $scope.err = err.data;
    })
    angular.element(document.querySelector('#deleteModal')).modal('hide');
  }

  $scope.showEventPerYear = function(year){
    $scope.eventList = null;
    if(year){
      $http.get('/api/events?eventYear='+year)
      .then(function(res){
        $scope.eventList = res.data;
      })
      .catch(function(err){
        deferred.reject(err.data);
      })
    }else{
      showEventList();
    }
  }

  $scope.showEventPerType = function(eventType, year){
    $scope.eventList = null;
    if(eventType != ""){
      $http.get('/api/events?eventYear='+year+'&eventType='+eventType)
      .then(function(res){
        $scope.eventList = res.data;
      })
      .catch(function(err){
        $scope.error = err.data;
      })
    }else{
      $scope.showEventPerYear(year);
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
    if($scope.eventList){
      return Math.ceil($scope.eventList.length/$scope.itemsPerPage)-1;
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
