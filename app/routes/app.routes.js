'use strict';

angular.module('myApp', [
  'ngRoute',
  // 'myApp.home',
  // 'myApp.about',
  'myApp.contact',
  'myApp.jhsOrientation',
  'myApp.shsOrientation',
  'myApp.jhsInset',
  'myApp.shsInset',
  'myApp.payment',
  'myApp.login',
  'myApp.register',
  'myApp.myregistration',
  'myApp.myprofile',
  'myApp.attendance',
  'myApp.activateAccount',
  'myApp.adminLogin',
  'myApp.adminSetting',
  'myApp.adminEvent',
  'myApp.adminJHS',
  'myApp.adminSHS',
  'myApp.adminUser',
  'myApp.adminTransaction',
  'myApp.adminDeposit',
  'myApp.reportEvent',
  'myApp.paidReport',
  'myApp.participantReport',
  'myApp.teacherReport',
  'myApp.deductHours'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  // $locationProvider.html5Mode(true);

  $routeProvider
  //Main Page
  // .when('/',{ templateUrl:'../components/home/home.html', controller:'homeController' })
  // .when('/about',{ templateUrl:'../components/about/about.html', controller:'aboutController' })
  .when('/contact',{ templateUrl:'../components/contact/contact.html', controller:'contactController' })

  .when('/', { templateUrl:'../components/login/login.html', controller:'loginController' })
  .when('/register', { templateUrl:'../components/registration/register.html', controller:'registerController' })
  .when('/attendance', { templateUrl:'../components/attendance/attendance.html', controller:'attendanceController' })
  .when('/activateaccount', { templateUrl:'../components/registration/activate.html', controller:'activateController' })

  //Account
  .when('/profile', {templateUrl:'../components/account/profile/myprofile.html', controller:'myprofileController'})

  .when('/jhsorientation',{ templateUrl:'../components/account/jhs/orientation/jhs.html', controller:'jhsController' })
  .when('/jhsinset',{ templateUrl:'../components/account/jhs/inset/jhs.html', controller:'jhsInsetController' })

  .when('/shsorientation',{ templateUrl:'../components/account/shs/orientation/shs.html', controller:'shsController' })
  .when('/shsinset',{ templateUrl:'../components/account/shs/inset/shs.html', controller:'shsInsetController' })

  .when('/payment',{ templateUrl:'../components/account/payment/payment.html', controller:'paymentController' })
  .when('/myregistration',{ templateUrl:'../components/account/registration/myRegistration.html', controller:'myRegistrationController'})

  //Admin
  .when('/loginasadmin', { templateUrl:'../components/admin/login/adminLogin.html', controller:'adminLoginController' })
  .when('/admin', { templateUrl:'../components/admin/setting/setting.html', controller:'adminSettingController' })
  .when('/admin/events', { templateUrl:'../components/admin/event/event.html', controller:'eventController' })
  .when('/admin/jhs', { templateUrl:'../components/admin/school/jhs.html', controller:'jhsAdminController' })
  .when('/admin/shs', { templateUrl:'../components/admin/school/shs.html', controller:'shsAdminController' })
  .when('/admin/users', { templateUrl:'../components/admin/user/user.html', controller:'userController' })
  .when('/admin/transactions', { templateUrl:'../components/admin/transaction/transaction.html', controller:'transactionController' })
  .when('/admin/deposits', { templateUrl:'../components/admin/deposit/deposit.html', controller:'depositController' })
  .when('/admin/deduct', { templateUrl:'../components/admin/participants/deductHours.html', controller:'deductHoursController' })

  .when('/admin/report', { templateUrl:'../components/admin/reports/reportIndex.html'})
  .when('/admin/report/event', { templateUrl:'../components/admin/reports/eventReport.html', controller:'reportEventController'})
  .when('/admin/report/paid', { templateUrl:'../components/admin/reports/paidReport.html', controller:'paidReportController'})
  .when('/admin/report/participant', { templateUrl:'../components/admin/reports/participantReport.html', controller:'participantReportController'})
  .when('/admin/report/teacher', { templateUrl:'../components/admin/reports/teacherReport.html', controller:'teacherReportController'})


  .otherwise({redirectTo: '/'});
}]);
