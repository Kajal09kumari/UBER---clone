import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import Button from './ui/Button'

const RidePopUp = (props) => {
  const { socket } = useContext(CaptainDataContext) || {};
  return (
    <div>
      {/* Close Button */}
      <h5
        className='p-1 text-center w-[93%] absolute top-0'
        onClick={() => props.setRidePopUpPanel(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className='text-2xl font-semibold mb-5 mt-0'>New Ride Available!</h3>

      {/* Rider Info */}
      <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
        <div className='flex items-center gap-3'>
          <img
            className='h-12 w-12 rounded-full object-cover'
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            alt="rider"
          />
          <h2 className='text-xl font-medium'>Harshita</h2>
        </div>
        <h5 className='text-lg font-semibold'>2.2 KM</h5>
      </div>

      {/* Ride Details */}
      <div className='flex flex-col gap-2 items-center'>
        <div className='w-full mt-5'>
          {/* Pickup */}
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>562/11-A</h3>
              <p className='text-sm -mt-1 text-gray-600'>Kankariya Tablab, Delhi</p>
            </div>
          </div>

          {/* Destination */}
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
        </div>

        {/* Actions */}
        <div className='flex items-center justify-between w-full mt-5 gap-3'>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => props.setRidePopUpPanel(false)}
          >
            Ignore
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              // Emit acceptRide to server so it can notify the user
              try {
                const ride = { /* minimal ride info; in real app include rideId */ };
                const userId = 'anonymous';
                if (socket && socket.connected) {
                  socket.emit('acceptRide', { rideId: ride.id || null, userId, captain: { id: socket.id, name: 'Captain' } });
                  // Also emit a sample driverLocation once
                  socket.emit('driverLocation', { userId, location: { lat: 28.6139, lng: 77.2090 } });
                }
              } catch (e) {
                console.error('emit acceptRide failed', e);
              }

              props.setConfirmRidePopUpPanel(true)
              props.setRidePopUpPanel(false)
            }}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RidePopUp
