'use strict';

angular.module('myApp.contact', [])
.controller('contactController', function($anchorScroll) {
  $anchorScroll();
  console.log('contact page');
});
