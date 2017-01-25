mongoose = require 'mongoose'
Schema = mongoose.Schema

SettingSchema = new Schema
  activeYear:
    type: String
    required: true
  modifiedDate:
    type: Date
    default: Date.now
  modifiedBy:
    type: String
    required: true

settingModel = mongoose.model('Settings', SettingSchema)
module.exports = settingModel
