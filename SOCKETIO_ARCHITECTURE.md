# Socket.io Architecture & Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         UBER CLONE SYSTEM                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐                              ┌──────────────────┐
│   USER DEVICE    │                              │  CAPTAIN DEVICE  │
│   (Browser)      │                              │   (Browser)      │
│                  │                              │                  │
│  ┌────────────┐  │                              │  ┌────────────┐  │
│  │ Home.jsx   │  │                              │  │CaptainHome │  │
│  │            │  │                              │  │   .jsx     │  │
│  │ - Request  │  │                              │  │            │  │
│  │   Ride     │  │                              │  │ - Accept   │  │
│  │ - Track    │  │                              │  │   Ride     │  │
│  │   Driver   │  │                              │  │ - Send     │  │
│  └─────┬──────┘  │                              │  │   Location │  │
│        │         │                              │  └─────┬──────┘  │
│  ┌─────▼──────┐  │                              │  ┌─────▼──────┐  │
│  │ Socket     │  │                              │  │ Socket     │  │
│  │ Context    │  │                              │  │ Context    │  │
│  └─────┬──────┘  │                              │  └─────┬──────┘  │
└────────┼─────────┘                              └────────┼─────────┘
         │                                                 │
         │ socket.io-client                   socket.io-client
         │ (WebSocket)                           (WebSocket)
         │                                                 │
    ┌────▼─────────────────────────────────────────────────▼────┐
    │                    SOCKET.IO SERVER                        │
    │                    (server.js)                             │
    │                                                             │
    │  ┌──────────────────────────────────────────────────────┐ │
    │  │  Connection Manager                                   │ │
    │  │  - Handle connect/disconnect                          │ │
    │  │  - Manage socket rooms                                │ │
    │  │  - Store socket IDs in database                       │ │
    │  └──────────────────────────────────────────────────────┘ │
    │                                                             │
    │  ┌──────────────────────────────────────────────────────┐ │
    │  │  Event Handlers                                       │ │
    │  │  - join: Join socket room                             │ │
    │  │  - update-location-captain: Receive location          │ │
    │  └──────────────────────────────────────────────────────┘ │
    │                                                             │
    │  ┌──────────────────────────────────────────────────────┐ │
    │  │  Event Emitters                                       │ │
    │  │  - new-ride-request                                   │ │
    │  │  - ride-accepted                                      │ │
    │  │  - ride-started                                       │ │
    │  │  - ride-completed                                     │ │
    │  │  - captain-location-update                            │ │
    │  └──────────────────────────────────────────────────────┘ │
    └────────────┬──────────────────────────┬────────────────────┘
                 │                          │
                 │ HTTP/REST API            │
                 │                          │
    ┌────────────▼──────────┐  ┌───────────▼──────────────┐
    │  Ride Controller       │  │  Socket Service          │
    │  (ride.controller.js)  │  │  (socket.service.js)     │
    │                        │  │                          │
    │  - POST /rides/create  │  │  - sendRideRequest()     │
    │  - POST /rides/accept  │  │  - sendRideAccepted()    │
    │  - POST /rides/start   │  │  - sendRideStarted()     │
    │  - POST /rides/complete│  │  - sendRideCompleted()   │
    │  - POST /rides/update  │  │  - broadcastLocation()   │
    └────────────┬───────────┘  └──────────────────────────┘
                 │
    ┌────────────▼────────────┐
    │   Ride Service          │
    │   (ride.service.js)     │
    │                         │
    │   - createRide()        │
    │   - acceptRide()        │
    │   - startRide()         │
    │   - completeRide()      │
    │   - findNearbyDrivers() │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │   MongoDB Database      │
    │                         │
    │   - users               │
    │   - captains            │
    │   - rides               │
    │   - blacklistTokens     │
    └─────────────────────────┘
