import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import appLogo3 from '../assets/app logo3.png';
import CaptainDetails from '../Components/CaptainDetails';
import RidePopUp from '../Components/RidePopUp';
import ConfirmRidePopUp from '../Components/ConfirmRidePopUp';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(true);
  const ridePopUpPanelRef = useRef(null);

  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const confirmRidePopUpPanelRef = useRef(null);

  useGSAP(() => {
    if (!ridePopUpPanelRef.current) return;
    gsap.to(ridePopUpPanelRef.current, {
      transform: 'translateY(0)',
      duration: 0.4,
      ease: 'power2.out',
    });
  }, [ridePopUpPanel]);

  useGSAP(() => {
    if (!confirmRidePopUpPanelRef.current) return;
    gsap.to(confirmRidePopUpPanelRef.current, {
      transform: 'translateY(0)',
      duration: 0.4,
      ease: 'power2.out',
    });
  }, [confirmRidePopUpPanel]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Top bar */}
      <div className="fixed top-0 left-0 w-full p-4 flex items-center justify-between z-20 bg-white/90 backdrop-blur-md shadow-md">
        <img src={appLogo3} alt="Safar Logo" className="w-28" />
        <Link
          to="/captainlogin"
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
        >
          <i className="text-xl ri-logout-box-r-line text-gray-600"></i>
        </Link>
      </div>

      {/* Map background */}
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Map Background"
        />
      </div>

      {/* Bottom card */}
      <div className="h-2/5 bg-white rounded-t-2xl shadow-lg p-6 flex flex-col">
        <CaptainDetails />
      </div>

      {/* Ride Popup */}
      <div
        ref={ridePopUpPanelRef}
        className="fixed w-full z-30 bottom-0 bg-white px-4 py-6 rounded-t-2xl shadow-2xl transform translate-y-full"
      >
        <RidePopUp
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>

      {/* Confirm Ride Popup */}
      <div
        ref={confirmRidePopUpPanelRef}
        className="fixed w-full h-screen z-30 bottom-0 bg-white px-4 py-6 rounded-t-2xl shadow-2xl transform translate-y-full"
      >
        <ConfirmRidePopUp setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} />
      </div>
    </div>
  );
};

export default CaptainHome;