Settings = require('mongoose').model 'Settings'
_ = require 'lodash'

SettingService =
  create: (params) ->
    deferred = Promise.defer()

    Settings.remove({})
    .then (r) ->
      setting = new Settings params
      setting.save()
      .then (res) ->
        #update all events from past year to end
        #params.pastYear
        deferred.resolve res
      .catch (err) ->
        deferred.reject err
    .catch (err) ->
      deferred.reject err

    deferred.promise

  findActiveYear: (query) ->
    deferred = Promise.defer()

    Settings.find query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err

    deferred.promise


module.exports = SettingService
