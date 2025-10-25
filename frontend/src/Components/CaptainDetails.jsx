const CaptainDetails = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div className="flex items-center gap-4">
          <img className="h-12 w-12 rounded-full object-cover ring-2 ring-[#138808] ring-offset-2" src="https://img.freepik.com/free-photo/young-adult-man-wearing-hoodie-beanie_23-2149393636.jpg" alt=""/>
          <h4 className="text-xl font-semibold text-gray-900">Harsh Patel</h4>
        </div>
        <div className="text-right">
          <h4 className="text-2xl font-bold text-[#138808]">₹295.20</h4>
          <p className="text-sm text-gray-500">Earned</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 p-4 bg-gray-50 rounded-xl">
        <div className="text-center">
          <i className="text-3xl mb-2 ri-timer-2-line text-[#138808]"></i>
          <h5 className="text-lg font-medium text-gray-800">10.2</h5>
          <p className="text-sm text-gray-500">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 ri-speed-up-line text-[#138808]"></i>
          <h5 className="text-lg font-medium text-gray-800">30 Km</h5>
          <p className="text-sm text-gray-500">Distance Driven</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 ri-booklet-line text-[#138808]"></i>
          <h5 className="text-lg font-medium text-gray-800">14</h5>
          <p className="text-sm text-gray-500">Trips Completed</p>
        </div>
      </div>        
    </div>
  )
}