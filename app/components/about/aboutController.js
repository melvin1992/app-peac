'use strict';

angular.module('myApp.about', [])
.controller('aboutController', function($anchorScroll) {
  $anchorScroll();
  console.log('about page');
});
