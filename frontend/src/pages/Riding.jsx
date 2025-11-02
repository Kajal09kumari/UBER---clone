import React, { useEffect, useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'

const Riding = () => {
  const location = useLocation()
  const { socket, isConnected } = useSocket()
  const { user } = useContext(UserDataContext)
  const [driverLocation, setDriverLocation] = useState(null)
  const [rideData, setRideData] = useState(location.state?.rideData || null)

  useEffect(() => {
    if (!socket || !isConnected || !user?._id) return

    console.log('Setting up socket listeners for user:', user._id)

    // Join user room
    socket.emit('join:user', user._id)

    // If we have ride data, join the ride room
    if (rideData?._id) {
      socket.emit('join:ride', rideData._id)
    }

    // Listen for ride acceptance
    socket.on('ride:accepted', (data) => {
      console.log('Ride accepted by captain:', data)
      setRideData(prev => ({ ...prev, ...data }))
      
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Driver Found!', {
          body: `${data.captain?.name || 'A driver'} is on the way!`,
          icon: '/app-icon.png'
        })
      }
    })

    // Listen for driver location updates
    socket.on('location:updated', (data) => {
      console.log('Driver location updated:', data)
      setDriverLocation(data.location)
    })

    // Listen for ride status updates
    socket.on('ride:status-update', (data) => {
      console.log('Ride status updated:', data)
      setRideData(prev => ({ ...prev, status: data.status }))
      
      // Show notification for important status changes
      if (data.status === 'arrived') {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Driver Arrived!', {
            body: 'Your driver has arrived at the pickup location',
            icon: '/app-icon.png'
          })
        }
      }
    })

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Cleanup
    return () => {
      socket.off('ride:accepted')
      socket.off('location:updated')
      socket.off('ride:status-update')
      if (rideData?._id) {
        socket.emit('leave:ride', rideData._id)
      }
    }
  }, [socket, isConnected, user, rideData?._id])

  return (
    <div className='h-screen flex flex-col'>
        <Link to='/home'className='fixed right-3 top-3 h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md z-10'>
            <i className=" text-xl font-medium ri-home-5-line"></i>
        </Link>

        {/* Connection Status Indicator */}
        {!isConnected && (
          <div className='fixed top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'>
            <i className='ri-wifi-off-line mr-2'></i>
            Connection lost...
          </div>
        )}

        {/* Ride Status Indicator */}
        {rideData?.status && (
          <div className='fixed top-3 left-3 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-10'>
            <span className='capitalize'>{rideData.status}</span>
          </div>
        )}
      {/* Top: background */}
      <div className='h-1/2'>
        <img
          className='h-full w-full object-cover'
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
        {/* Show driver location if available */}
        {driverLocation && (
          <div className='absolute top-24 left-3 bg-white px-3 py-2 rounded-lg shadow-md'>
            <p className='text-xs text-gray-600'>
              Driver Location: {driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)}
            </p>
          </div>
        )}
      </div>

      {/* Bottom: ride details */}
      <div className='h-1/2 p-4 flex flex-col justify-between'>
        <div>
          <div className='flex items-center justify-between'>
            <img
              className='h-20'
              src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_552,w_552/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a9c47/original/Final_UberX.png'
              alt='car'
            />
            <div className='text-right'>
              <h2 className='text-lg font-medium'>{rideData?.captain?.name || 'Kajal'}</h2>
              <h4 className='text-xl font-semibold -mt-1 -mb-1'>{rideData?.captain?.vehicle?.plate || 'DL 9C AZ 8855'}</h4>
              <p className='text-sm text-gray-600'>{rideData?.captain?.vehicle?.model || 'Tata Tigor'}</p>
            </div>
          </div>

          <div className='w-full mt-5'>


            {/* Destination address */}
            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>{rideData?.destination?.address || '562/11-A'}</h3>
                <p className='text-sm -mt-1 text-gray-600'>{rideData?.destination?.area || 'Kankariya Tablab, Delhi'}</p>
              </div>
            </div>

            {/* Price */}
            <div className='flex items-center gap-5 p-3'>
              <i className="text-lg ri-currency-line"></i>
              <div>
                <h3 className='text-lg font-medium'>₹{rideData?.fare || '199'}</h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash</p>
              </div>
            </div>
          </div>
        </div>

        <button className='w-full mt-4 bg-green-600 text-white font-semibold p-3 rounded-lg'>
          Make a Payment
        </button>
      </div>
    </div>
  );
}

export default Riding
