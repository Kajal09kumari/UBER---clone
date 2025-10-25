import React from 'react'; // Added implicit import for clarity

const LookingForDriver = (props) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg relative">
      <h5
        className="p-1 text-center w-[93%] absolute top-2 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={() => props.setVehicleFound(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Looking for a Driver</h3>

      <div className="flex flex-col gap-4 items-center">
        <img
          className="h-28 rounded-lg shadow-md"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_552,w_552/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a9c47/original/Final_UberX.png"
          alt="Vehicle" // Updated alt text for accessibility
        />

        <div className="w-full mt-4 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow">
            <i className="text-xl ri-map-pin-user-fill text-[#138808]"></i>
            <div>
              <h3 className="text-lg font-medium text-gray-800">562/11-A</h3>
              <p className="text-sm text-gray-500">Kankariya Tablab, Delhi</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow">
            <i className="text-xl ri-map-pin-2-fill text-[#138808]"></i>
            <div>
              <h3 className="text-lg font-medium text-gray-800">562/11-A</h3>
              <p className="text-sm text-gray-500">Kankariya Tablab, Delhi</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow">
            <i className="text-xl ri-currency-line text-[#138808]"></i>
            <div>
              <h3 className="text-lg font-medium text-gray-800">₹199</h3>
              <p className="text-sm text-gray-500">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>    
  );
};

export default LookingForDriver; // Added this line to export the component