/**
 * Socket.io Example Usage for Uber Clone
 * 
 * This file demonstrates how to use Socket.io in different components
 */

// ============================================
// EXAMPLE 1: Using Socket in Captain Component
// ============================================

import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';

function CaptainComponent() {
  const { socket, isConnected, on, off, emit } = useSocket();
  const [rideRequests, setRideRequests] = useState([]);

  useEffect(() => {
    if (!isConnected) {
      console.log('Socket not connected');
      return;
    }

    // Listen for new ride requests
    const handleNewRide = (rideData) => {
      console.log('📍 New ride request:', rideData);
      setRideRequests(prev => [...prev, rideData]);
      
      // Optional: Show browser notification
      if (Notification.permission === 'granted') {
        new Notification('New Ride Request!', {
          body: `Pickup: ${rideData.pickup?.address}`,
        });
      }
    };

    // Register event listener
    on('ride:new-request', handleNewRide);

    // Mark captain as available
    navigator.geolocation.getCurrentPosition((position) => {
      emit('captain:available', {
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      });
    });

    // Cleanup on unmount
    return () => {
      off('ride:new-request', handleNewRide);
    };
  }, [isConnected, on, off, emit]);

  const acceptRide = (ride) => {
    emit('captain:accept-ride', {
      rideId: ride.rideId,
      userId: ride.userId
    });
    console.log('✅ Accepted ride:', ride.rideId);
  };

  const rejectRide = (ride) => {
    emit('captain:reject-ride', {
      rideId: ride.rideId
    });
    console.log('❌ Rejected ride:', ride.rideId);
    setRideRequests(prev => prev.filter(r => r.rideId !== ride.rideId));
  };

  return (
    <div>
      <h2>Ride Requests ({rideRequests.length})</h2>
      {rideRequests.map(ride => (
        <div key={ride.rideId}>
          <p>From: {ride.pickup?.address}</p>
          <p>To: {ride.destination?.address}</p>
          <button onClick={() => acceptRide(ride)}>Accept</button>
          <button onClick={() => rejectRide(ride)}>Reject</button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 2: Using Socket in User Component
// ============================================

function UserComponent() {
  const { socket, isConnected, on, off, emit } = useSocket();
  const [driverLocation, setDriverLocation] = useState(null);
  const [rideStatus, setRideStatus] = useState('idle'); // idle, searching, found, riding

  useEffect(() => {
    if (!isConnected) return;

    // Listen for ride acceptance
    const handleRideAccepted = (rideData) => {
      console.log('🚗 Driver found:', rideData);
      setRideStatus('found');
      setDriverLocation(rideData.captain?.location);
    };

    // Listen for driver location updates
    const handleLocationUpdate = (locationData) => {
      console.log('📍 Driver location:', locationData);
      setDriverLocation(locationData.location);
    };

    on('ride:accepted', handleRideAccepted);
    on('driver:location-update', handleLocationUpdate);

    return () => {
      off('ride:accepted', handleRideAccepted);
      off('driver:location-update', handleLocationUpdate);
    };
  }, [isConnected, on, off]);

  const requestRide = () => {
    setRideStatus('searching');
    
    emit('user:request-ride', {
      pickup: {
        lat: 40.7128,
        lng: -74.0060,
        address: '123 Main St, New York'
      },
      destination: {
        lat: 40.7589,
        lng: -73.9851,
        address: 'Times Square, New York'
      },
      vehicleType: 'car'
    });

    console.log('🔍 Searching for driver...');
  };

  const cancelRide = (rideId) => {
    emit('user:cancel-ride', { rideId });
    setRideStatus('idle');
    setDriverLocation(null);
  };

  return (
    <div>
      <h2>Ride Status: {rideStatus}</h2>
      {driverLocation && (
        <div>
          <p>Driver Location: {driverLocation.lat}, {driverLocation.lng}</p>
        </div>
      )}
      <button onClick={requestRide} disabled={rideStatus !== 'idle'}>
        Request Ride
      </button>
    </div>
  );
}

// ============================================
// EXAMPLE 3: Location Tracking Hook
// ============================================

function useLocationTracking(rideId) {
  const { emit } = useSocket();

  useEffect(() => {
    if (!rideId) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        emit('captain:location-update', {
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          rideId
        });
      },
      (error) => console.error('Location error:', error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [rideId, emit]);
}

// ============================================
// EXAMPLE 4: Connection Status Hook
// ============================================

function useSocketStatus() {
  const { isConnected, error } = useSocket();
  const [status, setStatus] = useState('disconnected');

  useEffect(() => {
    if (error) {
      setStatus('error');
    } else if (isConnected) {
      setStatus('connected');
    } else {
      setStatus('connecting');
    }
  }, [isConnected, error]);

  return status;
}

// Usage:
function StatusIndicator() {
  const status = useSocketStatus();
  
  return (
    <div className={`status-${status}`}>
      {status === 'connected' && '🟢 Connected'}
      {status === 'connecting' && '🟡 Connecting...'}
      {status === 'error' && '🔴 Connection Error'}
    </div>
  );
}

// ============================================
// EXAMPLE 5: Testing Socket Events in Console
// ============================================

/*
// Open browser console and run:

// 1. Get socket instance
const socket = window.socket; // If you expose it globally for debugging

// 2. Listen to events
socket.on('ride:new-request', (data) => {
  console.log('New ride:', data);
});

// 3. Emit events
socket.emit('captain:available', {
  location: { lat: 40.7128, lng: -74.0060 }
});

// 4. Check connection
console.log('Connected:', socket.connected);

// 5. Check rooms
socket.emit('get-rooms', (rooms) => {
  console.log('My rooms:', rooms);
});
*/

export {
  CaptainComponent,
  UserComponent,
  useLocationTracking,
  useSocketStatus,
  StatusIndicator
};
