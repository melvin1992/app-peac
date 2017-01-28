mongoose = require 'mongoose'
Schema = mongoose.Schema

ProvinceSchema = new Schema
  code:
    type: String
    required: true
  name:
    type: String
    required: true

provinceModel = mongoose.model('Provinces', ProvinceSchema)
module.exports = provinceModel
