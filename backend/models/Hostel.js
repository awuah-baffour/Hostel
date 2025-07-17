const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  campus: { type: String, required: true, enum: ['STU', 'UENR', 'Other'] },
  description: String,
  roomTypes: [{
    name: String,
    price: Number,
    capacity: Number,
    available: Number
  }]
});

module.exports = mongoose.model('Hostel', hostelSchema);