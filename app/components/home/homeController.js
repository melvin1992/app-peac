'use strict';

angular.module('myApp.home', [])
.controller('homeController', function($anchorScroll) {
  $anchorScroll();
  console.log('home page');
});
