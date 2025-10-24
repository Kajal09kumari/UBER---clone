import React, { useState } from 'react'; // 1. Import useState

const CaptainDetails = () => {
    // 2. Initialize status state
    const [isOnline, setIsOnline] = useState(false); // Start as 'offline'

    // 3. Handler function to toggle status
    const handleStatusToggle = () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);
        
        // TODO: Here, you would typically make an API call 
        // to update the driver's status in the backend/database.
        console.log(`Driver status changed to: ${newStatus ? 'online' : 'offline'}`);
    };

    const statusText = isOnline ? 'You are Online' : 'You are Offline';

    return (
        <div>
            {/* TOGGLE SWITCH SECTION (NEW) */}
            <div className='flex items-center justify-between p-4 bg-white shadow rounded-xl mb-6 border-b border-gray-200'>
                <div className='flex flex-col'>
                    <h3 className='text-lg font-bold'>Driver Status</h3>
                    <p className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                        {statusText}
                    </p>
                </div>

                {/* Toggle Switch UI */}
                <button
                    onClick={handleStatusToggle}
                    className={`
                        relative inline-flex flex-shrink-0 h-7 w-14 border-2 rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none 
                        ${isOnline ? 'bg-green-500 border-green-500' : 'bg-gray-300 border-gray-300'}
                    `}
                    role="switch"
                    aria-checked={isOnline}
                >
                    <span className='sr-only'>Toggle Driver Status</span>
                    <span
                        aria-hidden="true"
                        className={`
                            pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                            ${isOnline ? 'translate-x-7' : 'translate-x-0'}
                        `}
                    />
                </button>
            </div>
            {/* END OF TOGGLE SWITCH SECTION */}

            {/* Existing Captain Details */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://img.freepik.com/free-photo/young-adult-man-wearing-hoodie-beanie_23-2149393636.jpg" alt="Driver Profile"/>
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

export default CaptainDetails;