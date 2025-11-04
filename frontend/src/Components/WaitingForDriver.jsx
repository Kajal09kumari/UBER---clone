import React from 'react'
import { motion } from 'framer-motion'

const WaitingForDriver = (props) => {
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
        onClick={() => {props.setWaitingForDriver(false)}}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </motion.h5>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Driver info card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className='bg-gradient-to-br from-accent-green-50 to-green-100 p-5 rounded-2xl mb-6 border-2 border-accent-green-300 shadow-lg'
        >
          <div className='flex items-center justify-between'>
            <motion.img
              whileHover={{ scale: 1.1, rotate: 5 }}
              className='h-20 drop-shadow-xl'
              src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_552,w_552/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a9c47/original/Final_UberX.png'
              alt='Vehicle'
            /> 
            <div className='text-right'>
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-green-700">Driver on the way</span>
              </div>
              <h2 className='text-xl font-bold text-gray-900'>Kajal</h2> 
              <h4 className='text-xl font-bold text-accent-green-700 -mt-1'>DL 9C AZ 8855</h4> 
              <div className="flex items-center justify-end gap-1 mt-1">
                <i className="ri-car-line text-gray-600"></i>
                <p className='text-sm text-gray-700 font-medium'>Tata Tigor</p>
              </div>
              <div className="flex items-center justify-end gap-2 mt-2">
                <div className="flex items-center gap-1 text-yellow-600">
                  <i className="ri-star-fill text-sm"></i>
                  <span className="text-sm font-semibold">4.8</span>
                </div>
              </div>
            </div>       
          </div>
        </motion.div>

        {/* ETA Banner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-primary-100 border border-primary-300 rounded-xl p-4 mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <i className="ri-time-line text-2xl text-primary-600"></i>
            </motion.div>
            <div>
              <p className="text-sm text-gray-600">Arriving in</p>
              <p className="text-xl font-bold text-primary-700">2 minutes</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center gap-2 hover:border-primary-500 transition-colors"
          >
            <i className="ri-phone-line text-primary-600"></i>
            <span className="font-medium text-gray-700">Call</span>
          </motion.button>
        </motion.div>

        <div className='flex flex-col gap-2 items-center'>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='w-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden'
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

export default WaitingForDriver