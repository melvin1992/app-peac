Events = require('mongoose').model 'Events'
_ = require 'lodash'

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

  deductParticipants: (eventId, count) ->
    deferred = Promise.defer()

    query = _id: eventId

    Events.findOne query
    .then (res) =>

      data = {}

      if res.eventType == 'SHS INSET'
        shs = {}
        subjects = res.shsLimits
        counts = _.map(count, (val,key) ->
          subjects[key] = subjects[key] - val
        )
        data.shsLimits = subjects
      else if res.eventType == 'JHS INSET'
        jhs = {}
        subjects = res.jhsLimits
        counts = _.map(count, (val,key) ->
          subjects[key] = subjects[key] - val
        )
        data.jhsLimits = subjects
      else
        limitsRes = res.limits - count
        data =
          limits: limitsRes

      @updateEvent eventId, data
      .then (res) ->
        deferred.resolve res
      .catch (err) ->
        deferred.reject err

    .catch (err) ->
      deferred.reject err

    deferred.promise

module.exports = EventService
