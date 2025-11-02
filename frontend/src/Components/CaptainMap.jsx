import { useEffect, useRef, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './CaptainMap.css';
import { Icon, LatLngBounds, divIcon } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import socket from '../utils/socket';

// Fix default marker icons
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom Captain Marker Icon (car/driver marker)
const captainIcon = divIcon({
  className: 'custom-captain-marker',
  html: `<div style="background-color: #3b82f6; border: 3px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Custom Pickup Marker Icon (green pin)
const pickupIcon = divIcon({
  className: 'custom-pickup-marker',
  html: `<div style="position: relative;">
    <div style="background-color: #10b981; border: 3px solid white; border-radius: 50% 50% 50% 0; width: 36px; height: 36px; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(0,0,0,0.3);">
      <div style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 18px;">P</div>
    </div>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

// Custom Drop-off Marker Icon (red pin)
const dropoffIcon = divIcon({
  className: 'custom-dropoff-marker',
  html: `<div style="position: relative;">
    <div style="background-color: #ef4444; border: 3px solid white; border-radius: 50% 50% 50% 0; width: 36px; height: 36px; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(0,0,0,0.3);">
      <div style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 18px;">D</div>
    </div>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

// Component to handle map recenter
const RecenterButton = ({ center, onRecenter }) => {
  const map = useMap();

  const handleRecenter = () => {
    if (center) {
      map.setView(center, map.getZoom());
      if (onRecenter) onRecenter();
    }
  };

  return (
    <button
      onClick={handleRecenter}
      className="absolute bottom-40 right-3 z-[1000] bg-white hover:bg-gray-100 transition-colors p-3 rounded-lg shadow-lg border border-gray-200"
      title="Recenter to current location"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    </button>
  );
};

// Component to auto-fit bounds when markers change
const AutoFitBounds = ({ markers, routeCoords }) => {
  const map = useMap();

  useEffect(() => {
    const all = [];
    markers.forEach((m) => {
      if (m && m.lat && m.lng) {
        all.push([m.lat, m.lng]);
      }
    });
    routeCoords.forEach((p) => all.push(p));

    if (all.length > 0) {
      const bounds = new LatLngBounds(all);
      map.fitBounds(bounds.pad(0.15));
    }
  }, [map, JSON.stringify(markers), routeCoords.length]);

  return null;
};

const CaptainMap = ({
  center,
  pickupLocation = null,
  dropoffLocation = null,
  showRoute = false,
  autoFitBounds = false,
}) => {
  const [captainLocation, setCaptainLocation] = useState(center || [28.6139, 77.2090]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distanceKm, setDistanceKm] = useState(null);
  const [durationMin, setDurationMin] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);

  // Real-time GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = [position.coords.latitude, position.coords.longitude];
        setCaptainLocation(newLocation);
        setLocationError(null);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Unable to retrieve your location');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Watch position for real-time updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = [position.coords.latitude, position.coords.longitude];
        setCaptainLocation(newLocation);
        setLocationError(null);
      },
      (error) => {
        console.error('Geolocation watch error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000, // Accept cached position up to 1 second old
      }
    );

    // Cleanup on unmount
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Emit captain location to server via Socket.IO
  useEffect(() => {
    if (!captainLocation) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    const [lat, lng] = captainLocation;
    const rideId = localStorage.getItem('rideId') || undefined;
    socket.emit('captain:location', { token, lat, lng, rideId });
  }, [captainLocation?.[0], captainLocation?.[1]]);

  // Fetch route when pickup and dropoff are available
  useEffect(() => {
    if (!showRoute || !pickupLocation || !dropoffLocation) {
      setRouteCoords([]);
      setDistanceKm(null);
      setDurationMin(null);
      return;
    }

    const url = `https://router.project-osrm.org/route/v1/driving/${pickupLocation.lng},${pickupLocation.lat};${dropoffLocation.lng},${dropoffLocation.lat}?overview=full&geometries=geojson`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const coords = data?.routes?.[0]?.geometry?.coordinates || [];
        const latlngs = coords.map(([lng, lat]) => [lat, lng]);
        setRouteCoords(latlngs);

        const route = data?.routes?.[0];
        if (route) {
          setDistanceKm(route.distance / 1000);
          setDurationMin(route.duration / 60);
        }
      })
      .catch((e) => {
        console.error('OSRM route error', e);
        setRouteCoords([]);
      });
  }, [showRoute, pickupLocation?.lat, pickupLocation?.lng, dropoffLocation?.lat, dropoffLocation?.lng]);

  // Prepare markers array
  const allMarkers = useMemo(() => {
    const markers = [];
    if (pickupLocation) markers.push(pickupLocation);
    if (dropoffLocation) markers.push(dropoffLocation);
    return markers;
  }, [pickupLocation, dropoffLocation]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={captainLocation}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        ref={mapRef}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
          minZoom={3}
        />

        {/* Captain's Current Location Marker */}
        <Marker position={captainLocation} icon={captainIcon}>
          <Popup>
            <div className="font-semibold">Your Current Location</div>
            <div className="text-xs text-gray-600">
              {captainLocation[0].toFixed(6)}, {captainLocation[1].toFixed(6)}
            </div>
          </Popup>
        </Marker>

        {/* Pickup Location Marker */}
        {pickupLocation && (
          <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
            <Popup>
              <div className="font-semibold text-green-600">Pickup Location</div>
              {pickupLocation.address && (
                <div className="text-xs text-gray-600 mt-1">{pickupLocation.address}</div>
              )}
            </Popup>
          </Marker>
        )}

        {/* Drop-off Location Marker */}
        {dropoffLocation && (
          <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={dropoffIcon}>
            <Popup>
              <div className="font-semibold text-red-600">Drop-off Location</div>
              {dropoffLocation.address && (
                <div className="text-xs text-gray-600 mt-1">{dropoffLocation.address}</div>
              )}
            </Popup>
          </Marker>
        )}

        {/* Route Polyline */}
        {showRoute && routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            color="#3b82f6"
            weight={5}
            opacity={0.7}
          />
        )}

        {/* Zoom Controls */}
        <ZoomControl position="bottomright" />

        {/* Auto-fit bounds if enabled */}
        {autoFitBounds && <AutoFitBounds markers={allMarkers} routeCoords={routeCoords} />}

        {/* Recenter Button */}
        <RecenterButton center={captainLocation} />
      </MapContainer>

      {/* Distance/ETA Badge */}
      {showRoute && distanceKm != null && durationMin != null && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-[1000]">
          🚗 {distanceKm.toFixed(1)} km • ⏱️ {Math.ceil(durationMin)} min
        </div>
      )}

      {/* Location Error Message */}
      {locationError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-lg text-sm z-[1000]">
          ⚠️ {locationError}
        </div>
      )}

      {/* Attribution Badge */}
      <div className="absolute bottom-1 left-1 bg-white bg-opacity-80 px-2 py-1 text-[10px] text-gray-600 rounded z-[1000]">
        Powered by OpenStreetMap
      </div>
    </div>
  );
};

export default CaptainMap;
