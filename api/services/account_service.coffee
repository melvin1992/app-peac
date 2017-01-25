Accounts = require('mongoose').model 'Accounts'
_ = require 'lodash'

AccountService =
  create: (params) ->
    deferred = Promise.defer()

    query =
      username: params.username
    Accounts.find query
    .then (findRes) ->
      if _.isEmpty(findRes)
        account = new Accounts params
        account.save()
        .then (res) ->
          deferred.resolve res
        .catch (err) ->
          deferred.reject err
      else
        deferred.reject 'Username already exist.'
    .catch (err) ->
      deferred.reject err

    deferred.promise

  findAll: (query) ->
    deferred = Promise.defer()

    Accounts.find query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  findOne: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Accounts.findOne query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  updateAccount: (id, params) ->
    deferred = Promise.defer()

    query = _id: id
    delete params.username

    Accounts.findOneAndUpdate query, params, new:true
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  deleteAccount: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Accounts.findOneAndRemove query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise


module.exports = AccountService
