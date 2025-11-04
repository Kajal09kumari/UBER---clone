import React from 'react'
import { motion } from 'framer-motion'
import LoadingSpinner from './LoadingSpinner'

const LookingForDriver = (props) => {
  // Get dynamic fare from localStorage
  const selectedFare = localStorage.getItem('selectedFare') || 
                       localStorage.getItem('fareCar') || 
                       localStorage.getItem('fareBase') || 
                       '199';
  
  // Get pickup and dropoff addresses from localStorage
  const pickupAddress = localStorage.getItem('pickupAddress') || 'Pickup Location';
  const dropoffAddress = localStorage.getItem('dropoffAddress') || 'Dropoff Location';
  
  return (
    <div>
      <motion.h5
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
        onClick={() => {props.setVehicleFound(false)}}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </motion.h5>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <LoadingSpinner size="md" />
          <h3 className='text-2xl font-bold'>Looking for a Driver</h3>
        </div>

        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
          className="bg-gradient-to-br from-primary-50 to-accent-green-50 p-4 rounded-2xl mb-6 border border-primary-200"
        >
          <p className="text-center text-gray-700 font-medium">
            🔍 Searching for nearby drivers...
          </p>
          <p className="text-center text-sm text-gray-600 mt-1">
            This usually takes less than a minute
          </p>
        </motion.div>

        <div className='flex flex-col gap-4 items-center'>
          <motion.img
            animate={{ 
              y: [0, -10, 0],
              rotate: [-2, 2, -2]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut"
            }}
            className='h-24 drop-shadow-lg'
            src='https://www.kumho.com.au/images/car-category/passenger-updated.png'
            alt='Vehicle'
          />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='w-full mt-2 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden'
          >
            {/* Pickup address */}
            <div className='flex items-center gap-4 p-4 border-b border-gray-200'>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <i className="text-xl ri-map-pin-user-fill text-primary-600"></i>
              </div>
              <div className="flex-1">
                <h3 className='text-base font-semibold text-gray-900'>Pickup</h3>
                <p className='text-sm text-gray-600'>{pickupAddress}</p>
              </div>
            </div>

            {/* Destination address */}
            <div className='flex items-center gap-4 p-4 border-b border-gray-200'>
              <div className="w-10 h-10 rounded-full bg-accent-green-100 flex items-center justify-center">
                <i className="text-xl ri-map-pin-2-fill text-accent-green-600"></i>
              </div>
              <div className="flex-1">
                <h3 className='text-base font-semibold text-gray-900'>Destination</h3>
                <p className='text-sm text-gray-600'>{dropoffAddress}</p>
              </div>
            </div>

            {/* Price */}
            <div className='flex items-center gap-4 p-4'>
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <i className="text-xl ri-money-rupee-circle-fill text-yellow-600"></i>
              </div>
              <div className="flex-1">
                <h3 className='text-lg font-bold text-gray-900'>₹{selectedFare}</h3>
                <p className='text-sm text-gray-600'>Cash Payment</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>    
  )
}

export default LookingForDriver