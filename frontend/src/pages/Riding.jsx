import React from 'react';
import { Link } from 'react-router-dom';

const Riding = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Link
        to="/home"
        className="fixed right-4 top-4 h-12 w-12 bg-white flex items-center justify-center rounded-full shadow-lg hover:bg-gray-100 transition-colors"
      >
        <i className="text-2xl ri-home-5-line text-gray-600"></i>
      </Link>
      <div className="h-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Riding Background"
        />
      </div>
      <div className="h-1/2 p-6 flex flex-col justify-between bg-white rounded-t-2xl shadow-lg">
        <div>
          <div className="flex items-center justify-between mb-6">
            <img
              className="h-20 rounded-lg shadow-md"
              src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_552,w_552/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a9c47/original/Final_UberX.png"
              alt="Car"
            />
            <div className="text-right">
              <h2 className="text-lg font-medium text-gray-800">Kajal</h2>
              <h4 className="text-xl font-semibold text-gray-900 mt-1">DL 9C AZ 8855</h4>
              <p className="text-sm text-gray-600 mt-1">Tata Tigor</p>
            </div>
          </div>
          <div className="w-full">
            <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-lg shadow mb-4">
              <i className="text-lg ri-map-pin-2-fill text-[#138808]"></i>
              <div>
                <h3 className="text-lg font-medium text-gray-800">562/11-A</h3>
                <p className="text-sm text-gray-600 mt-1">Kankariya Tablab, Delhi</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-lg shadow">
              <i className="text-lg ri-currency-line text-[#138808]"></i>
              <div>
                <h3 className="text-lg font-medium text-gray-800">₹199</h3>
                <p className="text-sm text-gray-600 mt-1">Cash</p>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full bg-[#138808] text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;