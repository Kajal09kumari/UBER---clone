# Socket.io Real-Time Updates Integration

This document explains the Socket.io integration implemented in the UBER clone project for real-time updates between users and captains.

## 📋 Overview

Socket.io has been integrated to provide real-time communication for:
- 🚗 New ride requests to nearby available drivers
- 📍 Real-time driver location tracking for users
- 🔔 Instant ride status updates
- ✅ Ride acceptance notifications

## 🏗️ Architecture

### Backend Components

#### 1. **Socket Service** (`Backend/services/socket.service.js`)
The core Socket.io service managing all real-time connections and events.

**Key Features:**
- Connection management for users and captains
- Room-based communication (user rooms, captain rooms, ride rooms)
- Location tracking and broadcasting
- Event emitters for various ride states

**Main Functions:**
- `initializeSocket(server)` - Initialize Socket.io with HTTP server
- `emitNewRideRequest(rideData, nearbyCaptainIds)` - Send ride requests to captains
- `notifyRideAccepted(userId, rideData)` - Notify user when ride is accepted
- `notifyRideCancelled(captainId, rideData)` - Notify about cancellations
- `notifyRideStatusUpdate(userId, statusData)` - Send status updates

**Socket Events Handled:**
- `join:user` - User connects and joins their room
- `join:captain` - Captain connects and joins their room
- `join:ride` - Join a specific ride room
- `update:location` - Captain sends location updates
- `captain:availability` - Captain updates availability status

#### 2. **Ride Controller** (`Backend/controllers/ride.controller.js`)
HTTP endpoints for ride operations that trigger Socket.io events.

**Endpoints:**
- `POST /rides/create` - Create new ride and notify captains
- `POST /rides/accept` - Captain accepts ride
- `POST /rides/cancel` - Cancel a ride
- `POST /rides/status` - Update ride status

#### 3. **Ride Routes** (`Backend/routes/ride.routes.js`)
Express routes with authentication middleware for ride operations.

### Frontend Components

#### 1. **Socket Context** (`frontend/src/context/SocketContext.jsx`)
React context providing Socket.io client throughout the application.

**Features:**
- Automatic connection management
- Reconnection handling
- Connection status tracking
- Global socket instance

**Usage:**
```javascript
import { useSocket } from '../context/SocketContext';

const { socket, isConnected } = useSocket();
```

#### 2. **Captain Home** (`frontend/src/pages/CaptainHome.jsx`)
Captain dashboard that receives new ride requests.

**Socket Events Listened:**
- `ride:new-request` - Receives new ride requests
- `ride:cancelled` - Notified when rides are cancelled

**Socket Events Emitted:**
- `join:captain` - Joins captain room on mount
- `captain:availability` - Updates availability status

**Features:**
- Browser notifications for new ride requests
- Automatic popup display for new rides
- Connection status indicator

#### 3. **User Riding Page** (`frontend/src/pages/Riding.jsx`)
User's view during an active ride, showing driver location.

**Socket Events Listened:**
- `ride:accepted` - Notified when captain accepts ride
- `location:updated` - Receives real-time driver location
- `ride:status-update` - Gets updates on ride status

**Socket Events Emitted:**
- `join:user` - Joins user room
- `join:ride` - Joins specific ride room

**Features:**
- Real-time driver location display
- Ride status indicators
- Browser notifications for important events

#### 4. **Captain Riding Page** (`frontend/src/pages/CaptainRiding.jsx`)
Captain's view during active ride, broadcasting location.

**Socket Events Emitted:**
- `update:location` - Sends location updates every 5 seconds
- `join:ride` - Joins the ride room

**Features:**
- Geolocation API integration
- Automatic location broadcasting
- Visual feedback for broadcasting status

## 🔧 Setup Instructions

### Backend Setup

1. **Install Socket.io:**
```bash
cd Backend
npm install socket.io
```

