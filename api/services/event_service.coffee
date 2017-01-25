Events = require('mongoose').model 'Events'

EventService =
  create: (params) ->
    deferred = Promise.defer()

    event = new Events params
    event.save()
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  findAll: (query) ->
    deferred = Promise.defer()

    Events.find query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  findOne: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Events.findOne query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  updateEvent: (id, params) ->
    deferred = Promise.defer()

    query = _id: id
    Events.findOneAndUpdate query, params, new:true
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  deleteEvent: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Events.findOneAndRemove query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise



module.exports = EventService
