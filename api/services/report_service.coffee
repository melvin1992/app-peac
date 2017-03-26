JhsService = require './jhs_service'
ShsService = require './shs_service'
TransactionService = require './transaction_service'
EventService = require './event_service'

_ = require 'lodash'
converter = require 'number-to-words'

ReportService =
  findSchool: (schoolID, eventType) ->
    deferred = Promise.defer()

    if eventType == 'JHS INSET' || 'JHS orientation'
      sQuery = schoolId: parseInt(schoolID)
      JhsService.findAll sQuery
      .then (school) =>
        sDetail = school[0]
        deferred.resolve sDetail
      .catch (err) ->
        deferred.reject err
    else
      sQuery = schoolId: parseInt(schoolID)
      ShsService.findAll sQuery
      .then (school) =>
        sDetail = school[0]
        deferred.resolve sDetail
      .catch (err) ->
        deferred.reject err

    deferred.promise


  getPaidTransaction: (eventId) ->
    deferred = Promise.defer()

    eventQuery = _id: eventId
    EventService.findOne eventQuery
    .then (event) =>
      payload = []
      eventType = event.eventType

      _query =
        eventID: eventId
        status: 'paid'

      TransactionService.findAll _query
      .then (res) =>
        _.forEach res, (trans, key) =>
          data = {}
          data.schoolID = trans.schoolID
          data.amount = trans.totalAmount
          data.amountInWords = converter.toWords(trans.totalAmount)
          data.eventName = event.name
          data.eventDate = event.eventDate
          data.eventVenue = event.venue

          @findSchool trans.schoolID, eventType
          .then (school) =>
            data.schoolName = school.name
            payload.push data

            if res.length == key + 1
              deferred.resolve _.sortBy payload, [ (o) -> o.schoolID ]

          .catch (err) ->
            deferred.reject err

      .catch (err) ->
        deferred.reject err

    .catch (err) ->
      deferred.reject err

    deferred.promise

module.exports = ReportService
