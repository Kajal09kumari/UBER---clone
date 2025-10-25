import React from 'react';
import { Link } from 'react-router-dom';
import appLogo from '../assets/app logo.png';
import appimage from '../assets/app image.png';

const Start = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex flex-col justify-between"
      style={{
        backgroundImage: `url(${appimage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center top -60px',
      }}
    >
      <div className="pt-8 px-6">
        <img src={appLogo} alt="Safar Logo" className="w-20" />
      </div>
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-t-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Get Started with Safar</h2>
        <Link
          to="/login"
          className="w-full block bg-[#138808] text-white text-center py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Start;