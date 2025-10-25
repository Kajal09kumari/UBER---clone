import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import appLogo3 from '../assets/app logo3.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { captain, setCaptain } = React.useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = { email, password };
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captainData);
    if (response.status === 200) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem('token', data.token);
      navigate('/captain-home');
    }
    setEmail('');
    setPassword('');
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <img src={appLogo3} alt="Safar Logo" className="w-32 mb-8" />
      <form onSubmit={submitHandler} className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Captain Login</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#138808] focus:border-transparent"
              type="email"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">Password</label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#138808] focus:border-transparent"
              type="password"
              placeholder="password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#138808] text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-600">
            Join a fleet?{' '}
            <Link to="/captainsignup" className="text-[#138808] hover:underline">
              Register as Captain
            </Link>
          </p>
        </div>
      </form>
      <Link
        to="/login"
        className="mt-6 w-full max-w-md bg-[#f3c164] text-white font-semibold py-3 rounded-lg text-center hover:bg-yellow-600 transition-colors"
      >
        Sign in as User
      </Link>
    </div>
  );
};

export default CaptainLogin;