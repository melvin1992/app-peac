Participants = require('mongoose').model 'Participants'

ParticipantService =
  create: (params) ->
    deferred = Promise.defer()

    participant = new Participants params
    participant.save()
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  findAll: (query) ->
    deferred = Promise.defer()

    Participants.find query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  findOne: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Participants.findOne query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  updateParticipant: (id, params) ->
    deferred = Promise.defer()

    query = _id: id
    Participants.findOneAndUpdate query, params, new:true
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

  deleteParticipant: (id) ->
    deferred = Promise.defer()

    query = _id: id
    Participants.findOneAndRemove query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise

module.exports = ParticipantService
