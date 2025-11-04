import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import socket from '../utils/socket';
import { UserDataContext } from '../context/UserContext';
import Button from './Button';

const ConfirmRide = (props) => {
  const { user } = useContext(UserDataContext);
  
  // Get dynamic fare from localStorage
  const selectedFare = localStorage.getItem('selectedFare') || 
                       localStorage.getItem('fareCar') || 
                       localStorage.getItem('fareBase') || 
                       '199';
  
  // Get pickup and dropoff addresses from localStorage
  const pickupAddress = localStorage.getItem('pickupAddress') || 'Pickup Location';
  const dropoffAddress = localStorage.getItem('dropoffAddress') || 'Dropoff Location';
  
  // Determine selected vehicle image (from selection, with fallback by type)
  const selectedVehicleType = (localStorage.getItem('selectedVehicleType') || 'car').toLowerCase();
  const defaultVehicleImages = {
    car: 'https://www.kumho.com.au/images/car-category/passenger-updated.png',
    bike: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEBUREBIVFhUXFRYVFxcVGBYXFRUXFRUXGBgWFxgYICggGBolHRUVIjEhJSorLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGi0mICUvLTYyMC0vLTA2Kys1Li01Ly0vLS0tLi03LS8tLS0tLS8tLy0tLy0tKy0vLS0tNTUtMv/AABEIALcBEwMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABwECAwUGBAj/xABBEAABAwIDBQUECAQFBQEAAAABAAIDBBEFEiEGBzFBURMiYXGBFDKRoSNCUmKCkrHBctHh8BUzQ7LCJJOis8MI/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAIDBAEF/8QAKxEBAAICAQIFBAEFAQAAAAAAAAECAxEhBBITIjFBUXGRsfDBMkJh0eEz/9oADAMBAAIRAxEAPwCc',
    auto: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEBUTEhIVFRUQFRAVEBYWFRUVFRUVFhcXFhcXFhYYHSggGBolGxUVITEhJSkrLi4uGB8zODMtNygtLisBCgoKDg0OGhAQGi0lHyUtLS0vLy0tLS8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBEQACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQIEBQYDBwj/xABBEAACAQIDBAcFBAgGAwEAAAAAAQIDEQQFMQYSIUEyUWFxgZGhBxMiQrFSgsHRFCMkM3KywuEVQ2J0kvA0c6IW/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAECAwQFBv/EADgRAQACAQIEBAMGBAYDAQAAAAABAgMEEQUSITEyQVFxIoGxEzNCkaHRFGHB4RUjUmJy8CQ00gb/2gAMAwEAAhEDEQA/APc'
  };
  const selectedVehicleImage = localStorage.getItem('selectedVehicleImage') || defaultVehicleImages[selectedVehicleType] || defaultVehicleImages.car;
  
  const handleConfirmRide = () => {
    // Get ride details from localStorage and props
    const pickupAddress = localStorage.getItem('pickupAddress') || 'Pickup Location';
    const dropoffAddress = localStorage.getItem('dropoffAddress') || 'Dropoff Location';
    const pickupLat = localStorage.getItem('pickupLat');
    const pickupLng = localStorage.getItem('pickupLng');
    const dropoffLat = localStorage.getItem('dropoffLat');
    const dropoffLng = localStorage.getItem('dropoffLng');
    const vehicleType = localStorage.getItem('selectedVehicleType') || 'Car';
    const userName = user?.fullname?.firstname || localStorage.getItem('userName') || 'User';
    
    // Store userName for later use
    if (user?.fullname?.firstname) {
      localStorage.setItem('userName', user.fullname.firstname);
    }
    
    // Generate a unique ride ID
    const rideId = `ride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Broadcast ride request to all online drivers
    // Backend expects: { rideId, pickup, dropoff, user, fare }
    const rideData = {
      rideId,
      pickup: {
        lat: parseFloat(pickupLat),
        lng: parseFloat(pickupLng),
        address: pickupAddress
      },
      dropoff: {
        lat: parseFloat(dropoffLat),
        lng: parseFloat(dropoffLng),
        address: dropoffAddress
      },
      user: {
        _id: user?._id,
        name: userName
      },
      fare: selectedFare,
      vehicleType,
      timestamp: Date.now()
    };
    
    console.log('Broadcasting ride request:', rideData);
    socket.emit('ride:broadcast', rideData);
    
    // Join the ride room to receive acceptance notifications
    socket.emit('ride:join', { rideId });
    console.log(`User joined ride room: ride:${rideId}`);
    
    // Store ride ID for later
    localStorage.setItem('currentRideId', rideId);
    
    // Update UI to show "Looking for driver"
    props.setVehicleFound(true);
    props.setConfirmRidePanel(false);
  };
  
  return (
    <div>
      <motion.h5
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
        onClick={() => {props.setConfirmRidePanel(false)}}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </motion.h5>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className='text-2xl font-bold mb-6 mt-0 flex items-center gap-2'>
          <i className="ri-check-double-line text-accent-green-600"></i>
          Confirm your Ride
        </h3>

        <div className='flex flex-col gap-4 items-center'>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className='h-24 drop-shadow-lg'
            src={selectedVehicleImage}
            alt='Vehicle'
          />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='w-full mt-2 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden'
          >
            {/* Pickup address */}
            <motion.div 
              whileHover={{ backgroundColor: 'rgb(249 250 251)' }}
              className='flex items-center gap-4 p-4 border-b border-gray-200'
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <i className="text-xl ri-map-pin-user-fill text-primary-600"></i>
              </div>
              <div className="flex-1">
                <h3 className='text-base font-semibold text-gray-900'>Pickup</h3>
                <p className='text-sm text-gray-600'>{pickupAddress}</p>
              </div>
            </motion.div>

            {/* Destination address */}
            <motion.div 
              whileHover={{ backgroundColor: 'rgb(249 250 251)' }}
              className='flex items-center gap-4 p-4 border-b border-gray-200'
            >
              <div className="w-10 h-10 rounded-full bg-accent-green-100 flex items-center justify-center">
                <i className="text-xl ri-map-pin-2-fill text-accent-green-600"></i>
              </div>
              <div className="flex-1">
                <h3 className='text-base font-semibold text-gray-900'>Destination</h3>
                <p className='text-sm text-gray-600'>{dropoffAddress}</p>
              </div>
            </motion.div>

            {/* Price */}
            <motion.div 
              whileHover={{ backgroundColor: 'rgb(249 250 251)' }}
              className='flex items-center gap-4 p-4'
            >
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <i className="text-xl ri-money-rupee-circle-fill text-yellow-600"></i>
              </div>
              <div className="flex-1">
                <h3 className='text-lg font-bold text-gray-900'>₹{selectedFare}</h3>
                <p className='text-sm text-gray-600'>Cash Payment</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <Button
              onClick={handleConfirmRide}
              variant="success"
              fullWidth
              icon="ri-check-line"
            >
              Confirm Ride
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmRide;
