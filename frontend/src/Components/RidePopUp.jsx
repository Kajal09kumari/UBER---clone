const RidePopUp = (props) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg relative">
      <h5
        className="p-1 text-center w-[93%] absolute top-2 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={() => props.setRidePopUpPanel(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">New Ride Available!</h3>

      <div className="flex items-center justify-between p-4 bg-yellow-100 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4">
          <img
            className="h-14 w-14 rounded-full object-cover ring-2 ring-yellow-400 ring-offset-2"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            alt="rider"
          />
          <h2 className="text-xl font-medium text-gray-800">Harshita</h2>
        </div>
        <h5 className="text-lg font-semibold text-gray-700">2.2 KM</h5>
      </div>

      <div className="flex flex-col gap-4 items-center">
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

        <div className="flex items-center justify-between w-full mt-6 space-x-4">
          <button
            onClick={() => props.setRidePopUpPanel(false)}
            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Ignore
          </button>        
          <button
            onClick={() => {
              props.setConfirmRidePopUpPanel(true)
              props.setRidePopUpPanel(false)
            }}
            className="flex-1 bg-[#138808] text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}