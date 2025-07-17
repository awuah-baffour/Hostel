const Booking = require('../models/Booking');
const Hostel = require('../models/Hostel');

exports.createBooking = async (req, res) => {
  try {
    const { userId, hostelId, roomType } = req.body;
    
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    const room = hostel.roomTypes.find(r => r.name === roomType);
    if (!room) {
      return res.status(404).json({ message: 'Room type not found' });
    }
    
    if (room.available <= 0) {
      return res.status(400).json({ message: 'No rooms available' });
    }
    
    const booking = new Booking({
      user: userId,
      hostel: hostelId,
      roomType,
      amount: room.price
    });
    
    await booking.save();
    
    room.available -= 1;
    await hostel.save();
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate('hostel', 'name');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};