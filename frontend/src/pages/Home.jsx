import React, { useRef, useState } from 'react';
import appLogo2 from '../assets/app logo2.png';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import LocationSearchPanel from '../Components/LocationSearchPanel';
import VehiclePanel from '../Components/VehiclePanel';
import ConfirmRide from '../Components/ConfirmRide';
import LookingForDriver from '../Components/LookingForDriver';
import WaitingForDriver from '../Components/WaitingForDriver';
import Map from '../Components/Map';
import { searchLocation } from '../utils/geocoding';

const Home = () => {
  const [pickupText, setPickupText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);

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

  const updateQuery = (text) => {
    if (activeField === 'pickup') setPickupText(text);
    else setDestinationText(text);
  };

  const [selectedLocations, setSelectedLocations] = useState({
    pickup: null,
    destination: null,
  });

  useGSAP(() => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        height: panelOpen ? '50%' : '0%',
        padding: panelOpen ? 24 : 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
    if (panelCloseRef.current) {
      gsap.to(panelCloseRef.current, {
        rotate: panelOpen ? 180 : 0,
        opacity: panelOpen ? 1 : 0,
        duration: 0.3,
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (vehiclePanelRef.current) {
      gsap.to(vehiclePanelRef.current, {
        transform: vehiclePanel ? 'translateY(0)' : 'translateY(100%)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    if (confirmRidePanelRef.current) {
      gsap.to(confirmRidePanelRef.current, {
        transform: confirmRidePanel ? 'translateY(0)' : 'translateY(100%)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (vehicleFoundRef.current) {
      gsap.to(vehicleFoundRef.current, {
        transform: vehicleFound ? 'translateY(0)' : 'translateY(100%)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (waitingForDriverRef.current) {
      gsap.to(waitingForDriverRef.current, {
        transform: waitingForDriver ? 'translateY(0)' : 'translateY(100%)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [waitingForDriver]);

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

  const handleLocationSelect = (type, location) => {
    if (!location) return;
    setSelectedLocations((prev) => ({
      ...prev,
      [type]: { lat: location.lat, lng: location.lng, text: location.text || location.name || '' },
    }));
    if (type === 'pickup') setPickupText(location.text || location.name || `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`);
    else setDestinationText(location.text || location.name || `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`);
  };

  const forwardGeocode = async (text, type) => {
    if (!text || text.length < 3) return;
    try {
      const loc = await searchLocation(text);
      if (!loc) return;
      handleLocationSelect(type, { lat: loc.lat, lng: loc.lng, text });
    } catch (e) {
      console.error('Forward geocode failed', e);
    }
  };

  const openSearchPanelFor = (field) => {
    setActiveField(field);
    setPanelOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-[4] relative">
        <Map
          markers={[
            selectedLocations.pickup && { ...selectedLocations.pickup, text: 'Pickup' },
            selectedLocations.destination && { ...selectedLocations.destination, text: 'Destination' },
          ].filter(Boolean)}
          onLocationSelect={(latlng) => {
            if (!selectedLocations.pickup) {
              handleLocationSelect('pickup', { lat: latlng.lat, lng: latlng.lng, text: 'Picked location' });
              setPickupText('Picked location');
            } else if (!selectedLocations.destination) {
              handleLocationSelect('destination', { lat: latlng.lat, lng: latlng.lng, text: 'Picked location' });
              setDestinationText('Picked location');
            } else {
              handleLocationSelect('destination', { lat: latlng.lat, lng: latlng.lng, text: 'Picked location' });
              setDestinationText('Picked location');
            }
          }}
        />
        {!panelOpen && (
          <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-20 bg-white/90 backdrop-blur-md shadow-md">
            <img
              src={appLogo2}
              alt="Safar Logo"
              className="w-28"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/112';
                console.error('Logo failed to load');
              }}
            />
            <div className="flex items-center gap-3">
              <button
                onClick={useMyLocation}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Use my location
              </button>
              <Link
                to="/login"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
              >
                <i className="text-xl ri-logout-box-r-line text-gray-600"></i>
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className="flex-[1] bg-white p-6 relative shadow-lg">
        <h5
          ref={panelCloseRef}
          onClick={() => setPanelOpen(false)}
          className="absolute opacity-0 top-6 right-6 text-2xl cursor-pointer"
        >
          <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
        </h5>
        <h4 className="text-2xl font-semibold mb-4 text-gray-800">Find a trip</h4>
        <div className="relative">
          <div className="absolute h-16 w-1 top-1/2 -translate-y-1/2 left-4 bg-gray-300 rounded-full"></div>
          <input
            onClick={() => openSearchPanelFor('pickup')}
            value={pickupText}
            onChange={(e) => setPickupText(e.target.value)}
            onBlur={() => forwardGeocode(pickupText, 'pickup')}
            className="w-full px-12 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#138808] focus:border-transparent text-lg placeholder-gray-500"
            type="text"
            placeholder="Add a pick-up location"
          />
          <input
            onClick={() => openSearchPanelFor('destination')}
            value={destinationText}
            onChange={(e) => setDestinationText(e.target.value)}
            onBlur={() => forwardGeocode(destinationText, 'destination')}
            className="w-full px-12 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#138808] focus:border-transparent text-lg mt-4 placeholder-gray-500"
            type="text"
            placeholder="Enter your destination"
          />
        </div>
      </div>
      <div
        ref={panelRef}
        className="h-0 bg-white overflow-y-auto shadow-lg transition-all duration-300"
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
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-30 bottom-0 bg-white px-4 py-6 rounded-t-2xl shadow-2xl"
      >
        <VehiclePanel
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
          selectedLocations={selectedLocations}
        />
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-30 bottom-0 bg-white px-4 py-6 rounded-t-2xl shadow-2xl"
      >
        <ConfirmRide setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-30 bottom-0 bg-white px-4 py-6 rounded-t-2xl shadow-2xl"
      >
        <LookingForDriver setVehicleFound={setVehicleFound} />
      </div>
      <div
        ref={waitingForDriverRef}
        className="fixed w-full z-30 bottom-0 bg-white px-4 py-6 rounded-t-2xl shadow-2xl"
      >
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  );
};

export default Home;