import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import appLogo3 from '../assets/app logo3.png';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button';
import Input from '../Components/Input';
import AnimatedPage from '../Components/AnimatedPage';

const CaptainSignup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Captain signup form submitted');

    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
    };

    console.log('Sending captain signup request:', captainData);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);
      console.log('Captain signup response:', response);
      
      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        localStorage.setItem('captainId', data.captain._id); // Store captain ID
        console.log('Captain signup successful, navigating to /captain-home');
        navigate('/captain-home');
      }

      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Captain signup error:', error);
      setError(error.response?.data?.message || 'Failed to create captain account. Please try again.');
    } finally {
      setLoading(false);
    }
    setVehicleColor('');
    setVehiclePlate('');
    setVehicleCapacity('');
    setVehicleType('');
  };

  return (
    <AnimatedPage className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col safe-top safe-bottom">
      {/* Header */}
      <div className="p-6">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={appLogo3}
          alt="Safar Captain Logo"
          className="w-24 h-auto"
        />
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto custom-scrollbar">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="flex items-center gap-2 mb-2">
            <i className="ri-steering-2-line text-3xl text-accent-green-600"></i>
            <h1 className="text-3xl font-bold text-gray-900">Become a Captain</h1>
          </div>
          <p className="text-gray-600 mb-8">Start earning by driving with us</p>

          <form onSubmit={submitHandler} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2"
              >
                <i className="ri-error-warning-line text-xl flex-shrink-0 mt-0.5"></i>
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <i className="ri-user-line text-xl text-accent-green-600"></i>
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    icon="ri-user-line"
                    containerClassName="flex-1"
                  />
                  <Input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <Input
                  type="email"
                  placeholder="captain@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon="ri-mail-line"
                />

                <Input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon="ri-lock-line"
                />
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <i className="ri-car-line text-xl text-accent-green-600"></i>
                <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
              </div>

              <div className="space-y-4">
                {/* Vehicle Type Selection */}
                <div>
                  <label className="text-base font-semibold mb-2 block text-gray-700">
                    Vehicle Type<span className="text-error ml-1">*</span>
                  </label>
                  <select
                    required
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-accent-green-500 focus:ring-2 focus:ring-accent-green-500/20 focus:outline-none transition-all duration-200 w-full py-3 px-4 text-base"
                  >
                    <option value="" disabled>Select your vehicle type</option>
                    <option value="car">🚗 Car</option>
                    <option value="auto">🛺 Auto</option>
                    <option value="motorcycle">🏍️ Motorcycle</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Vehicle color"
                    value={vehicleColor}
                    onChange={(e) => setVehicleColor(e.target.value)}
                    required
                    icon="ri-palette-line"
                    containerClassName="flex-1"
                  />
                  <Input
                    type="text"
                    placeholder="Plate number"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    required
                    icon="ri-number-1"
                    containerClassName="flex-1"
                  />
                </div>

                <Input
                  type="number"
                  placeholder="Passenger capacity"
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                  required
                  icon="ri-group-line"
                  min="1"
                  max="8"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="success" 
              fullWidth 
              size="large" 
              loading={loading}
              icon="ri-shield-check-line"
            >
              {loading ? 'Creating Account...' : 'Register as Captain'}
            </Button>

            {/* Login Link */}
            <p className="text-center text-base text-gray-600">
              Already have an account?{' '}
              <Link to="/captainlogin" className="text-accent-green-600 font-semibold hover:text-accent-green-700 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 py-4 text-xs text-center text-gray-500 border-t border-gray-200"
      >
        By registering, you agree to our{' '}
        <span className="underline cursor-pointer hover:text-gray-700">Terms of Service</span> and{' '}
        <span className="underline cursor-pointer hover:text-gray-700">Privacy Policy</span>
      </motion.div>
    </AnimatedPage>
  );
};

export default CaptainSignup;