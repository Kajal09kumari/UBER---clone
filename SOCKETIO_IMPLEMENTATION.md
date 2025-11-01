# Socket.io Real-Time Updates Implementation

This document describes the Socket.io implementation for real-time ride updates in the Uber clone application.

## Overview

The Socket.io integration enables real-time communication between users (passengers) and captains (drivers), providing:
- Instant ride request notifications to nearby drivers
- Real-time driver location tracking for users
- Ride acceptance/rejection handling
- Live updates on ride status

## Architecture

### Backend (Node.js/Express)

#### Files Modified/Created:
1. **`Backend/server.js`** - Initialized Socket.io server
2. **`Backend/services/socket.service.js`** - Socket.io service module (NEW)

#### Key Features:
- **Authentication Middleware**: Validates JWT tokens for socket connections
- **User Type Detection**: Automatically identifies users vs captains
- **Room Management**: Creates rooms for users, captains, and individual rides
- **Event Handlers**: Manages ride requests, acceptances, rejections, and location updates

#### Socket Events (Backend):

**Captain Events:**
- `captain:available` - Captain signals availability with location
- `captain:location-update` - Captain sends location updates
- `captain:accept-ride` - Captain accepts a ride request
- `captain:reject-ride` - Captain rejects a ride request

**User Events:**
- `user:request-ride` - User requests a ride
- `user:cancel-ride` - User cancels a ride request

**Server Events (Emitted to clients):**
- `ride:new-request` - New ride request sent to all captains
- `ride:accepted` - Ride acceptance notification sent to user
- `ride:cancelled` - Ride cancellation notification
- `driver:location-update` - Driver location sent to user

### Frontend (React)

#### Files Modified/Created:
1. **`frontend/src/context/SocketContext.jsx`** - Socket context provider (NEW)
2. **`frontend/src/App.jsx`** - Wrapped with SocketProvider
3. **`frontend/src/pages/CaptainHome.jsx`** - Integrated ride request listeners
4. **`frontend/src/pages/Home.jsx`** - Integrated driver location tracking

#### Key Features:
- **Context API**: Provides socket instance throughout the app
- **Auto-reconnection**: Handles connection drops automatically
- **Token Authentication**: Uses localStorage token for authentication
- **Hook API**: Clean `useSocket()` hook for components

## Installation

### Dependencies Installed:

**Backend:**
```bash
npm install socket.io
```

**Frontend:**
```bash
npm install socket.io-client
```

## Configuration

### Backend Configuration

**Environment Variables** (add to `.env`):
```env
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:5173
PORT=3000
```

**CORS Configuration:**
The Socket.io server is configured to accept connections from the frontend URL specified in the environment variables.

### Frontend Configuration

**Environment Variables** (add to `.env`):
```env
VITE_BASE_URL=http://localhost:3000
```

## Usage

### Captain Dashboard

**Receiving Ride Requests:**
```javascript
import { useSocket } from '../context/SocketContext';

const CaptainHome = () => {
  const { socket, isConnected, on, off, emit } = useSocket();
  
  useEffect(() => {
    if (!isConnected) return;
    
    on('ride:new-request', (rideData) => {
      console.log('New ride:', rideData);
      // Show ride popup
    });
    
    return () => off('ride:new-request');
  }, [isConnected]);
};
```

**Accepting/Rejecting Rides:**
```javascript
const handleAcceptRide = () => {
  emit('captain:accept-ride', {
    rideId: rideData.rideId,
    userId: rideData.userId
  });
};

const handleRejectRide = () => {
  emit('captain:reject-ride', {
    rideId: rideData.rideId
  });
};
```

**Sending Location Updates:**
```javascript
// Updates every 5 seconds automatically
useEffect(() => {
  if (!isConnected) return;
  
  const interval = setInterval(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      emit('captain:location-update', {
        location: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        },
        rideId: currentRideId
      });
    });
  }, 5000);
  
  return () => clearInterval(interval);
}, [isConnected]);
```

### User Dashboard

**Requesting a Ride:**
```javascript
const requestRide = (vehicleType) => {
  emit('user:request-ride', {
    pickup: {
      lat: pickupLat,
      lng: pickupLng,
      address: pickupAddress
    },
    destination: {
      lat: destLat,
      lng: destLng,
      address: destAddress
    },
    vehicleType: vehicleType
  });
};
```

**Receiving Driver Location:**
```javascript
useEffect(() => {
  if (!isConnected) return;
  
  on('driver:location-update', (locationData) => {
    setDriverLocation(locationData.location);
    // Update map marker
  });
  
  return () => off('driver:location-update');
}, [isConnected]);
```

