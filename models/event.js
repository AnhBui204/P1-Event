const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: String,
  date: Date,
  createAt: { type: Date, default: Date.now },
  maxCapacity: { type: Number, required: true }
})

module.exports = mongoose.model('Event', eventSchema, 'Event')
