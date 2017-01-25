Accounts = require('mongoose').model 'Accounts'
Admins = require('mongoose').model 'Admins'
_ = require 'lodash'

LoginService =
  login: (params) ->
    deferred = Promise.defer()

    query =
      username: params.username
      password: params.password
      status: 'active'
    Accounts.findOne query
    .then (res) ->
      if(_.isEmpty(res))
        deferred.reject 'Incorrect Login'
      else
        deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  loginAdmin: (params) ->
    deferred = Promise.defer()

    query =
      username: params.username
      password: params.password
      status: 'active'
    Admins.findOne query
    .then (res) ->
      if(_.isEmpty(res))
        deferred.reject 'Incorrect Login'
      else
        deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

module.exports = LoginService