2. **Environment Variables:**
Add to `.env`:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
```

3. **Start the Server:**
```bash
npm start
```

### Frontend Setup

1. **Install Socket.io Client:**
```bash
cd frontend
npm install socket.io-client
```

2. **Environment Variables:**
Create/update `.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_BASE_URL=http://localhost:3000
```

3. **Start the Frontend:**
```bash
npm run dev
```

## 📡 Socket.io Events Reference

### Server → Client Events

| Event | Recipient | Payload | Description |
|-------|-----------|---------|-------------|
| `ride:new-request` | Captain | `rideData` | New ride request available |
| `ride:accepted` | User | `{rideId, captain, status}` | Captain accepted the ride |
| `ride:cancelled` | Captain/User | `{rideId, cancelledBy}` | Ride was cancelled |
| `location:updated` | User | `{captainId, location, timestamp}` | Driver's current location |
| `ride:status-update` | User | `{rideId, status, updatedAt}` | Ride status changed |

### Client → Server Events

| Event | Sender | Payload | Description |
|-------|--------|---------|-------------|
| `join:user` | User | `userId` | User connects to their room |
| `join:captain` | Captain | `captainId` | Captain connects to their room |
| `join:ride` | Both | `rideId` | Join a specific ride room |
| `leave:ride` | Both | `rideId` | Leave a ride room |
| `update:location` | Captain | `{captainId, location, rideId}` | Send location update |
| `captain:availability` | Captain | `{captainId, isAvailable}` | Update availability |

## 🔐 Security Considerations

1. **Authentication:** The ride routes use JWT authentication middleware
2. **CORS:** Configured to accept connections only from the frontend URL
3. **Validation:** Input validation on all ride endpoints
4. **Room Isolation:** Users/Captains are isolated in their own rooms

## 📱 Browser Notification Support

The application requests browser notification permissions to alert users about:
- New ride requests (Captain)
- Driver found/arrived (User)
- Ride status changes

**Setup:**
Notifications are automatically requested when:
- Captain opens the dashboard
- User navigates to the riding page

## 🎯 Testing the Integration

### Test New Ride Request Flow:

1. **Start Backend:**
```bash
cd Backend
npm start
```

2. **Start Frontend:**
```bash
cd frontend
npm run dev
```

3. **Create a Ride Request:**
```bash
# Using curl or Postman
POST http://localhost:3000/rides/create
Headers: {
  "Authorization": "Bearer <user-token>",
  "Content-Type": "application/json"
}
Body: {
  "userId": "user123",
  "pickup": {
    "address": "123 Main St",
    "coordinates": { "lat": 28.6139, "lng": 77.2090 }
  },
  "destination": {
    "address": "456 Park Ave",
    "coordinates": { "lat": 28.5355, "lng": 77.3910 }
  },
  "vehicleType": "car"
}
```

4. **Check Captain Dashboard:** The ride request should appear in real-time

### Test Location Tracking:

1. Open browser console on Captain Riding page
2. Check for "Location updated" logs every 5 seconds
3. Open User Riding page and verify location updates are received

## 🐛 Troubleshooting

### Connection Issues

**Problem:** Socket not connecting

**Solutions:**
- Check if backend server is running
- Verify `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors
- Ensure ports 3000 (backend) and 5173 (frontend) are not blocked

### Events Not Received

**Problem:** Socket events not triggering

**Solutions:**
- Verify socket connection status (check `isConnected` state)
- Ensure user/captain has joined their respective rooms
- Check backend logs for emitted events
- Verify event names match exactly (case-sensitive)

### Location Not Broadcasting

**Problem:** Driver location not updating

**Solutions:**
- Check browser's geolocation permissions
- Verify HTTPS or localhost (geolocation requires secure context)
- Check browser console for geolocation errors
- Ensure captain is on the riding page

## 🚀 Future Enhancements

Potential improvements to consider:

1. **Nearby Captain Algorithm:** Implement geospatial queries to find captains within radius
2. **Ride History:** Store and broadcast historical location data
3. **ETA Calculation:** Real-time ETA updates based on current location
4. **Captain Assignment Logic:** Automatic captain assignment based on proximity
5. **Reconnection Handling:** Better UX for connection drops
6. **Message Queue:** Use Redis for scaling Socket.io across multiple servers
7. **Rate Limiting:** Prevent spam on socket events
8. **Analytics:** Track socket events for system monitoring

## 📚 Additional Resources

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Socket.io Client API](https://socket.io/docs/v4/client-api/)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Browser Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

## 🤝 Contributing

When adding new socket events:

1. Document the event in this file
2. Add appropriate error handling
3. Test with both connected and disconnected states
4. Consider backward compatibility
5. Add logging for debugging

## 📄 License

This implementation is part of the UBER clone project and follows the project's license terms.

---

**Last Updated:** November 2, 2025
**Status:** ✅ Production Ready
