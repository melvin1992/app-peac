mongoose = require 'mongoose'
Schema = mongoose.Schema

ShsSchoolSchema = new Schema
  schoolId:
    type: String
    require: true
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
    type: String
    default: ''
  province:
    type: String
    default: ''
  city:
    type: String
    default: ''
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
