import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import appLogo2 from '../assets/app logo2.png';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = { fullname: { firstname, lastname }, email, password };
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
    if (response.status === 201) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/home');
    }
    setFirstname('');
    setLastname('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <img src={appLogo2} alt="Safar Logo" className="w-32 mb-8" />
      <form onSubmit={submitHandler} className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">User Registration</h3>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-600">Full Name</label>
          <div className="flex gap-4">
            <input
              required
              type="text"
              placeholder="Firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-1/2 px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#138808] focus:border-transparent"
            />
            <input
              required
              type="text"
              placeholder="Lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-1/2 px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#138808] focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-600">Email</label>
          <input
            required
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#138808] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-600">Password</label>
          <input
            required
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#138808] focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#138808] text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Create account
        </button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#138808] hover:underline">
            Login
          </Link>
        </p>
      </form>
      <div className="mt-6 px-6 py-2 text-xs text-gray-500 text-center">
        This site is protected by reCAPTCHA and the{' '}
        <span className="underline">Google Privacy Policy</span> and{' '}
        <span className="underline">Terms of Service</span> apply.
      </div>
    </div>
  );
};

export default UserSignup;