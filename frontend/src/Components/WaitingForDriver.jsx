import React from 'react';

const WaitingForDriver = (props) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg relative">
      <h5
        className="p-1 text-center w-[93%] absolute top-2 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={() => props.setWaitingForDriver(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </h5>

      <div className="flex items-center justify-between mb-6">
        <img
          className="h-20 rounded-lg object-cover shadow-md"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_552,w_552/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a9c47/original/Final_UberX.png"
          alt="Vehicle"
        />
        <div className="text-right">
          <h2 className="text-lg font-medium text-gray-800">Kajal</h2>
          <h4 className="text-xl font-semibold text-gray-900 -mt-1">DL 9C AZ 8855</h4>
          <p className="text-sm text-gray-600">Tata Tigor</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <div className="w-full">
          {/* Pickup address */}
          <div className="flex items-center gap-5 p-4 border-b-2 border-gray-200">
            <i className="text-lg ri-map-pin-user-fill text-[#138808]"></i>
            <div>
              <h3 className="text-lg font-medium text-gray-800">562/11-A</h3>
              <p className="text-sm text-gray-600 mt-1">Kankariya Tablab, Delhi</p>
            </div>
          </div>

          {/* Destination address */}
          <div className="flex items-center gap-5 p-4 border-b-2 border-gray-200">
            <i className="text-lg ri-map-pin-2-fill text-[#138808]"></i>
            <div>
              <h3 className="text-lg font-medium text-gray-800">562/11-A</h3>
              <p className="text-sm text-gray-600 mt-1">Kankariya Tablab, Delhi</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-5 p-4">
            <i className="text-lg ri-currency-line text-[#138808]"></i>
            <div>
              <h3 className="text-lg font-medium text-gray-800">₹199</h3>
              <p className="text-sm text-gray-600 mt-1">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;