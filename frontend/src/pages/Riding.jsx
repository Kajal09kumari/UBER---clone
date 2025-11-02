import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import socket from '../utils/socket'

const Riding = () => {
  const [driverLocation, setDriverLocation] = useState(null)

  useEffect(() => {
    const rideId = localStorage.getItem('rideId')
    if (rideId) {
      socket.emit('ride:join', { rideId })
    }
    const onDriverLocation = (payload) => {
      // only handle if matches rideId (if provided)
      if (rideId && payload.rideId && payload.rideId !== rideId) return
      setDriverLocation({ lat: payload.lat, lng: payload.lng })
      // for debugging
      console.log('driver:location', payload)
    }
    socket.on('driver:location', onDriverLocation)
    return () => {
      socket.off('driver:location', onDriverLocation)
    }
  }, [])
  return (
    <div className='h-screen flex flex-col'>
        <Link to='/home'className='fixed right-3 top-3 h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md'>
            <i className=" text-xl font-medium ri-home-5-line"></i>
        </Link>
      {/* Top: background */}
      <div className='h-1/2'>
        <img
          className='h-full w-full object-cover'
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
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
              <h2 className='text-lg font-medium'>Kajal</h2>
              <h4 className='text-xl font-semibold -mt-1 -mb-1'>DL 9C AZ 8855</h4>
              <p className='text-sm text-gray-600'>Tata Tigor</p>
            </div>
          </div>

          <div className='w-full mt-5'>


            {/* Destination address */}
            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>562/11-A</h3>
                <p className='text-sm -mt-1 text-gray-600'>Kankariya Tablab, Delhi</p>
              </div>
            </div>

            {/* Price */}
            <div className='flex items-center gap-5 p-3'>
              <i className="text-lg ri-currency-line"></i>
              <div>
                <h3 className='text-lg font-medium'>₹199</h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash</p>
              </div>
            </div>

            {driverLocation && (
              <div className='mt-2 p-3 rounded-md bg-blue-50 text-blue-700 text-sm'>
                Live driver location: {driverLocation.lat.toFixed(5)}, {driverLocation.lng.toFixed(5)}
              </div>
            )}
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
