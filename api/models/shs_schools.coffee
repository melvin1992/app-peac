mongoose = require 'mongoose'
Schema = mongoose.Schema

ShsSchoolSchema = new Schema
  schoolId:
    type: Number
    require: true
  shortName:
    type: String
    default: ''
  name:
    type: String
    required: true
  email:
    type: String
    default: ''
  oldName:
    type: String
    default: ''
  principal:
    type: String
    default: ''
  region:
    type: Number
  province:
    type: Number
  city:
    type: Number
  street:
    type: String
    default: ''
  telNo:
    type: String
    default: ''
  cellNo:
    type: String
    default: ''
  fax:
    type: String
    default: ''
  website:
    type: String
    default: ''

shsSchoolModel = mongoose.model('ShsSchools', ShsSchoolSchema)
module.exports = shsSchoolModel
