'use strict';

angular.module('myApp.jhsOrientation', [])
.controller('jhsController', function($anchorScroll) {
  $anchorScroll();
  console.log('JHS Orientation');
});
