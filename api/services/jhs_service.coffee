JhsSchools = require('mongoose').model 'JhsSchools'
_ = require 'lodash'

JHSService =
  create: (params) ->
    deferred = Promise.defer()

    _query =
      schoolId: params.schoolId

    @findAll _query
    .then (school) ->
      if _.isEmpty(school)
        jhs = new JhsSchools params
        jhs.save()
        .then (res) ->
          deferred.resolve res
        .catch (err) ->
          deferred.reject err
      else
        deferred.reject "School Id already exist."
    .catch (err) ->
      deferred.reject err
    
    deferred.promise

  findAll: (query) ->
    deferred = Promise.defer()

    JhsSchools.find query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  findOne: (id) ->
    deferred = Promise.defer()

    query = _id: id
    JhsSchools.findOne query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  updateJHS: (id, params) ->
    deferred = Promise.defer()

    query = _id: id
    JhsSchools.findOneAndUpdate query, params, new:true
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  deleteJHS: (id) ->
    deferred = Promise.defer()

    query = _id: id
    JhsSchools.findOneAndRemove query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

module.exports = JHSService
