mongoose = require 'mongoose'
Schema = mongoose.Schema

RegionSchema = new Schema
  code:
    type: String
    required: true
  name:
    type: String
    required: true

regionModel = mongoose.model('Regions', RegionSchema)
module.exports = regionModel
