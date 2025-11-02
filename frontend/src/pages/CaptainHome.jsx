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

  const [newRideRequest, setNewRideRequest] = useState(null)
  const { socket, isConnected } = useSocket()
  const { captain } = useContext(CaptainDataContext)

  // Socket.io event listeners
  useEffect(() => {
    if (!socket || !isConnected || !captain?._id) return

    console.log('Setting up socket listeners for captain:', captain._id)

    // Join captain room
    socket.emit('join:captain', captain._id)
    socket.emit('captain:availability', { captainId: captain._id, isAvailable: true })

    // Listen for new ride requests
    const handleNewRideRequest = (rideData) => {
      console.log('New ride request received:', rideData)
      setNewRideRequest(rideData)
      setRidePopUpPanel(true)
      
      // Optional: Play notification sound or show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Ride Request!', {
          body: `Pickup: ${rideData.pickup.address}`,
          icon: '/app-icon.png'
        })
      }
    }

    socket.on('ride:new-request', handleNewRideRequest)

    // Listen for ride cancellations
    socket.on('ride:cancelled', (data) => {
      console.log('Ride cancelled:', data)
      setRidePopUpPanel(false)
      setConfirmRidePopUpPanel(false)
      setNewRideRequest(null)
    })

    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Cleanup
    return () => {
      socket.off('ride:new-request', handleNewRideRequest)
      socket.off('ride:cancelled')
      socket.emit('captain:availability', { captainId: captain._id, isAvailable: false })
    }
  }, [socket, isConnected, captain])

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

        {/* Logout icon */}
        <Link
          to='/captain/logout'
          className='h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 bg-white'
        >
          <i className='text-lg ri-logout-box-r-line'></i>
        </Link>
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
          rideData={newRideRequest}
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
          rideData={newRideRequest}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>

      {/* Connection Status Indicator */}
      {!isConnected && (
        <div className='fixed top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'>
          <i className='ri-wifi-off-line mr-2'></i>
          Connection lost... Reconnecting...
        </div>
      )}
    </div>
  )
}

export default CaptainHome
