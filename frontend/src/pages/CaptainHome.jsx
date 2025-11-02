import React, { useState, useRef, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import appLogo3 from '../assets/app logo3.png'
import CaptainDetails from '../Components/CaptainDetails'
import RidePopUp from '../Components/RidePopUp'
import ConfirmRidePopUp from '../Components/ConfirmRidePopUp'
import CaptainMap from '../Components/CaptainMap'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useSocket } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false)
  const ridePopUpPanelRef = useRef(null)

  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)
  const confirmRidePopUpPanelRef = useRef(null)

  const [currentRide, setCurrentRide] = useState(null)
  const { socket, connected, joinRoom, updateCaptainLocation } = useSocket()
  const { captain } = useContext(CaptainDataContext)

  // Join socket room when captain is available
  useEffect(() => {
    if (captain && captain._id && connected) {
      joinRoom(captain._id, 'captain')
    }
  }, [captain, connected, joinRoom])

  // Listen for new ride requests
  useEffect(() => {
    if (!socket || !connected) return

    const handleNewRideRequest = (rideData) => {
      console.log('New ride request received:', rideData)
      setCurrentRide(rideData)
      setRidePopUpPanel(true)
      
      // Optional: Play notification sound or show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Ride Request', {
          body: `Pickup: ${rideData.pickup.address}`,
          icon: '/app-icon.png'
        })
      }
    }

    socket.on('new-ride-request', handleNewRideRequest)

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      socket.off('new-ride-request', handleNewRideRequest)
    }
  }, [socket, connected])

  // Update captain's location periodically
  useEffect(() => {
    if (!captain || !captain._id || !connected) return

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            updateCaptainLocation(captain._id, { lat: latitude, lng: longitude })
          },
          (error) => {
            console.error('Error getting location:', error)
          },
          { enableHighAccuracy: true }
        )
      }
    }

    // Update location immediately
    updateLocation()

    // Update location every 10 seconds
    const locationInterval = setInterval(updateLocation, 10000)

    return () => {
      clearInterval(locationInterval)
    }
  }, [captain, connected, updateCaptainLocation])

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
    <div className='h-screen flex flex-col overflow-hidden'>
      {/* Top bar */}
      <div className='fixed top-0 left-0 w-full p-3 flex items-center justify-between z-10 -mt-2'>
        <img src={appLogo3} alt='Safar Logo' className='w-24' />

        {/* Connection status indicator */}
        <div className='flex items-center gap-2'>
          <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          
          {/* Logout icon */}
          <Link
            to='/captain/logout'
            className='h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 bg-white'
          >
            <i className='text-lg ri-logout-box-r-line'></i>
          </Link>
        </div>
      </div>

      {/* OpenStreetMap - Captain's current location */}
      <div className='h-3/5'>
        <CaptainMap />
      </div>

      {/* Bottom card */}
      <div className='h-2/5 bg-white rounded-t-xl shadow-md p-4 flex flex-col'>
        <CaptainDetails />
      </div>

      {/* Ride Popup */}
      <div
        ref={ridePopUpPanelRef}
        className='fixed w-full z-10 bottom-0 bg-white px-3 py-10 translate-y-full rounded-t-xl shadow-lg'
      >
        <RidePopUp
          ride={currentRide}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>

      {/* Confirm Ride Popup */}
      <div
        ref={confirmRidePopUpPanelRef}
        className='fixed w-full h-screen z-10 bottom-0 bg-white px-3 py-10 translate-y-full rounded-t-xl shadow-lg'
      >
        <ConfirmRidePopUp
          ride={currentRide}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>
    </div>
  )
}

export default CaptainHome
