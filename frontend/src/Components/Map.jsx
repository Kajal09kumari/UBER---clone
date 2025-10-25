import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl } from 'react-leaflet';
import { LatLngBounds } from 'leaflet'; // Ensure Leaflet is installed
import ClickCapture from './ClickCapture'; // Adjust path as needed

const Map = ({
  center = [28.6139, 77.2090],
  zoom = 13,
  markers = [],
  onLocationSelect,
}) => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [distanceKm, setDistanceKm] = useState(null);
  const [durationMin, setDurationMin] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const valid = markers.filter(Boolean);
    if (valid.length !== 2) {
      setRouteCoords([]);
      setDistanceKm(null);
      setDurationMin(null);
      return;
    }

    const [a, b] = valid;
    const url = `https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`;

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
        } else {
          setDistanceKm(null);
          setDurationMin(null);
        }
      })
      .catch((e) => {
        console.error('OSRM route error', e);
        setRouteCoords([]);
        setDistanceKm(null);
        setDurationMin(null);
      });
  }, [JSON.stringify(markers)]);

  useEffect(() => {
    if (!mapRef.current) return;
    const all = [];
    markers.forEach((m) => all.push([m.lat, m.lng]));
    routeCoords.forEach((p) => all.push(p));
    if (all.length > 0) {
      const bounds = new LatLngBounds(all);
      mapRef.current.fitBounds(bounds.pad(0.15));
    }
  }, [JSON.stringify(markers), routeCoords.length]);

  const memoMarkers = useMemo(() => markers.filter(Boolean), [markers]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <ClickCapture onLocationSelect={onLocationSelect} />

        {memoMarkers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]}>
            <Popup className="rounded-lg shadow">
              <div style={{ maxWidth: 200 }}>
                <div style={{ fontWeight: 600 }}>{marker.text || `Point ${idx + 1}`}</div>
                {marker.text && <div style={{ fontSize: 12, color: '#666' }}>{marker.text}</div>}
              </div>
            </Popup>
          </Marker>
        ))}

        {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}

        <ZoomControl position="bottomright" />
      </MapContainer>

      {distanceKm != null && durationMin != null && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-md text-sm font-medium border border-gray-200">
          🚗 {distanceKm.toFixed(1)} km • ⏱ {Math.ceil(durationMin)} min
        </div>
      )}
    </div>
  );
};

export default Map; // Added this line to export the component