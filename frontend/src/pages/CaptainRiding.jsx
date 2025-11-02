import React, { useState, useRef, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import appLogo3 from '../assets/app logo3.png'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import FinishRide from '../Components/FinishRide'
import CaptainMap from '../Components/CaptainMap'
import { useSocket } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false)
  const finishRidePanelRef = useRef(null)
  const location = useLocation()
  const { socket, isConnected } = useSocket()
  const { captain } = useContext(CaptainDataContext)
  const [rideData, setRideData] = useState(location.state?.rideData || null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const locationIntervalRef = useRef(null)
  
  // Sample pickup and dropoff locations - replace with actual data from your ride context
  const pickupLocation = rideData?.pickup || {
    lat: 28.6139,
    lng: 77.2090,
    address: "Pickup Point - Connaught Place, New Delhi"
  }
  
  const dropoffLocation = rideData?.destination || {
    lat: 28.5355,
    lng: 77.3910,
    address: "Drop-off Point - Noida Sector 18"
  }

  // Get and broadcast current location
  useEffect(() => {
    if (!socket || !isConnected || !captain?._id) return

    console.log('Setting up location tracking for captain:', captain._id)

    // Function to get and send current location
    const updateLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            setCurrentLocation(location)

            // Emit location update to server
            socket.emit('update:location', {
              captainId: captain._id,
              location,
              rideId: rideData?._id
            })

            console.log('Location updated:', location)
          },
          (error) => {
            console.error('Error getting location:', error)
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        )
      }
    }

    // Update location immediately
    updateLocation()

    // Update location every 5 seconds
    locationIntervalRef.current = setInterval(updateLocation, 5000)

    // Join ride room if we have ride data
    if (rideData?._id) {
      socket.emit('join:ride', rideData._id)
    }

    // Cleanup
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current)
      }
      if (rideData?._id) {
        socket.emit('leave:ride', rideData._id)
      }
    }
  }, [socket, isConnected, captain, rideData?._id])
  
  useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: 'translateY(0)',
        duration: 0.4,
        ease: 'power2.out'
      })
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: 'translateY(100%)',
        duration: 0.4,
        ease: 'power2.in'
      })
    }
  }, [finishRidePanel])

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      
      {/* Top bar */}
      <div className="fixed top-0 left-0 w-full p-3 flex items-center justify-between z-10 bg-transparent">
        <img src={appLogo3} alt="Safar Logo" className="w-20" />

        {/* Connection Status */}
        {!isConnected && (
          <div className='bg-red-500 text-white px-3 py-1 rounded-lg text-sm'>
            <i className='ri-wifi-off-line mr-1'></i>
            Offline
          </div>
        )}

        {/* Logout icon */}
        <Link
          to="/captainlogin"
          className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow-md"
        >
          <i className="text-lg ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Current Location Indicator */}
      {currentLocation && (
        <div className='fixed top-16 left-3 bg-white px-3 py-2 rounded-lg shadow-md z-10'>
          <div className='flex items-center gap-2'>
            <i className='ri-map-pin-user-fill text-green-600'></i>
            <p className='text-xs text-gray-600'>
              Broadcasting location
            </p>
          </div>
        </div>
      )}

      {/* Map with route, pickup and dropoff */}
      <div className="flex-1">
        <CaptainMap
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          showRoute={true}
          autoFitBounds={true}
        />
      </div>

      {/* Bottom ride details card */}
      <div className="h-[110px] bg-yellow-400 rounded-t-2xl shadow-lg p-4  flex flex-col"
        onClick={() => {setFinishRidePanel(true)}}>
        
        {/* Drag handle arrow */}
        <div className="w-full flex justify-center -mt-2">
          <i className="text-2xl text-gray-700 ri-arrow-up-s-line"></i>
        </div>

        {/* Content row */}
        <div className="flex items-center justify-between mt-2">
          <h4 className="text-xl py-2 px-6 font-semibold text-gray-900"> 4 Km Away</h4>
          <button className="bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 px-6 rounded-lg shadow-md">
            Complete Ride
          </button>
        </div>
        
      </div>
      <div
        ref={finishRidePanelRef}
        className='fixed w-full z-10 bottom-0 bg-white px-3 py-10 translate-y-full rounded-t-xl shadow-lg'
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} rideData={rideData}/>
      </div>      
    </div>
  )
}

export default CaptainRiding

