import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import appLogo3 from '../assets/app logo3.png'
import CaptainDetails from '../Components/CaptainDetails'
import RidePopUp from '../Components/RidePopUp'
import ConfirmRidePopUp from '../Components/ConfirmRidePopUp'
import CaptainMap from '../Components/CaptainMap'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import socket from '../utils/socket'

const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false)
  const ridePopUpPanelRef = useRef(null)

  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)
  const confirmRidePopUpPanelRef = useRef(null)

  // Store current ride request data
  const [currentRide, setCurrentRide] = useState(null)
  
  // Load accepted ride data from localStorage for map display
  const [acceptedRide, setAcceptedRide] = useState(null)

  useEffect(() => {
    // Check if there's an accepted ride in localStorage
    const storedRide = localStorage.getItem('currentRide')
    if (storedRide) {
      try {
        const rideData = JSON.parse(storedRide)
        setAcceptedRide(rideData)
        console.log('📍 Loaded accepted ride for map:', rideData)
      } catch (e) {
        console.error('Error parsing stored ride:', e)
      }
    }
  }, [confirmRidePopUpPanel]) // Reload when OTP screen opens/closes

  // Connect to Socket.IO as captain and listen for new ride requests
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Register captain as online with initial location
      socket.emit('captain:online', { token });
      console.log('Captain connected to socket.io');
    }

    const onRideNew = (payload) => {
      // Store ride data and open the ride popup
      console.log('🚗 New ride request received:', payload);
      setCurrentRide(payload);
      setRidePopUpPanel(true);
      
      // Play notification sound (optional)
      // new Audio('/notification.mp3').play().catch(e => console.log('Audio play failed'));
    };

    const onRideTaken = (payload) => {
      // Another driver accepted this ride, close the popup
      console.log('Ride taken by another driver:', payload.rideId);
      if (currentRide?.rideId === payload.rideId) {
        setRidePopUpPanel(false);
        setCurrentRide(null);
      }
    };

    socket.on('ride:new', onRideNew);
    socket.on('ride:taken', onRideTaken);

    return () => {
      socket.off('ride:new', onRideNew);
      socket.off('ride:taken', onRideTaken);
    };
  }, [currentRide])

  // Animate Ride Popup
  useGSAP(() => {
    if (!ridePopUpPanelRef.current) return
    if (ridePopUpPanel) {
      gsap.to(ridePopUpPanelRef.current, {
        transform: 'translateY(0)',
        duration: 0.4,
        ease: 'power2.out'
      })
    } else {
      gsap.to(ridePopUpPanelRef.current, {
        transform: 'translateY(100%)',
        duration: 0.4,
        ease: 'power2.in'
      })
    }
  }, [ridePopUpPanel])

  // Animate Confirm Ride Popup
  useGSAP(() => {
    if (!confirmRidePopUpPanelRef.current) return
    if (confirmRidePopUpPanel) {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: 'translateY(0)',
        duration: 0.4,
        ease: 'power2.out'
      })
    } else {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: 'translateY(100%)',
        duration: 0.4,
        ease: 'power2.in'
      })
    }
  }, [confirmRidePopUpPanel])

  return (
    <div className='h-screen flex flex-col overflow-hidden bg-gray-50'>
      {/* Top bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='fixed top-0 left-0 w-full p-4 flex items-center justify-between z-10 bg-gradient-to-b from-white via-white to-transparent'
      >
        <motion.img 
          whileHover={{ scale: 1.05 }}
          src={appLogo3} 
          alt='Safar Captain Logo' 
          className='w-24 drop-shadow-lg' 
        />

        {/* Status badge and logout */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="px-3 py-1.5 bg-green-100 border border-green-300 rounded-full flex items-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-700">Online</span>
          </motion.div>

          <Link to='/captain/logout'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:bg-red-50 hover:border-red-200 transition-all group'
            >
              <i className='text-xl ri-logout-box-r-line text-gray-600 group-hover:text-red-600 transition-colors'></i>
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* OpenStreetMap - Captain's current location */}
      <div className='h-3/5 relative'>
        <CaptainMap 
          pickupLocation={acceptedRide?.pickup ? {
            lat: acceptedRide.pickup.lat,
            lng: acceptedRide.pickup.lng,
            address: acceptedRide.pickup.address
          } : null}
          dropoffLocation={acceptedRide?.dropoff ? {
            lat: acceptedRide.dropoff.lat,
            lng: acceptedRide.dropoff.lng,
            address: acceptedRide.dropoff.address
          } : null}
          showRoute={!!acceptedRide}
          autoFitBounds={!!acceptedRide}
        />
      </div>

      {/* Bottom card */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className='h-2/5 bg-white rounded-t-3xl shadow-2xl p-6 flex flex-col border-t border-gray-100'
      >
        <CaptainDetails />
      </motion.div>

      {/* Ride Popup */}
      <motion.div
        ref={ridePopUpPanelRef}
        className='fixed w-full z-10 bottom-0 bg-white px-3 py-10 translate-y-full rounded-t-3xl shadow-2xl'
      >
        <RidePopUp
          rideData={currentRide}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </motion.div>

      {/* Confirm Ride Popup */}
      <motion.div
        ref={confirmRidePopUpPanelRef}
        className='fixed w-full h-screen z-10 bottom-0 bg-white px-3 py-10 translate-y-full rounded-t-3xl shadow-2xl'
      >
        <ConfirmRidePopUp
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </motion.div>
    </div>
  )
}

export default CaptainHome
