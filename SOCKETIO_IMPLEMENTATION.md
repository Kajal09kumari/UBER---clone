# Socket.io Real-Time Updates Implementation

## Overview
This implementation adds real-time communication between users and drivers using Socket.io, enabling instant ride requests, location tracking, and ride status updates.

## Features Implemented

### Backend (Node.js/Express)

#### 1. Socket.io Server Setup (`server.js`)
- ✅ Socket.io server initialized with CORS configuration
- ✅ Connection and disconnection handling
- ✅ Socket ID storage in user and captain models
- ✅ Automatic captain status updates (online/offline)
- ✅ Real-time location broadcasting

#### 2. Ride Management System
**Models:**
- `ride.model.js` - Ride schema with pickup, destination, fare, status, and OTP

**Services:**
- `ride.service.js` - Business logic for ride lifecycle (create, accept, start, complete)
- `socket.service.js` - Socket event emission helpers

**Controllers:**
- `ride.controller.js` - HTTP endpoints for ride operations

**Routes:**
- `ride.routes.js` - API routes for ride management:
  - `POST /rides/create` - Create new ride request
  - `POST /rides/accept` - Captain accepts ride
  - `POST /rides/start` - Captain starts ride with OTP
  - `POST /rides/complete` - Complete ride
  - `POST /rides/update-location` - Update captain location
  - `GET /rides/:rideId` - Get ride details
  - `GET /rides/user/history` - User ride history
  - `GET /rides/captain/history` - Captain ride history

#### 3. Socket Events (Backend)

**Incoming Events:**
- `join` - User/Captain joins their room
- `update-location-captain` - Captain sends location update

**Outgoing Events:**
- `new-ride-request` - Sent to nearby drivers when user requests ride
- `ride-accepted` - Sent to user when captain accepts ride
- `ride-started` - Sent to user when ride begins
- `ride-completed` - Sent to both user and captain
- `captain-location-update` - Broadcast captain's real-time location

### Frontend (React)

#### 1. Socket Context (`SocketContext.jsx`)
- ✅ Centralized Socket.io client management
- ✅ Auto-reconnection logic
- ✅ Connection status tracking
- ✅ Helper methods for common operations:
  - `joinRoom(userId, userType)` - Join socket room
  - `updateCaptainLocation(userId, location)` - Emit location updates

#### 2. Captain Dashboard (`CaptainHome.jsx`)
**Features:**
- ✅ Listens for `new-ride-request` events
- ✅ Displays incoming ride requests in popup
- ✅ Shows connection status indicator
- ✅ Browser notifications for new rides
- ✅ Automatic location updates every 10 seconds
- ✅ Geolocation permission handling

**Socket Integration:**
```javascript
// Listen for new ride requests
socket.on('new-ride-request', (rideData) => {
  // Display ride popup
  // Show notification
})

// Send location updates
updateCaptainLocation(captainId, { lat, lng })
```

#### 3. User Dashboard (`Home.jsx`)
**Features:**
- ✅ Listens for `ride-accepted` events
- ✅ Listens for `captain-location-update` events
- ✅ Real-time driver location tracking on map
- ✅ Shows connection status indicator
- ✅ Browser notifications for ride updates
- ✅ Displays driver info when ride is accepted

**Socket Integration:**
```javascript
// Listen for ride acceptance
socket.on('ride-accepted', (rideData) => {
  // Update UI with driver info
  // Show notification
})

// Listen for driver location
socket.on('captain-location-update', (data) => {
  // Update driver marker on map
})

// Listen for ride status changes
socket.on('ride-started', handleRideStarted)
socket.on('ride-completed', handleRideCompleted)
```

## Installation

### Backend Dependencies
```bash
cd Backend
npm install socket.io
```

### Frontend Dependencies
```bash
cd frontend
npm install socket.io-client
```

## Configuration

### Backend Environment Variables
Add to `.env`:
```env
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Frontend Environment Variables
Add to `.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_BASE_URL=http://localhost:3000
```

## Usage Flow

### 1. User Requests a Ride
```
User (Home.jsx) -> POST /rides/create
                -> Backend finds nearby drivers
                -> Socket emits 'new-ride-request' to drivers
                -> Captain (CaptainHome.jsx) receives notification
```

### 2. Captain Accepts Ride
```
Captain clicks accept -> POST /rides/accept
                      -> Socket emits 'ride-accepted' to user
                      -> User sees driver info and location
