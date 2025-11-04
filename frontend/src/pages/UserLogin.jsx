import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import appLogo2 from '../assets/app logo2.png';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../Components/Button';
import Input from '../Components/Input';
import AnimatedPage from '../Components/AnimatedPage';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  
  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const userData = {
      email: email,
      password: password
    };
    
    try {
      console.log('Attempting login with:', { email });
      console.log('API URL:', `${import.meta.env.VITE_BASE_URL}/users/login`);
      
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);
      
      console.log('Login response:', response.status);
      
      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate('/home');
      }
      
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage className="min-h-screen p-6 flex flex-col justify-between bg-gradient-to-br from-gray-50 to-gray-100 safe-top safe-bottom">
      {/* Logo at Top-Left */}
      <div>
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={appLogo2}
          alt="Safar Logo"
          className="w-24 h-24 mb-8"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mb-8">Sign in to continue your journey</p>

          <form onSubmit={(e) => submitHandler(e)}>
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
              placeholder="you@example.com"
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
              variant="primary" 
              fullWidth 
              loading={loading}
              className="mb-4"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <p className="text-center text-base text-gray-600">
              New here?{' '}
              <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Create new Account
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Sign in as Captain Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-t border-gray-200 pt-6 mt-6"
      >
        <p className="text-center text-sm text-gray-600 mb-3">
          Are you a driver?
        </p>
        <Link to="/captainlogin">
          <Button variant="success" fullWidth icon="ri-steering-2-line">
            Sign in as Captain
          </Button>
        </Link>
      </motion.div>
    </AnimatedPage>
  );
};

export default UserLogin;
