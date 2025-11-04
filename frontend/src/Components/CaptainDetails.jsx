import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainDetails = () => {
  const { captain, updateCaptainStatus } = useContext(CaptainDataContext)
  const [isOnline, setIsOnline] = useState(captain?.status === 'online')
  const [isUpdating, setIsUpdating] = useState(false)

  // Keep local toggle in sync with captain status from context
  useEffect(() => {
    setIsOnline(captain?.status === 'online')
  }, [captain?.status])

  const handleStatusToggle = async () => {
    setIsUpdating(true)
    try {
      const newStatus = isOnline ? 'offline' : 'online'
      await updateCaptainStatus(newStatus)
      setIsOnline(!isOnline)
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex items-center justify-between'
      >
        <div className='flex items-center gap-3'>
          <motion.img
            whileHover={{ scale: 1.1 }}
            className='h-14 w-14 rounded-full object-cover border-2 border-accent-green-500 shadow-md'
            src='https://img.freepik.com/free-photo/young-adult-man-wearing-hoodie-beanie_23-2149393636.jpg'
            alt='Captain Profile'
          />
          <div>
            <h4 className='text-lg font-bold text-gray-900'>
              {captain?.fullname?.firstname || 'Harsh'}{' '}
              {captain?.fullname?.lastname || 'Patel'}
            </h4>
            <p className='text-sm text-gray-500 flex items-center gap-1'>
              <i className="ri-star-fill text-yellow-500 text-xs"></i>
              <span className="font-medium">4.9</span>
              <span>(128 trips)</span>
            </p>
          </div>
        </div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className='text-right bg-gradient-to-br from-accent-green-50 to-green-100 px-4 py-2 rounded-xl border border-accent-green-200'
        >
          <h4 className='text-2xl font-bold text-accent-green-700'>₹295.20</h4>
          <p className='text-sm text-accent-green-600 font-medium'>Today's Earned</p>
        </motion.div>
      </motion.div>

      {/* Status Toggle */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className='mt-5 flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm'
      >
        <div className='flex items-center gap-3'>
          <motion.div 
            animate={{ 
              scale: isOnline ? [1, 1.2, 1] : 1,
              boxShadow: isOnline ? ['0 0 0 0 rgba(34, 197, 94, 0.4)', '0 0 0 8px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0)'] : 'none'
            }}
            transition={{ repeat: isOnline ? Infinity : 0, duration: 2 }}
            className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
          />
          <span className='text-base font-semibold text-gray-900'>{isOnline ? 'Online' : 'Offline'}</span>
          <span className='text-xs text-gray-500'>{isOnline ? 'Accepting rides' : 'Not accepting rides'}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleStatusToggle}
          disabled={isUpdating}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isOnline ? 'bg-green-500 focus:ring-green-500' : 'bg-gray-300 focus:ring-gray-400'
          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <motion.span
            animate={{ x: isOnline ? 28 : 4 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className='inline-block h-6 w-6 rounded-full bg-white shadow'
          />
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='mt-5 grid grid-cols-3 gap-3'
      >
        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          className='text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm'
        >
          <i className='text-3xl mb-2 ri-timer-2-line text-blue-600'></i>
          <h5 className='text-xl font-bold text-blue-900'>10.2</h5>
          <p className='text-xs text-blue-700 font-medium'>Hours Online</p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          className='text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm'
        >
          <i className='text-3xl mb-2 ri-speed-up-line text-purple-600'></i>
          <h5 className='text-xl font-bold text-purple-900'>30 Km</h5>
          <p className='text-xs text-purple-700 font-medium'>Distance</p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          className='text-center p-4 bg-gradient-to-br from-accent-green-50 to-green-100 rounded-xl border border-accent-green-200 shadow-sm'
        >
          <i className='text-3xl mb-2 ri-booklet-line text-accent-green-600'></i>
          <h5 className='text-xl font-bold text-accent-green-900'>14</h5>
          <p className='text-xs text-accent-green-700 font-medium'>Trips</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CaptainDetails