**Handling Ride Acceptance:**
```javascript
useEffect(() => {
  if (!isConnected) return;
  
  on('ride:accepted', (rideData) => {
    console.log('Driver found:', rideData.captain);
    setDriverLocation(rideData.captain.location);
    // Show waiting for driver UI
  });
  
  return () => off('ride:accepted');
}, [isConnected]);
```

## Event Flow

### Ride Request Flow:
```
1. User clicks "Request Ride"
   ↓
2. Frontend emits 'user:request-ride' event
   ↓
3. Backend receives event, broadcasts 'ride:new-request' to all captains
   ↓
4. Captain receives notification, reviews ride details
   ↓
5. Captain accepts → emits 'captain:accept-ride'
   ↓
6. Backend receives, emits 'ride:accepted' to user
   ↓
7. User receives driver details and initial location
```

### Location Update Flow:
```
1. Captain accepts ride
   ↓
2. Captain joins ride-specific room
   ↓
3. Captain's device sends location every 5 seconds
   ↓
4. Backend receives 'captain:location-update'
   ↓
5. Backend emits 'driver:location-update' to user's room
   ↓
6. User's map updates driver marker position
```

## Security

### Authentication
- All socket connections require a valid JWT token
- Token is verified on connection handshake
- Invalid tokens are rejected immediately

### Room Isolation
- Users and captains are placed in separate rooms
- Ride-specific rooms created for 1-on-1 communication
- Location updates only sent to relevant users

## Testing

### Testing Socket Connection:
1. Start the backend server: `npm start` (in Backend folder)
2. Start the frontend: `npm run dev` (in frontend folder)
3. Login as a user and captain in separate browser windows
4. Request a ride from user dashboard
5. Verify captain receives notification
6. Accept ride from captain dashboard
7. Verify user sees driver found message
8. Check browser console for location updates

### Manual Testing with Browser DevTools:
```javascript
// In browser console (after login):
const token = localStorage.getItem('token');
const socket = io('http://localhost:3000', {
  auth: { token }
});

socket.on('connect', () => console.log('Connected!'));
socket.on('ride:new-request', (data) => console.log('Ride:', data));
```

## Troubleshooting

### Connection Issues:
- **Error: "Authentication error: No token provided"**
  - Ensure user is logged in
  - Check localStorage for token
  
- **Error: "CORS error"**
  - Verify FRONTEND_URL in backend .env
  - Check CORS configuration in socket.service.js

- **Connection keeps disconnecting:**
  - Check network stability
  - Verify JWT token hasn't expired
  - Check server logs for errors

### No Events Received:
- Verify socket is connected: check `isConnected` state
- Ensure event listeners are registered after connection
- Check room membership in server logs
- Verify event names match exactly (case-sensitive)

## Future Enhancements

1. **Ride Persistence**: Store ride data in database
2. **Notification System**: Push notifications for mobile apps
3. **Geofencing**: Proximity-based driver matching
4. **Ride History**: Real-time ride tracking in database
5. **Performance Monitoring**: Socket connection analytics
6. **Message Queue**: Handle high-volume ride requests
7. **WebRTC**: Voice/video calling between user and captain

## API Reference

### Socket Events Reference

| Event Name | Direction | Data | Description |
|------------|-----------|------|-------------|
| `captain:available` | Captain → Server | `{ location: { lat, lng } }` | Captain signals availability |
| `captain:location-update` | Captain → Server | `{ location: { lat, lng }, rideId }` | Location update during ride |
| `captain:accept-ride` | Captain → Server | `{ rideId, userId }` | Accept ride request |
| `captain:reject-ride` | Captain → Server | `{ rideId }` | Reject ride request |
| `user:request-ride` | User → Server | `{ pickup, destination, vehicleType }` | Request a ride |
| `user:cancel-ride` | User → Server | `{ rideId }` | Cancel ride request |
| `ride:new-request` | Server → Captains | `{ rideId, userId, user, pickup, destination, vehicleType }` | New ride available |
| `ride:accepted` | Server → User | `{ captainId, captain, rideId }` | Captain accepted ride |
| `ride:cancelled` | Server → Captains | `{ rideId }` | User cancelled ride |
| `driver:location-update` | Server → User | `{ location, captainId }` | Driver location update |

## Contributing

When adding new socket events:
1. Add event handler in `socket.service.js`
2. Document event in this README
3. Add corresponding listener in frontend component
4. Test event flow end-to-end
5. Update type definitions if using TypeScript

## License

This implementation is part of the Uber clone open-source project.
