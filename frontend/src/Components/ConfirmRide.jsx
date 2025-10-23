import React, { useEffect, useState } from 'react'

const ConfirmRide = (props) => {
  const [estimate, setEstimate] = useState(null);
  const [estimating, setEstimating] = useState(false);

  useEffect(() => {
    const fetchEstimate = async () => {
      const pickup = props.selectedLocations?.pickup;
      const destination = props.selectedLocations?.destination;
      if (!pickup || !destination) return;
      setEstimating(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:3000'}/rides/estimate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pickup: { lat: pickup.lat, lng: pickup.lng }, destination: { lat: destination.lat, lng: destination.lng } })
        });
        if (res.ok) {
          const data = await res.json();
          setEstimate(data);
        } else {
          console.error('Estimate failed', await res.text());
        }
      } catch (e) {
        console.error('Estimate error', e);
      } finally {
        setEstimating(false);
      }
    };
    fetchEstimate();
  }, [props.selectedLocations]);
  return (
    <div>
      <h5
        className='p-1 text-center w-[93%] absolute top-0'
        onClick={() => {props.setConfirmRidePanel(false)}}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className='text-2xl font-semibold mb-5 mt-0'>Confirm your Ride</h3>

      <div className='flex flex-col gap-2  items-center'>
        <img
          className='h-24'
          src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_552,w_552/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a9c47/original/Final_UberX.png'
          alt=' '
        />

        <div className='w-full mt-5'>
          {/* Pickup address */}
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>562/11-A</h3>
              <p className='text-sm -mt-1 text-gray-600'>Kankariya Tablab, Delhi</p>
            </div>
          </div>

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
              <h3 className='text-lg font-medium'>
                {estimating ? 'Estimating...' : estimate ? `₹${estimate.fare}` : '—'}
              </h3>
              <p className='text-sm -mt-1 text-gray-600'>
                {estimate ? `${estimate.distanceKm} km • Cash` : 'Price estimate'}
              </p>
            </div>
          </div>
        </div>

        <button onClick={async ()=>{
          // Send ride request to backend
          try {
            const body = {
              userId: localStorage.getItem('userId') || 'anonymous',
              pickup: props.selectedLocations?.pickup || { lat: 0, lng: 0, text: '' },
              destination: props.selectedLocations?.destination || { lat: 0, lng: 0, text: '' },
              passengerCount: 1,
            };
            const res = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:3000'}/rides/request`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            });
            if (!res.ok) {
              console.error('Failed to request ride', await res.text());
            }
          } catch (e) {
            console.error('Ride request failed', e);
          }

          props.setVehicleFound(true)
          props.setConfirmRidePanel(false)
        }}
          className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg '
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