```

## Ride Request Flow

```
USER                        BACKEND                      CAPTAIN
 │                             │                            │
 │  1. Create Ride Request     │                            │
 ├──POST /rides/create────────>│                            │
 │                             │                            │
 │                             │ 2. Find nearby drivers     │
 │                             │    (geospatial query)      │
 │                             │                            │
 │                             │ 3. Emit "new-ride-request" │
 │                             ├───────────────────────────>│
 │                             │                            │
 │                             │                 4. Show popup & notify
 │                             │                            │
 │                             │  5. Click "Accept"         │
 │                             │<──POST /rides/accept───────┤
 │                             │                            │
 │ 6. Emit "ride-accepted"     │                            │
 │<────────────────────────────┤                            │
 │                             │                            │
 │ 7. Show driver info         │                            │
 │    Display OTP              │                            │
 │                             │                            │
```

## Real-Time Location Tracking

```
CAPTAIN                       BACKEND                       USER
   │                             │                            │
   │ 1. Auto location update     │                            │
   │    (every 10 seconds)       │                            │
   ├──emit('update-location')───>│                            │
   │                             │                            │
   │                             │ 2. Update DB location      │
   │                             │                            │
   │                             │ 3. Broadcast location      │
   │                             ├───────────────────────────>│
   │                             │                            │
   │                             │              4. Update map marker
   │                             │                 Show driver position
   │                             │                            │
   │ 5. Move to new location     │                            │
   ├──emit('update-location')───>│                            │
   │                             │                            │
   │                             ├───────────────────────────>│
   │                             │                            │
   │                             │              6. Animate marker
   │                             │                 to new position
```

## Complete Ride Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│                    RIDE LIFECYCLE STATES                      │
└──────────────────────────────────────────────────────────────┘

    PENDING
       │
       │ User creates ride
       │ Socket: new-ride-request → Nearby Captains
       │
       ▼
    ACCEPTED
       │
       │ Captain accepts ride
       │ Socket: ride-accepted → User
       │ User sees driver info + OTP
       │
       ▼
    ONGOING
       │
       │ Captain enters OTP
       │ Socket: ride-started → User
       │ Live tracking active
       │
       ▼
   COMPLETED
       │
       │ Captain completes ride
       │ Socket: ride-completed → Both parties
       │ Show fare, reset UI
       │
       ▼
    (END)

Alternative paths:
    PENDING/ACCEPTED/ONGOING → CANCELLED (future feature)
```

## Socket Events Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     SOCKET EVENTS MAP                        │
└─────────────────────────────────────────────────────────────┘

CLIENT → SERVER (Incoming)
─────────────────────────────
┌──────────────────┐
│ join             │ → Data: { userId, userType }
│                  │   Action: Join socket room, update DB
└──────────────────┘

┌──────────────────┐
│ update-location  │ → Data: { userId, location }
│ -captain         │   Action: Update DB, broadcast to users
└──────────────────┘


SERVER → CLIENT (Outgoing)
─────────────────────────────
┌──────────────────┐
│ new-ride-request │ → To: Nearby Captains
│                  │   Data: { rideId, pickup, destination, fare }
└──────────────────┘

┌──────────────────┐
│ ride-accepted    │ → To: Specific User
│                  │   Data: { rideId, captain, otp }
└──────────────────┘

┌──────────────────┐
│ ride-started     │ → To: Specific User
│                  │   Data: { rideId, status }
└──────────────────┘

┌──────────────────┐
│ ride-completed   │ → To: User & Captain
│                  │   Data: { rideId, status, fare }
└──────────────────┘

┌──────────────────┐
│ captain-location │ → To: All Users (broadcast)
│ -update          │   Data: { captainId, location }
└──────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE MODELS                          │
└─────────────────────────────────────────────────────────────┘

USER MODEL
──────────
{
  _id: ObjectId,
  fullname: { firstname, lastname },
  email: String,
  password: String (hashed),
  socketId: String ← Socket connection ID
}

CAPTAIN MODEL
─────────────
{
  _id: ObjectId,
  fullname: { firstname, lastname },
  email: String,
  password: String (hashed),
  socketId: String ← Socket connection ID
  status: "online" | "offline" | "on-trip",
  vehicle: {
    color: String,
    plate: String,
    capacity: Number,
    vehicleType: "car" | "motorcycle" | "auto"
  },
  location: {
    lat: Number,
    lng: Number
  }
}

