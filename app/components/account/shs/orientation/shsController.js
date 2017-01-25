'use strict';

angular.module('myApp.shsOrientation', [])
.controller('shsController', function($anchorScroll) {
  $anchorScroll();
  console.log('SHS Orientation');
});
