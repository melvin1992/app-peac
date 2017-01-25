'use strict';

angular.module('myApp.adminEvent', [])
.controller('eventController', function($anchorScroll) {
  $anchorScroll();
  console.log('event page');
});