RIDE MODEL
──────────
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  captain: ObjectId (ref: Captain),
  pickup: {
    address: String,
    coordinates: { lat, lng }
  },
  destination: {
    address: String,
    coordinates: { lat, lng }
  },
  fare: Number,
  distance: Number,
  duration: Number,
  status: "pending" | "accepted" | "ongoing" | "completed",
  vehicleType: "car" | "motorcycle" | "auto",
  otp: String (4 digits),
  createdAt: Date,
  updatedAt: Date
}
```

## Connection Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                  CONNECTION LIFECYCLE                        │
└─────────────────────────────────────────────────────────────┘

CLIENT CONNECTS
       │
       ▼
┌──────────────┐
│ socket.on    │ Server receives connection
│ ('connect')  │ Assign socket.id
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Client emits │ Client: emit('join', { userId, userType })
│ 'join'       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Server       │ 1. Join socket room: socket.join(userId)
│ processes    │ 2. Update DB: set socketId
│ 'join'       │ 3. Set status: "online" (if captain)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Active       │ Client and server exchange events
│ Connection   │ Location updates, ride events, etc.
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ socket.on    │ Client closes tab or loses connection
│ ('disconnect)│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Server       │ 1. Clear socketId in DB
│ cleanup      │ 2. Set captain status: "offline"
│              │ 3. Leave all rooms
└──────────────┘
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                          │
└─────────────────────────────────────────────────────────────┘

HTTP REQUESTS (REST API)
────────────────────────
Client Request
    │
    ▼
┌────────────────┐
│ JWT Token in   │ Authorization: Bearer <token>
│ Header         │
└────┬───────────┘
     │
     ▼
┌────────────────┐
│ Auth Middleware│ authUser / authCaptain
│                │ Verify token, extract user/captain ID
└────┬───────────┘
     │
     ▼
┌────────────────┐
│ Controller     │ req.user or req.captain available
│                │ Process request
└────────────────┘

SOCKET CONNECTIONS
──────────────────
Client Connection
    │
    ▼
┌────────────────┐
│ CORS Check     │ Verify origin in server.js
│                │ Only allow configured origins
└────┬───────────┘
     │
     ▼
┌────────────────┐
│ Socket Rooms   │ Each user joins private room by ID
│                │ Events sent only to specific rooms
└────┬───────────┘
     │
     ▼
┌────────────────┐
│ Database       │ Socket ID stored securely
│ Validation     │ Only authenticated users have socket IDs
└────────────────┘

RIDE OTP VERIFICATION
─────────────────────
User sees OTP → Captain enters OTP → Backend verifies
                                     4-digit code match
                                     ↓
                                  Allow ride start
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                 PERFORMANCE OPTIMIZATIONS                    │
└─────────────────────────────────────────────────────────────┘

LOCATION UPDATES
────────────────
Throttled to 10 seconds
    ↓
┌──────────────────┐
│ Browser gets     │ High accuracy geolocation
│ location         │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Send to server   │ Only if changed significantly
│                  │ (could add distance threshold)
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Update database  │ Single update operation
│                  │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Broadcast        │ socket.broadcast (not to sender)
│                  │ Reduces redundant data
└──────────────────┘

NEARBY DRIVER SEARCH
────────────────────
Geospatial query with radius limit (5km default)
    ↓
Only query "online" captains with matching vehicle type
    ↓
Return limited set (not all drivers globally)

SOCKET ROOMS
────────────
Private rooms per user ID
    ↓
Events sent only to relevant parties
    ↓
No global broadcasts except location updates
    ↓
Reduces network traffic and CPU usage

AUTO-RECONNECTION
─────────────────
Socket.io built-in retry logic
    ↓
Exponential backoff
    ↓
Max 5 reconnection attempts
    ↓
User sees connection status
```

---

This architecture ensures:
✅ Real-time bidirectional communication
✅ Scalable socket room management
✅ Secure authentication at both HTTP and Socket layers
✅ Optimized location tracking
✅ Clean separation of concerns
