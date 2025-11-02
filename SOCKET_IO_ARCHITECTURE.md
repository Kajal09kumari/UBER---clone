# Socket.io Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           UBER CLONE - Socket.io                            │
│                        Real-Time Communication System                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────┐         ┌────────────────────────────────┐
│         FRONTEND (React)       │         │     BACKEND (Node.js/Express)   │
│                                │         │                                 │
│  ┌──────────────────────────┐  │         │  ┌──────────────────────────┐  │
│  │   SocketContext Provider │  │         │  │   Socket.io Server       │  │
│  │  - Global socket instance│  │         │  │  - Connection Manager    │  │
│  │  - Connection management │  │◄────────┼──┤  - Room Management       │  │
│  │  - Reconnection logic    │  │  WSS    │  │  - Event Broadcasting    │  │
│  └──────────────────────────┘  │         │  └──────────────────────────┘  │
│              │                  │         │              │                  │
│    ┌─────────┴─────────┐        │         │    ┌─────────┴─────────┐       │
│    │                   │        │         │    │                   │       │
│  ┌─▼──────────┐  ┌────▼─────┐  │         │  ┌─▼────────┐  ┌──────▼────┐  │
│  │  Captain   │  │   User   │  │         │  │  Socket  │  │   Ride    │  │
│  │   Home     │  │  Riding  │  │         │  │  Service │  │Controller │  │
│  │            │  │          │  │         │  │          │  │           │  │
│  │ - Listen:  │  │ - Listen:│  │         │  │ - Emit   │  │ - REST    │  │
│  │  • new-    │  │  • ride- │  │         │  │  • ride: │  │   API     │  │
│  │   request  │  │   accepted│ │         │  │   new-   │  │           │  │
│  │  • ride-   │  │  • location│ │         │  │   request│  │ - Trigger │  │
│  │   cancelled│  │   updated│  │         │  │  • ride- │  │   Socket  │  │
│  │            │  │  • status│  │         │  │   accepted│ │   Events  │  │
│  │ - Emit:    │  │   update │  │         │  │  • location│ │          │  │
│  │  • join:   │  │          │  │         │  │   updated│  │           │  │
│  │   captain  │  │ - Emit:  │  │         │  │  • status│  │           │  │
│  │  • captain:│  │  • join: │  │         │  │   update │  │           │  │
│  │   available│  │   user   │  │         │  └──────────┘  └───────────┘  │
│  └────────────┘  │  • join: │  │         │                                 │
│                  │   ride   │  │         │  ┌──────────────────────────┐  │
│  ┌──────────────┐└──────────┘  │         │  │    Ride Routes (REST)    │  │
│  │  Captain     │               │         │  │  POST /rides/create      │  │
│  │   Riding     │               │         │  │  POST /rides/accept      │  │
│  │              │               │         │  │  POST /rides/cancel      │  │
│  │ - Location   │               │         │  │  POST /rides/status      │  │
│  │   Tracking   │               │         │  └──────────────────────────┘  │
│  │              │               │         │                                 │
│  │ - Emit:      │               │         │  ┌──────────────────────────┐  │
│  │  • update:   │               │         │  │   Authentication Layer   │  │
│  │   location   │               │         │  │  - authUser middleware   │  │
│  │   (every 5s) │               │         │  │  - authCaptain middleware│  │
│  │  • join:ride │               │         │  └──────────────────────────┘  │
│  └──────────────┘               │         │                                 │
└────────────────────────────────┘         └────────────────────────────────┘
```

## Data Flow Diagrams

### 1. New Ride Request Flow

```
┌──────┐                  ┌─────────┐                  ┌──────────┐
│ User │                  │ Backend │                  │ Captain  │
└──┬───┘                  └────┬────┘                  └────┬─────┘
   │                           │                            │
   │ POST /rides/create        │                            │
   ├──────────────────────────►│                            │
   │                           │                            │
   │                           │ Save to DB (future)        │
   │                           │                            │
   │                           │ socket.emit('ride:new-request')
   │                           ├───────────────────────────►│
   │                           │                            │
   │ 201 Created               │                            │
   │◄──────────────────────────┤                            │
   │                           │                            │
   │                           │                            │ Popup Shows
   │                           │                            │ Notification
   │                           │                            │
   │                           │ POST /rides/accept         │
   │                           │◄───────────────────────────┤
   │                           │                            │
   │                           │ socket.emit('ride:accepted')
   │◄──────────────────────────┤                            │
   │                           │                            │
   │ Notification: Driver Found│                            │
   │                           │                            │