```

### 3. Real-Time Location Tracking
```
Captain moves -> Auto-updates location every 10s
              -> Socket emits 'update-location-captain'
              -> Backend broadcasts 'captain-location-update'
              -> User sees live driver position on map
```

### 4. Ride Start (OTP Verification)
```
Captain enters OTP -> POST /rides/start
                   -> Socket emits 'ride-started' to user
                   -> User notified ride has begun
```

### 5. Ride Completion
```
Captain completes -> POST /rides/complete
                  -> Socket emits 'ride-completed' to both
                  -> Both see completion status and fare
```

## API Endpoints

### Ride Management

#### Create Ride
```http
POST /rides/create
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "pickup": {
    "address": "123 Main St",
    "coordinates": { "lat": 40.7128, "lng": -74.0060 }
  },
  "destination": {
    "address": "456 Park Ave",
    "coordinates": { "lat": 40.7589, "lng": -73.9851 }
  },
  "vehicleType": "car",
  "distance": 5.2,
  "duration": 15
}
```

#### Accept Ride
```http
POST /rides/accept
Authorization: Bearer <captain_token>
Content-Type: application/json

{
  "rideId": "ride_id_here"
}
```

#### Start Ride
```http
POST /rides/start
Authorization: Bearer <captain_token>
Content-Type: application/json

{
  "rideId": "ride_id_here",
  "otp": "1234"
}
```

#### Update Captain Location
```http
POST /rides/update-location
Authorization: Bearer <captain_token>
Content-Type: application/json

{
  "lat": 40.7128,
  "lng": -74.0060
}
```

## Socket Events Reference

### Client → Server

| Event | Data | Description |
|-------|------|-------------|
| `join` | `{ userId, userType }` | Join socket room |
| `update-location-captain` | `{ userId, location }` | Captain location update |

### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| `new-ride-request` | `{ rideId, pickup, destination, fare, ... }` | New ride request |
| `ride-accepted` | `{ rideId, captain, otp, status }` | Ride accepted by driver |
| `ride-started` | `{ rideId, status, captain }` | Ride has started |
| `ride-completed` | `{ rideId, status, fare }` | Ride completed |
| `captain-location-update` | `{ captainId, location }` | Driver location update |

## Testing

### 1. Test Socket Connection
- Open browser console
- Check for "Socket connected: <socket_id>" message
- Green dot should appear in UI

### 2. Test Ride Request Flow
1. Login as user
2. Set pickup and destination
3. Create ride request
4. Open captain dashboard in another tab
5. Verify captain receives notification

### 3. Test Location Tracking
1. Accept ride as captain
2. Grant location permissions
3. Watch user map update with captain location
4. Move around (or use browser location spoofing)

## Browser Notifications

The app requests notification permissions for:
- New ride requests (Captain)
- Ride accepted (User)
- Ride started (User)
- Ride completed (Both)

Grant permissions when prompted for best experience.

## Troubleshooting

### Socket Not Connecting
- Check CORS settings in `server.js`
- Verify `VITE_API_URL` in frontend `.env`
- Ensure backend server is running

### Notifications Not Appearing
- Check browser notification permissions
- Make sure notifications are enabled for localhost
- Try in an incognito window

### Location Not Updating
- Verify geolocation permissions
- Check browser console for errors
- Ensure HTTPS in production (geolocation requires secure context)

### Ride Request Not Received
- Verify captain is "online" status
- Check captain location is set
- Ensure captain's vehicle type matches request

## Security Considerations

1. **Authentication**: All HTTP endpoints use JWT authentication
2. **Socket Rooms**: Users/Captains join private rooms by ID
3. **OTP Verification**: 4-digit OTP required to start ride
4. **Location Privacy**: Only broadcast to relevant parties

## Performance Optimizations

1. **Location Updates**: Throttled to 10-second intervals
2. **Nearby Driver Search**: Uses geospatial queries with radius limit
3. **Socket Rooms**: Targeted event emission to specific users
4. **Auto Reconnection**: Built-in retry logic for dropped connections

## Future Enhancements

- [ ] Add ride cancellation support
- [ ] Implement driver rating system
- [ ] Add surge pricing logic
- [ ] Support multiple simultaneous rides
- [ ] Add ride history filtering
- [ ] Implement ETA calculations
- [ ] Add chat between user and driver
- [ ] Support ride sharing

## License
This implementation is part of the UBER clone open-source project.

## Contributors
- Socket.io integration completed as per GitHub issue requirements
