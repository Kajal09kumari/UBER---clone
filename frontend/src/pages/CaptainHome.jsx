import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import appLogo3 from '../assets/app logo3.png'
import CaptainDetails from '../Components/CaptainDetails'
import RidePopUp from '../Components/RidePopUp'
import ConfirmRidePopUp from '../Components/ConfirmRidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useSocket } from '../context/SocketContext'

const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false)
  const ridePopUpPanelRef = useRef(null)

  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)
  const confirmRidePopUpPanelRef = useRef(null)

  const [currentRideRequest, setCurrentRideRequest] = useState(null)
  const { socket, isConnected, on, off, emit } = useSocket()

  // Setup Socket.io listeners for real-time ride requests
  useEffect(() => {
    if (!isConnected) return

    // Listen for new ride requests
    const handleNewRideRequest = (rideData) => {
      console.log('New ride request received:', rideData)
      setCurrentRideRequest(rideData)
      setRidePopUpPanel(true)
      
      // Optional: Play notification sound or show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Ride Request!', {
          body: `Pickup: ${rideData.pickup?.address || 'Unknown location'}`,
          icon: '/app-icon.png'
        })
      }
    }

    // Listen for ride cancellations
    const handleRideCancelled = (data) => {
      console.log('Ride cancelled:', data)
      if (currentRideRequest?.rideId === data.rideId) {
        setCurrentRideRequest(null)
        setRidePopUpPanel(false)
        setConfirmRidePopUpPanel(false)
      }
    }

    on('ride:new-request', handleNewRideRequest)
    on('ride:cancelled', handleRideCancelled)

    // Mark captain as available when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        emit('captain:available', {
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        })
      })
    }

    // Cleanup listeners on unmount
    return () => {
      off('ride:new-request', handleNewRideRequest)
      off('ride:cancelled', handleRideCancelled)
    }
  }, [isConnected, on, off, emit, currentRideRequest])

  // Update captain's location periodically
  useEffect(() => {
    if (!isConnected) return

    const locationInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          emit('captain:location-update', {
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            rideId: currentRideRequest?.rideId || null
          })
        })
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(locationInterval)
  }, [isConnected, emit, currentRideRequest])

  // Handle ride acceptance
  const handleAcceptRide = () => {
    if (currentRideRequest) {
      emit('captain:accept-ride', {
        rideId: currentRideRequest.rideId,
        userId: currentRideRequest.userId
      })
      setRidePopUpPanel(false)
      setConfirmRidePopUpPanel(true)
    }
  }

  // Handle ride rejection
  const handleRejectRide = () => {
    if (currentRideRequest) {
      emit('captain:reject-ride', {
        rideId: currentRideRequest.rideId
      })
      setCurrentRideRequest(null)
      setRidePopUpPanel(false)
    }
  }

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
      {/* Socket Connection Status Indicator */}
      {!isConnected && (
        <div className='fixed top-16 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-md z-50'>
          Connecting to server...
        </div>
      )}

      {/* Top bar */}
      <div className='fixed top-0 left-0 w-full p-3 flex items-center justify-between z-10 -mt-2'>
        <img src={appLogo3} alt='Safar Logo' className='w-24' />

        {/* Logout icon */}
        <Link
          to='/captain/logout'
          className='h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 bg-white'
        >
          <i className='text-lg ri-logout-box-r-line'></i>
        </Link>
      </div>

      {/* Top background */}
      <div className='h-3/5'>
        <img
          className='h-full w-full object-cover'
          src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif'
          alt=''
        />
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
          rideData={currentRideRequest}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          onAccept={handleAcceptRide}
          onReject={handleRejectRide}
        />
      </div>

      {/* Confirm Ride Popup */}
      <div
        ref={confirmRidePopUpPanelRef}
        className='fixed w-full h-screen z-10 bottom-0 bg-white px-3 py-10 translate-y-full rounded-t-xl shadow-lg'
      >
        <ConfirmRidePopUp
          rideData={currentRideRequest}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>
    </div>
  )
}

export default CaptainHome
