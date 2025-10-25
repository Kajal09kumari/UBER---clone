import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import appLogo2 from '../assets/app logo2.png';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = { email, password };
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);
    if (response.status === 200) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/home');
    }
    setEmail('');
    setPassword('');
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <img src={appLogo2} alt="Safar Logo" className="w-32 mb-8" />
      <form onSubmit={submitHandler} className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">User Login</h3>
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
            New here?{' '}
            <Link to="/signup" className="text-[#138808] hover:underline">
              Create new Account
            </Link>
          </p>
        </div>
      </form>
      <Link
        to="/captainlogin"
        className="mt-6 w-full max-w-md bg-[#10b461] text-white font-semibold py-3 rounded-lg text-center hover:bg-green-600 transition-colors"
      >
        Sign in as Captain
      </Link>
    </div>
  );
};

export default UserLogin;