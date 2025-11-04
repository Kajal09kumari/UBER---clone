import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import appLogo from '../assets/app logo.png';
import appimage from '../assets/app image.png';
import Button from '../Components/Button';

const Start = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex flex-col justify-between relative overflow-hidden"
      style={{
        backgroundImage: `url(${appimage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center top -60px',
      }}
    >
      {/* Gradient overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      {/* Top Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="pt-6 px-6 relative z-10 safe-top"
      >
        <img src={appLogo} alt="Safar Logo" className="w-16 drop-shadow-lg" />
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white p-6 rounded-t-3xl shadow-strong relative z-10 safe-bottom"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
            Get Started with Safar
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Your ride, just a tap away
          </p>

          {/* Link to login */}
          <Link to="/login" className="block">
            <Button 
              variant="primary" 
              fullWidth 
              size="large"
              icon="ri-arrow-right-line"
            >
              Continue
            </Button>
          </Link>

          <p className="text-center text-sm text-gray-500 mt-4">
            By continuing, you agree to our Terms & Conditions
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Start;
