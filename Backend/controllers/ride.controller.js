const { validationResult } = require('express-validator');

// POST /rides/request
// body: { userId, pickup: { lat, lng, text }, destination: { lat, lng, text }, passengerCount }
module.exports.requestRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, pickup, destination, passengerCount = 1 } = req.body;

    if (!userId || !pickup || !destination) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // In a real app we'd create a Ride document and run geo queries to find nearby captains.
    // For now emit a 'newRide' event to all connected captains (room: 'captains')
    const io = req.app.get('io');
    const rideData = { userId, pickup, destination, passengerCount, createdAt: new Date() };

    if (io) {
      // Emit to a dedicated captains room. Captains should join this room on connect or login.
      io.to('captains').emit('newRide', rideData);
    }

    return res.status(201).json({ message: 'Ride requested', ride: rideData });
  } catch (err) {
    next(err);
  }
};
