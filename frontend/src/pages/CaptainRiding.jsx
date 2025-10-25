import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import appLogo3 from '../assets/app logo3.png';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import FinishRide from '../Components/FinishRide';

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: 'translateY(0)',
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: 'translateY(100%)',
        duration: 0.4,
        ease: 'power2.in',
      });
    }
  }, [finishRidePanel]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Top bar */}
      <div className="fixed top-0 left-0 w-full p-4 flex items-center justify-between z-20 bg-white/90 backdrop-blur-md shadow-md">
        <img src={appLogo3} alt="Safar Logo" className="w-24" />
        <Link
          to="/captainlogin"
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
        >
          <i className="text-xl ri-logout-box-r-line text-gray-600"></i>
        </Link>
      </div>

      {/* Map background */}
      <div className="flex-1">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Riding Background"
        />
      </div>

      {/* Bottom ride details card */}
      <div
        className="h-24 bg-yellow-400 rounded-t-2xl shadow-lg p-4 flex flex-col justify-center cursor-pointer"
        onClick={() => setFinishRidePanel(true)}
      >
        <div className="w-full flex justify-center -mt-2">
          <i className="text-2xl text-gray-700 ri-arrow-up-s-line"></i>
        </div>
        <div className="flex items-center justify-between mt-1">
          <h4 className="text-xl font-semibold text-gray-900">4 Km Away</h4>
          <button className="bg-[#138808] hover:bg-green-700 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition-colors">
            Complete Ride
          </button>
        </div>
      </div>

      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-30 bottom-0 bg-white px-4 py-6 rounded-t-2xl shadow-2xl transform translate-y-full"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;