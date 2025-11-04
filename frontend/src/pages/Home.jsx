import React, { useRef, useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import appLogo2 from '../assets/app logo2.png';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css';
import { Link } from 'react-router-dom';
import LocationSearchPanel from '../Components/LocationSearchPanel';
import VehiclePanel from '../Components/VehiclePanel';
import ConfirmRide from '../Components/ConfirmRide';
import LookingForDriver from '../Components/LookingForDriver';
import WaitingForDriver from '../Components/WaitingForDriver';
import Map from '../Components/Map';
import { searchLocation } from '../utils/geocoding';
import socket from '../utils/socket';
import { UserDataContext } from '../context/UserContext';

const Home = () => {
  const { user } = useContext(UserDataContext);
  const [pickupText, setPickupText] = useState(''); // readable address shown in input
  const [destinationText, setDestinationText] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeField, setActiveField] = useState(null); // 'pickup' | 'destination' or null

  const panelCloseRef = useRef(null);
  const panelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  
  // Socket state for driver info and location
  const [driverInfo, setDriverInfo] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  
  // Socket.io listeners for ride acceptance and driver location
  useEffect(() => {
    // Listen for ride acceptance from driver
    const handleRideAccepted = (data) => {
      console.log('Ride accepted by driver:', data);
      setDriverInfo(data.driver);
      setVehicleFound(false);
      setWaitingForDriver(true);
      
      // Join the ride room for location updates
      socket.emit('ride:join', { rideId: data.rideId });
    };

    // Listen for driver's real-time location
    const handleDriverLocation = (location) => {
      console.log('Driver location update:', location);
      setDriverLocation(location);
    };

    socket.on('ride:accepted', handleRideAccepted);
    socket.on('driver:location', handleDriverLocation);

    return () => {
      socket.off('ride:accepted', handleRideAccepted);
      socket.off('driver:location', handleDriverLocation);
    };
  }, []);
  
    // Add a function to update the query in the parent component
  const updateQuery = (text) => {
    if (activeField === 'pickup') {
      setPickupText(text);
    } else {
      setDestinationText(text);
    }
  };

  // Holds geo positions for route drawing
  const [selectedLocations, setSelectedLocations] = useState({
    pickup: null, // { lat, lng, text }
    destination: null,
  });

  // GSAP animation hooks (unchanged behaviour)
  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? '100%' : '0%',
      padding: panelOpen ? 24 : 0,
      duration: 0.25,
      ease: 'power2.out',
    });
    gsap.to(panelCloseRef.current, {
      rotate: panelOpen ? 180 : 0,
      opacity: panelOpen ? 1 : 0,
      duration: 0.25,
    });
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      transform: vehiclePanel ? 'translateY(0)' : 'translateY(100%)',
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [vehiclePanel]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      transform: confirmRidePanel ? 'translateY(0)' : 'translateY(100%)',
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      transform: vehicleFound ? 'translateY(0)' : 'translateY(100%)',
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      transform: waitingForDriver ? 'translateY(0)' : 'translateY(100%)',
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [waitingForDriver]);

  // Reverse geocode helper using Nominatim (used by Use my location)
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return data?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  };

  // Use browser geolocation to set pickup
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not available in this browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const addr = await reverseGeocode(latitude, longitude);
        setPickupText(addr);
        setSelectedLocations((p) => ({
          ...p,
          pickup: { lat: latitude, lng: longitude, text: addr },
        }));
      },
      (err) => {
        console.error('Geolocation error', err);
        alert('Unable to fetch location');
      },
      { enableHighAccuracy: true }
    );
  };

  // When LocationSearchPanel (or Map) reports a selected location:
  const handleLocationSelect = (type, location) => {
    // location: { lat, lng, text? }
    if (!location) return;
    setSelectedLocations((prev) => {
      const next = { ...prev, [type]: { lat: location.lat, lng: location.lng, text: location.text || location.name || '' } };
      return next;
    });

    // set input text accordingly
    if (type === 'pickup') {
      setPickupText(location.text || location.name || `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`);
    } else {
      setDestinationText(location.text || location.name || `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`);
    }
  };

  // When user blurs the text inputs, forward-geocode (if they typed an address)
  const forwardGeocode = async (text, type) => {
    if (!text || text.length < 3) return;
    try {
      const loc = await searchLocation(text); // user util
      if (!loc) return;
      handleLocationSelect(type, { lat: loc.lat, lng: loc.lng, text: text });
    } catch (e) {
      console.error('Forward geocode failed', e);
    }
  };

  // When clicking bottom inputs: set active field and open the expanded panel
  const openSearchPanelFor = (field) => {
    setActiveField(field); // 'pickup' or 'destination'
    setPanelOpen(true);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top 4/5 → Map */}
      <div className="flex-[4] relative">
        <Map
          markers={[
            selectedLocations.pickup && { ...selectedLocations.pickup, text: 'Pickup' },
            selectedLocations.destination && { ...selectedLocations.destination, text: 'Destination' },
          ].filter(Boolean)}
          onLocationSelect={(latlng) => {
            // map clicks select pickup first then destination
            // maintain same behaviour as before
            if (!selectedLocations.pickup) {
              handleLocationSelect('pickup', { lat: latlng.lat, lng: latlng.lng, text: 'Picked location' });
              setPickupText('Picked location');
            } else if (!selectedLocations.destination) {
              handleLocationSelect('destination', { lat: latlng.lat, lng: latlng.lng, text: 'Picked location' });
              setDestinationText('Picked location');
            } else {
              // replace destination
              handleLocationSelect('destination', { lat: latlng.lat, lng: latlng.lng, text: 'Picked location' });
              setDestinationText('Picked location');
            }
          }}
        />

        {/* Logo + top controls overlay */}
        {!panelOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-20"
          >
            <motion.img 
              whileHover={{ scale: 1.05 }}
              src={appLogo2} 
              alt="Safar Logo" 
              className="w-24 drop-shadow-lg" 
            />
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={useMyLocation}
                className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-2 font-medium"
              >
                <i className="ri-map-pin-user-line text-primary-600"></i>
                Use my location
              </motion.button>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:bg-red-50 hover:border-red-200 transition-all group"
                >
                  <i className="text-xl ri-logout-box-r-line text-gray-600 group-hover:text-red-600 transition-colors"></i>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom 1/5 → compact search row */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-[1] bg-white rounded-t-3xl shadow-xl p-5 relative border-t border-gray-100"
      >
        <motion.h5
          ref={panelCloseRef}
          onClick={() => setPanelOpen(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute opacity-0 top-6 right-6 text-2xl cursor-pointer"
        >
          <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
        </motion.h5>

        <div className="flex items-center gap-2 mb-4">
          <i className="ri-route-line text-2xl text-primary-600"></i>
          <h4 className="text-2xl font-bold text-gray-900">Find a trip</h4>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gradient-to-b from-primary-500 to-accent-green-500 rounded-full"></div>

          {/* Pickup input (click to open search panel and edit) */}
          <div className="relative mb-3">
            <i className="ri-map-pin-line absolute left-4 top-1/2 -translate-y-1/2 text-primary-600 text-xl z-10"></i>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              onClick={() => openSearchPanelFor('pickup')}
              value={pickupText}
              onChange={(e) => setPickupText(e.target.value)}
              onBlur={() => forwardGeocode(pickupText, 'pickup')}
              className="bg-gray-50 px-12 py-3 text-base rounded-xl w-full border-2 border-gray-200 focus:border-primary-500 focus:bg-white transition-all outline-none"
              type="text"
              placeholder="Add a pick-up location"
            />
          </div>

          {/* Destination input (click to open search panel and edit) */}
          <div className="relative">
            <i className="ri-map-pin-fill absolute left-4 top-1/2 -translate-y-1/2 text-accent-green-600 text-xl z-10"></i>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              onClick={() => openSearchPanelFor('destination')}
              value={destinationText}
              onChange={(e) => setDestinationText(e.target.value)}
              onBlur={() => forwardGeocode(destinationText, 'destination')}
              className="bg-gray-50 px-12 py-3 text-base rounded-xl w-full border-2 border-gray-200 focus:border-accent-green-500 focus:bg-white transition-all outline-none"
              type="text"
              placeholder="Enter your destination"
            />
          </div>
        </form>
      </motion.div>

      {/* Expanded search panel (hidden by default; GSAP controls height/padding) */}
      <motion.div
        ref={panelRef}
        className="h-0 bg-white transition-all duration-300 overflow-y-auto rounded-t-3xl shadow-2xl"
      >
        <LocationSearchPanel
          onLocationSelect={handleLocationSelect}
          setPanelOpen={setPanelOpen}
          setVehiclePanel={setVehiclePanel}
          activeField={activeField}
          initialText={activeField === 'pickup' ? pickupText : destinationText}
          updateQuery={updateQuery}
        />
      </motion.div>

      {/* Bottom sliding panels (vehicle, confirm, looking for driver, waiting) */}
      <motion.div
        ref={vehiclePanelRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 rounded-t-3xl shadow-2xl"
      >
        <VehiclePanel
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
          selectedLocations={selectedLocations}
        />
      </motion.div>

      <motion.div
        ref={confirmRidePanelRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 rounded-t-3xl shadow-2xl"
      >
        <ConfirmRide
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </motion.div>

      <motion.div
        ref={vehicleFoundRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 rounded-t-3xl shadow-2xl"
      >
        <LookingForDriver setVehicleFound={setVehicleFound} />
      </motion.div>

      <motion.div
        ref={waitingForDriverRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 rounded-t-3xl shadow-2xl"
      >
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
      </motion.div>
    </div>
  );
};

export default Home;
