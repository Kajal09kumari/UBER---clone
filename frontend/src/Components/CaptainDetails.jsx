import React from 'react'

const CaptainDetails = () => {
  return (
    <div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <img className='h-10 w-10 rounded-full object-cover' src="https://img.freepik.com/free-photo/young-adult-man-wearing-hoodie-beanie_23-2149393636.jpg" alt=""/>
            <h4 className='text-lg font-medium'>Harsh Patel</h4>
          </div>
          <div className='text-right'>
            <h4 className='text-xl font-semibold'>₹295.20</h4>
            <p className='text-sm text-gray-600'>Earned</p>
          </div>
        </div>

        <div className='mt-8 flex p-3 bg-gray-100 rounded-xl justify-center gap-5 items-center'>
          <div className='text-center'>
            <i className="text-3xl mb-2 ri-timer-2-line"></i>
            <h5 className='text-lg font-medium'>10.2</h5>
            <p className='text-sm text-gray-600'>Hours Online</p>
          </div>
          <div className='text-center'>
            <i className="text-3xl mb-2 ri-speed-up-line"></i>
            <h5 className='text-lg font-medium'>30 Km</h5>
            <p className='text-sm text-gray-600'>Distance Driven</p>
          </div>
          <div className='text-center'>
            <i className="text-3xl mb-2 ri-booklet-line"></i>
            <h5 className='text-lg font-medium'>14</h5>
            <p className='text-sm text-gray-600'>Trips Completed</p>
          </div>
        </div>        
    </div>
  )
}

export default CaptainDetails