import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import appLogo3 from '../assets/app logo3.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';
import Button from '../Components/Button';
import Input from '../Components/Input';
import AnimatedPage from '../Components/AnimatedPage';

const CaptainLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { captain, setCaptain } = React.useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async(e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const captain = {
      email: email,
      password: password  
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain);
      if (response.status === 200) {  
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        localStorage.setItem('captainId', data.captain._id);
        navigate('/captain-home');
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage className="min-h-screen p-6 flex flex-col justify-between bg-gradient-to-br from-green-50 to-emerald-50 safe-top safe-bottom">
      {/* Logo and Form */}
      <div>
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={appLogo3}
          alt="Safar Captain Logo"
          className="w-24 h-24 mb-8"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto"
        >
          <div className="flex items-center gap-2 mb-2">
            <i className="ri-steering-2-line text-3xl text-accent-green-600"></i>
            <h1 className="text-3xl font-bold text-gray-900">Captain Portal</h1>
          </div>
          <p className="text-gray-600 mb-8">Sign in to start driving</p>

          <form onSubmit={submitHandler}>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2"
              >
                <i className="ri-error-warning-line text-xl flex-shrink-0 mt-0.5"></i>
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <Input
              label="Email address"
              type="email"
              placeholder="captain@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon="ri-mail-line"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon="ri-lock-line"
            />

            <Button 
              type="submit" 
              variant="success" 
              fullWidth
              loading={loading}
              className="mb-4"
            >
              {loading ? 'Signing in...' : 'Sign In as Captain'}
            </Button>

            <p className="text-center text-base text-gray-600">
              New captain?{' '}
              <Link to="/captainsignup" className="text-accent-green-600 font-semibold hover:text-accent-green-700 transition-colors">
                Register now
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Bottom switch button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-t border-gray-200 pt-6 mt-6"
      >
        <p className="text-center text-sm text-gray-600 mb-3">
          Are you a rider?
        </p>
        <Link to="/Login">
          <Button variant="outline" fullWidth icon="ri-user-line">
            Sign in as User
          </Button>
        </Link>
      </motion.div>
    </AnimatedPage>
  )
}

export default CaptainLogin
