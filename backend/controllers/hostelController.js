const Hostel = require('../models/Hostel');

exports.getHostels = async (req, res) => {
  try {
    const { campus } = req.query;
    const query = campus ? { campus } : {};
    const hostels = await Hostel.find(query);
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};