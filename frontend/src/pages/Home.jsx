import React, { useRef, useState, useEffect, useContext } from 'react';
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
import { useSocket } from '../context/SocketContext';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';

const Home = () => {
  const [pickupText, setPickupText] = useState(''); // readable address shown in input
  const [destinationText, setDestinationText] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeField, setActiveField] = useState(null); // 'pickup' | 'destination' or null
  const [captainLocations, setCaptainLocations] = useState([]); // Real-time captain locations
  const { socket, isConnected } = useSocket();
  const { user } = useContext(UserDataContext);

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

  // Socket.io: Listen for nearby captain locations
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Request nearby captain locations periodically
    const fetchNearbyCaptains = () => {
      if (selectedLocations.pickup) {
        socket.emit('request:nearby-captains', {
          location: selectedLocations.pickup
        });
      }
    };

    // Listen for captain location updates
    socket.on('captains:nearby', (captains) => {
      console.log('Nearby captains:', captains);
      setCaptainLocations(captains);
    });

    // Fetch initially and then every 10 seconds
    fetchNearbyCaptains();
    const interval = setInterval(fetchNearbyCaptains, 10000);

    return () => {
      socket.off('captains:nearby');
      clearInterval(interval);
    };
  }, [socket, isConnected, selectedLocations.pickup]);

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
            ...captainLocations.map(captain => ({
              lat: captain.location.lat,
              lng: captain.location.lng,
              text: 'Captain',
              isCaptain: true
            }))
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
          <div className="absolute top-0 left-0 w-full p-3 flex items-center justify-between z-20">
            <img src={appLogo2} alt="Safar Logo" className="w-24" />
            <div className="flex items-center gap-2">
              <button
                onClick={useMyLocation}
                className="px-3 py-1 text-sm bg-white border rounded-md"
              >
                Use my location
              </button>
              <Link
                to="/login"
                className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 bg-white"
              >
                <i className="text-lg ri-logout-box-r-line"></i>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom 1/5 → compact search row */}
      <div className="flex-[1] bg-white p-5 relative">
        <h5
          ref={panelCloseRef}
          onClick={() => setPanelOpen(false)}
          className="absolute opacity-0 top-6 right-6 text-2xl cursor-pointer"
        >
          <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
        </h5>

        <h4 className="text-2xl font-semibold mb-2">Find a trip</h4>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="line absolute h-16 w-1 top-[42%] left-10 bg-gray-700 rounded-full"></div>

          {/* Pickup input (click to open search panel and edit) */}
          <input
            onClick={() => openSearchPanelFor('pickup')}
            value={pickupText}
            onChange={(e) => setPickupText(e.target.value)}
            onBlur={() => forwardGeocode(pickupText, 'pickup')}
            className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-1"
            type="text"
            placeholder="Add a pick-up location"
          />

          {/* Destination input (click to open search panel and edit) */}
          <input
            onClick={() => openSearchPanelFor('destination')}
            value={destinationText}
            onChange={(e) => setDestinationText(e.target.value)}
            onBlur={() => forwardGeocode(destinationText, 'destination')}
            className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-1"
            type="text"
            placeholder="Enter your destination"
          />
        </form>
      </div>

      {/* Expanded search panel (hidden by default; GSAP controls height/padding) */}
      <div
        ref={panelRef}
        className="h-0 bg-white transition-all duration-300 overflow-y-auto"
      >
        <LocationSearchPanel
          onLocationSelect={handleLocationSelect}
          setPanelOpen={setPanelOpen}
          setVehiclePanel={setVehiclePanel}
          activeField={activeField}
          initialText={activeField === 'pickup' ? pickupText : destinationText}
          updateQuery={updateQuery}
        />
      </div>

      {/* Bottom sliding panels (vehicle, confirm, looking for driver, waiting) */}
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
          selectedLocations={selectedLocations}
        />
      </div>

      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <LookingForDriver setVehicleFound={setVehicleFound} />
      </div>

      <div
        ref={waitingForDriverRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  );
};

export default Home;
