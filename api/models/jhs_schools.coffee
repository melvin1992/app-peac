mongoose = require 'mongoose'
Schema = mongoose.Schema

JhsSchoolSchema = new Schema
  schoolId:
    type: Number
    required: true
  name:
    type: String
    required: true
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
  congDist:
    type: Number
  brgy:
    type: String
    default: ''
  street:
    type: String
    default: ''
  telNo1:
    type: String
    default: ''
  telNo2:
    type: String
    default: ''
  fax:
    type: String
    default: ''
  cellNo1:
    type: String
    default: ''
  cellNo2:
    type: String
    default: ''
  website:
    type: String
    default: ''

jhsSchoolModel = mongoose.model('JhsSchools', JhsSchoolSchema)
module.exports = jhsSchoolModel
