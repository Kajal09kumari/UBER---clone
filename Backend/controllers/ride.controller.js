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

// POST /rides/estimate
// body: { pickup: { lat, lng }, destination: { lat, lng } }
module.exports.estimateFare = async (req, res, next) => {
  try {
    const { pickup, destination } = req.body;
    if (!pickup || !destination || !pickup.lat || !pickup.lng || !destination.lat || !destination.lng) {
      return res.status(400).json({ message: 'pickup and destination coordinates are required' });
    }

    // Haversine formula to calculate distance
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(destination.lat - pickup.lat);
    const dLon = toRad(destination.lng - pickup.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(pickup.lat)) * Math.cos(toRad(destination.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    // Fare calculation: base fare + per km rate, with minimum fare
    const baseFare = 40; // base fare in currency units
    const perKm = 10; // rate per km
    const rawFare = baseFare + distanceKm * perKm;
    const fare = Math.max(rawFare, 50); // minimum fare of 50

    return res.status(200).json({ 
      distanceKm: Number(distanceKm.toFixed(2)), 
      fare: Number(fare.toFixed(2)) 
    });
  } catch (err) {
    next(err);
  }
};

