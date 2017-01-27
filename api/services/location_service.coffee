Regions = require('mongoose').model 'Regions'
Provinces = require('mongoose').model 'Provinces'

LocationService =
  createRegion: (params) ->
    deferred = Promise.defer()
    region = new Regions params
    region.save()
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err
    deferred.promise

  createProvince: (params) ->
    deferred = Promise.defer()
    province = new Provinces params
    province.save()
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err
    deferred.promise

  findAllRegion: (query) ->
    deferred = Promise.defer()
    Regions.find query
    .sort {name: 1}
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err
    deferred.promise

  findAllProvince: (query) ->
    deferred = Promise.defer()
    Provinces.find query
    .sort {name: 1}
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err
    deferred.promise

  findOneRegion: (id) ->
    deferred = Promise.defer()
    query = _id: id
    Regions.findOne query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err
    deferred.promise

  findOneProvince: (id) ->
    deferred = Promise.defer()
    query = _id: id
    Provinces.findOne query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err
    deferred.promise

  updateRegion: (id, params) ->
    deferred = Promise.defer()
    query = _id: id
    Regions.findOneAndUpdate query, params, new:true
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err
    deferred.promise

  updateProvince: (id, params) ->
    deferred = Promise.defer()
    query = _id: id
    Provinces.findOneAndUpdate query, params, new:true
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err
    deferred.promise

  deleteRegion: (id) ->
    deferred = Promise.defer()
    query = _id: id
    Regions.findOneAndRemove query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err
    deferred.promise

  deleteProvince: (id) ->
    deferred = Promise.defer()
    query = _id: id
    Provinces.findOneAndRemove query
    .then (res) ->
      deferred.resolve res
    .catch (err) ->
      deferred.reject err
    deferred.promise




module.exports = LocationService
