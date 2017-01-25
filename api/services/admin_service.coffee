Admins = require('mongoose').model 'Admins'
_ = require 'lodash'

AdminService =
  create: (params) ->
    deferred = Promise.defer()

    query =
      username: params.username
    Admins.find query
    .then (findRes) ->
      if _.isEmpty(findRes)
        admin = new Admins params
        admin.save()
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

    Admins.find query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  findOne: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Admins.findOne query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  updateAdmin: (id, params) ->
    deferred = Promise.defer()

    query = _id: id
    delete params.username

    Admins.findOneAndUpdate query, params, new:true
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  deleteAdmin: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Admins.findOneAndRemove query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise


module.exports = AdminService
