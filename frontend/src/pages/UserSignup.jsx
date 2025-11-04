import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import appLogo2 from '../assets/app logo2.png';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import Button from '../Components/Button';
import Input from '../Components/Input';
import AnimatedPage from '../Components/AnimatedPage';

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { user, setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('Signup form submitted')

    const newUser = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
    }

    console.log('Sending signup request:', newUser)

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)
      console.log('Signup response:', response)
      
      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        console.log('Signup successful, navigating to /home')
        navigate('/home')
      }

      // Clear inputs
      setFirstname('')
      setLastname('')
      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Signup error:', error)
      setError(error.response?.data?.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedPage className="min-h-screen p-6 flex flex-col justify-between bg-gradient-to-br from-gray-50 to-gray-100 safe-top safe-bottom">
      {/* Logo */}
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
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Create your account</h1>
          <p className="text-gray-600 mb-8">Join thousands of riders today</p>

          <form onSubmit={submitHandler} className="space-y-5">
            {/* Error Message */}
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

            {/* Name Section */}
            <div>
              <label className="text-base font-semibold mb-2 block text-gray-700">
                Full name<span className="text-error ml-1">*</span>
              </label>
              <div className='flex gap-3'>
                <Input
                  type="text"
                  placeholder="First name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  icon="ri-user-line"
                  className="mb-0"
                  containerClassName="flex-1"
                />
                <Input
                  type="text"
                  placeholder="Last name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  className="mb-0"
                  containerClassName="flex-1"
                />
              </div>
            </div>

            {/* Email Section */}
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon="ri-mail-line"
            />

            {/* Password Section */}
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon="ri-lock-line"
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              loading={loading}
              className="mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>

            {/* Login Link */}
            <p className="text-center text-base pt-2 text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Terms Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <p className='text-xs text-center text-gray-500 leading-relaxed'>
          By creating an account, you agree to our{' '}
          <span className='underline cursor-pointer hover:text-gray-700'>Terms of Service</span> and{' '}
          <span className='underline cursor-pointer hover:text-gray-700'>Privacy Policy</span>
        </p>
      </motion.div>
    </AnimatedPage>
  )
}

export default UserSignup
