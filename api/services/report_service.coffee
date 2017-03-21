Participants = require('mongoose').model 'Participants'
Deposits = require('mongoose').model 'Deposits'
Transactions = require('mongoose').model 'Transactions'
_ = require 'lodash'

ReportService =
  getParticipant: (regCodes) ->
    deferred = Promise.defer()

    data = []
    x = 0;

    _.forEach regCodes, (val) ->

      status = val.status
      query =
        registrationCode: val.regCode

      Participants.find query
      .then (parti) ->
        x++

        payload =
          learningArea: parti[0].learningArea
          count: 1
          status: status
        data.push(payload)

        if(x+1 == regCodes.length)
          deferred.resolve data

      .catch (err) ->
        deferred.reject err


    deferred.promise


  getEventReport: (query) ->
    deferred = Promise.defer()

    data = {}

    Transactions.find query
    .then (trans) =>
      eventType = trans[0].eventType

      if(eventType == 'JHS INSET' || eventType == 'SHS INSET')
        arrCode = []

        _.forEach trans, (val) =>
          arrCode.push({
            regCode: val.registrationCode
            status: val.status
          })

        @getParticipant arrCode
        .then (res) ->
          deferred.resolve res
        .catch (err) ->
          deferred.reject err

      else
        paidParticipants = 0;
        registeredParticipants = 0;
        _.forEach trans, (val) ->
          if(val.status == 'paid')
            paidParticipants += val.participantsCount
            registeredParticipants += val.participantsCount
          else if(val.status == 'pending' || val.status == 'processing')
            registeredParticipants += val.participantsCount

        data.paid = paidParticipants
        data.registered = registeredParticipants

        deferred.resolve data

    .catch (err) ->
      deferred.reject err

    deferred.promise

module.exports = ReportService