```

### 2. Real-Time Location Tracking Flow

```
┌──────────┐              ┌─────────┐              ┌──────┐
│ Captain  │              │ Backend │              │ User │
│  Riding  │              │ Socket  │              │Riding│
└────┬─────┘              └────┬────┘              └──┬───┘
     │                         │                      │
     │ Geolocation API         │                      │
     │ getCurrentPosition()    │                      │
     ├────────┐                │                      │
     │        │                │                      │
     │◄───────┘                │                      │
     │                         │                      │
     │ socket.emit('update:location')                │
     ├────────────────────────►│                      │
     │                         │                      │
     │                         │ socket.to(ride-room) │
     │                         │   .emit('location:  │
     │                         │    updated')         │
     │                         ├─────────────────────►│
     │                         │                      │
     │                         │                      │ Update Map
     │                         │                      │ Display
     │                         │                      │
     │ (Repeat every 5 seconds)│                      │
     │                         │                      │
```

### 3. Socket Room Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Socket.io Server Rooms                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  User Rooms      │  │  Captain Rooms   │                │
│  │                  │  │                  │                │
│  │  user:user123    │  │  captain:cap456  │                │
│  │  user:user456    │  │  captain:cap789  │                │
│  │  user:user789    │  │  captain:cap012  │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                               │
│  ┌──────────────────────────────────────────────────┐       │
│  │           Available Captains Room                 │       │
│  │  (All captains marked as available join here)    │       │
│  │  - Used for broadcasting new ride requests       │       │
│  └──────────────────────────────────────────────────┘       │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Ride Rooms      │  │                  │                │
│  │                  │  │  ride:ride123    │                │
│  │  ride:ride123    │  │  - user:user123  │                │
│  │  - captain:cap456│  │  - captain:cap456│                │
│  │  - user:user123  │  │                  │                │
│  │                  │  │  (Location       │                │
│  │  (Both parties   │  │   updates sent   │                │
│  │   can send/recv  │  │   only to this   │                │
│  │   ride-specific  │  │   room)          │                │
│  │   messages)      │  │                  │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Component Interaction Map

```
┌────────────────────────────────────────────────────────────────┐
│                     Component Hierarchy                         │
└────────────────────────────────────────────────────────────────┘

App.jsx
  │
  ├─► SocketProvider (Wraps entire app)
  │     │
  │     └─► Provides: { socket, isConnected }
  │
  ├─► UserProtectWrapper
  │     │
  │     └─► Home.jsx
  │     │     │
  │     │     └─► Uses UserContext for user data
  │     │
  │     └─► Riding.jsx
  │           │
  │           ├─► useSocket() → Get socket instance
  │           ├─► useContext(UserDataContext) → Get user ID
  │           │
  │           └─► Socket Listeners:
  │                 - ride:accepted
  │                 - location:updated
  │                 - ride:status-update
  │
  └─► CaptainProtectWrapper
        │
        ├─► CaptainHome.jsx
        │     │
        │     ├─► useSocket() → Get socket instance
        │     ├─► useContext(CaptainDataContext) → Get captain ID
        │     │
        │     ├─► Socket Emitters:
        │     │     - join:captain
        │     │     - captain:availability
        │     │
        │     └─► Socket Listeners:
        │           - ride:new-request
        │           - ride:cancelled
        │
        └─► CaptainRiding.jsx
              │
              ├─► useSocket() → Get socket instance
              ├─► Geolocation API → Track location
              │
              └─► Socket Emitters:
                    - update:location (every 5s)
                    - join:ride
```

## Event Flow Sequence

```
TIME SEQUENCE OF EVENTS
─────────────────────────

T0: Application Start
    │
    ├─► Frontend: SocketProvider initializes
    │   └─► socket.io-client connects to backend
    │
    └─► Backend: Socket.io server listening
        └─► Accepts incoming connections

T1: User/Captain Login
    │
    ├─► User navigates to Home
    │   └─► Emits: join:user(userId)
    │       └─► Server creates user room
    │
    └─► Captain navigates to CaptainHome
        ├─► Emits: join:captain(captainId)
        │   └─► Server creates captain room
        └─► Emits: captain:availability({ isAvailable: true })
            └─► Server adds to 'available-captains' room

T2: User Creates Ride
    │
    ├─► POST /rides/create
    │   └─► Backend processes request
    │       └─► socket.emit('ride:new-request', rideData)
    │           └─► Broadcast to 'available-captains' room
    │
    └─► Captain receives event
        ├─► Shows popup with ride details
        └─► Browser notification displayed

T3: Captain Accepts Ride
    │
    ├─► POST /rides/accept
    │   └─► Backend processes
    │       ├─► socket.emit('ride:accepted', data)
    │       │   └─► Sent to user's room
    │       │
    │       └─► Both join ride room
    │           ├─► Captain emits: join:ride(rideId)
    │           └─► User emits: join:ride(rideId)
    │
    └─► User receives 'ride:accepted'
        └─► Shows driver details, notification

T4: Captain Starts Ride (Active Tracking)
    │
    ├─► Captain on CaptainRiding page
    │   └─► Geolocation API gets position
    │       └─► Every 5 seconds:
    │           └─► Emits: update:location({ location, rideId })
    │
    └─► Backend receives location
        └─► socket.to(ride:rideId).emit('location:updated')
            └─► User receives real-time location
                └─► Updates map display

T5: Ride Status Updates
    │
    ├─► POST /rides/status ({ status: 'arrived' })
    │   └─► Backend emits: ride:status-update
    │       └─► User receives notification
    │
    ├─► POST /rides/status ({ status: 'started' })
    │   └─► User sees status change
    │
    └─► POST /rides/status ({ status: 'completed' })
        └─► Both parties leave ride room

T6: Disconnection/Cleanup
    │
    ├─► User/Captain closes tab or logs out
    │   └─► socket.disconnect()
    │       └─► Backend removes from tracking maps
    │           └─► Leaves all rooms
    │
    └─► Network interruption
        └─► Client automatically attempts reconnection
            └─► Rejoins rooms on successful reconnect
```

## Technology Stack

```
┌────────────────────────────────────────────────┐
│              Technology Stack                   │
├────────────────────────────────────────────────┤
│                                                 │
│  Frontend:                                      │
│  ├─ React 19.1.0                               │
│  ├─ Socket.io-client (latest)                  │
│  ├─ React Router DOM 7.7.1                     │
│  ├─ GSAP 3.13.0 (Animations)                   │
│  ├─ Axios 1.11.0 (HTTP)                        │
│  ├─ Leaflet 1.9.4 (Maps)                       │
│  └─ Tailwind CSS 3.4.17                        │
│                                                 │
│  Backend:                                       │
│  ├─ Node.js                                    │
│  ├─ Express 5.1.0                              │
│  ├─ Socket.io (latest)                         │
│  ├─ MongoDB 6.20.0                             │
│  ├─ Mongoose 8.16.5                            │
│  ├─ JWT (jsonwebtoken 9.0.2)                   │
│  ├─ bcrypt 6.0.0                               │
│  └─ express-validator 7.2.1                    │
│                                                 │
│  Real-Time:                                     │
│  ├─ WebSocket (via Socket.io)                  │
│  ├─ Geolocation API                            │
│  └─ Notifications API                          │
│                                                 │
└────────────────────────────────────────────────┘
```

## Security Architecture

```
┌──────────────────────────────────────────────────┐
│            Security Layers                        │
├──────────────────────────────────────────────────┤
│                                                   │
│  Layer 1: Connection Security                     │
│  ├─ CORS configuration (specific origin)         │
│  ├─ WebSocket handshake validation               │
│  └─ Credentials required                         │
│                                                   │
│  Layer 2: Authentication                          │
│  ├─ JWT token verification on HTTP endpoints     │
│  ├─ authUser middleware for user routes          │
│  └─ authCaptain middleware for captain routes    │
│                                                   │
│  Layer 3: Authorization                           │
│  ├─ Room-based access control                    │
│  ├─ User can only join their own user room       │
│  ├─ Captain can only join their own captain room │
│  └─ Ride room access limited to participants     │
│                                                   │
│  Layer 4: Input Validation                        │
│  ├─ express-validator on all endpoints           │
│  ├─ Coordinate validation                        │
│  └─ Enum validation for vehicle types, statuses  │
│                                                   │
│  Layer 5: Data Isolation                          │
│  ├─ Events scoped to specific rooms              │
│  ├─ Location data tied to ride rooms             │
│  └─ Private messages not broadcasted globally    │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

**For implementation details, see:**
- SOCKET_IO_INTEGRATION.md - Complete documentation
- SOCKET_IO_QUICKSTART.md - Quick start guide
- SOCKET_IO_IMPLEMENTATION_SUMMARY.md - Implementation summary
