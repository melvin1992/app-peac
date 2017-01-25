'use strict';

angular.module('myApp.payment', [])
.controller('paymentController', function($anchorScroll) {
  $anchorScroll();
  console.log('payment page');
});
