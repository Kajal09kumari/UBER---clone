# Socket.io Implementation Testing Checklist

## Pre-Testing Setup

### 1. Environment Configuration
- [ ] Backend `.env` has `FRONTEND_URL=http://localhost:5173`
- [ ] Frontend `.env` has `VITE_API_URL=http://localhost:3000`
- [ ] MongoDB is running and connected
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)

### 2. Start Services
```bash
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- [ ] Backend server running on port 3000
- [ ] Frontend running on port 5173
- [ ] No errors in either terminal

## Socket Connection Tests

### Test 1: Basic Socket Connection
**User Dashboard:**
- [ ] Open http://localhost:5173
- [ ] Login as a user
- [ ] Check browser console for "Socket connected: <id>"
- [ ] Green connection indicator visible in top-right

**Captain Dashboard:**
- [ ] Open http://localhost:5173/captain/home in new tab
- [ ] Login as captain
- [ ] Check browser console for "Socket connected: <id>"
- [ ] Green connection indicator visible in top-right

**Backend Console:**
- [ ] See "New client connected: <socket_id>" messages
- [ ] See "user <id> joined room" messages

### Test 2: Socket Disconnection
- [ ] Close one of the browser tabs
- [ ] Backend console shows "Client disconnected: <socket_id>"
- [ ] Captain status updated to "offline" (if captain tab closed)

## Ride Request Flow Tests

### Test 3: Create Ride Request (User)
**User Dashboard:**
- [ ] Set pickup location (use "Use my location" or select on map)
- [ ] Set destination location
- [ ] Select vehicle type (car/motorcycle/auto)
- [ ] Click to create ride request
- [ ] API call to `/rides/create` succeeds

**Captain Dashboard (should receive):**
- [ ] Popup appears with new ride request
- [ ] Shows pickup address
- [ ] Shows destination address
- [ ] Shows fare amount
- [ ] Browser notification appears (if permission granted)

**Backend Console:**
- [ ] Shows "new-ride-request" event emitted
- [ ] Lists nearby drivers found

### Test 4: Accept Ride (Captain)
**Captain Dashboard:**
- [ ] Click "Accept" on ride request popup
- [ ] Confirm ride acceptance popup appears
- [ ] API call to `/rides/accept` succeeds

**User Dashboard (should receive):**
- [ ] Notification: "Ride Accepted!"
- [ ] Driver info appears (name, vehicle details)
- [ ] OTP displayed for ride verification
- [ ] Waiting for driver panel shows

**Backend Console:**
- [ ] Shows "ride-accepted" event emitted
- [ ] Ride status updated to "accepted"

## Real-Time Location Tests

### Test 5: Captain Location Updates
**Captain Dashboard:**
- [ ] Grant location permissions when prompted
- [ ] Check browser console for location updates every 10 seconds
- [ ] Console shows "update-location-captain" events

**Backend Console:**
- [ ] Receives location updates from captain
- [ ] Updates captain location in database
- [ ] Broadcasts "captain-location-update" events

**User Dashboard:**
- [ ] Captain marker appears on map
- [ ] Captain marker moves when captain location changes
- [ ] Location updates every ~10 seconds

### Test 6: Manual Location Testing
If you want to test without moving:

**Option A - Browser DevTools:**
1. F12 → Console tab → Three dots → More tools → Sensors
2. Select a location from dropdown or enter custom lat/lng
3. Watch captain location update on user's map

**Option B - Update via API:**
```bash
# Use captain's JWT token
curl -X POST http://localhost:3000/rides/update-location \
  -H "Authorization: Bearer <captain_token>" \
  -H "Content-Type: application/json" \
  -d '{"lat": 40.7128, "lng": -74.0060}'
```

## Ride Lifecycle Tests

### Test 7: Start Ride (Captain)
**Captain Dashboard:**
- [ ] Enter the OTP shown on user's screen
- [ ] Click "Start Ride"
- [ ] API call to `/rides/start` succeeds

**User Dashboard:**
- [ ] Notification: "Ride Started"
- [ ] UI updates to show ride is ongoing
- [ ] Ride status changes

**Backend Console:**
- [ ] OTP verified successfully
- [ ] "ride-started" event emitted
- [ ] Ride status updated to "ongoing"

### Test 8: Complete Ride (Captain)
**Captain Dashboard:**
- [ ] Click "Complete Ride"
- [ ] API call to `/rides/complete` succeeds

**User Dashboard:**
- [ ] Notification: "Ride Completed"
- [ ] Shows final fare
- [ ] Panels close
- [ ] Map resets

**Both Dashboards:**
- [ ] "ride-completed" notification received
- [ ] Ride status is "completed"

## Browser Notification Tests

### Test 9: Notification Permissions
**Chrome/Edge:**
- [ ] Click lock icon in address bar
- [ ] Check "Notifications" is set to "Allow"

**Firefox:**
- [ ] Click lock icon in address bar
- [ ] Check "Notifications" permission

### Test 10: Notification Content
Test each notification appears with correct content:

**Captain:**
- [ ] New Ride Request: Shows pickup address

**User:**
- [ ] Ride Accepted: Shows driver name
- [ ] Ride Started: Confirmation message
- [ ] Ride Completed: Shows fare amount

## Error Handling Tests

### Test 11: Network Interruption
- [ ] Disconnect internet
- [ ] Connection indicator turns red
- [ ] Reconnects when internet restored
- [ ] Connection indicator turns green

### Test 12: Invalid Data
**User creates ride with missing data:**
- [ ] Error message displayed
- [ ] No socket event emitted

**Captain accepts non-existent ride:**
- [ ] Error message displayed
- [ ] Ride status unchanged

**Captain starts ride with wrong OTP:**
- [ ] Error: "Invalid OTP"
- [ ] Ride remains in "accepted" status

### Test 13: Multiple Captains
Open 3 captain tabs:
- [ ] All captains receive same ride request
- [ ] First captain accepts
- [ ] Other captains see ride is no longer available

## Database Verification

### Test 14: Socket ID Storage
**MongoDB Check:**
```javascript
// User collection
db.users.findOne({ email: "test@example.com" })
// Should have socketId field

// Captain collection
db.captains.findOne({ email: "captain@example.com" })
// Should have socketId field and status: "online"
```

- [ ] User document has socketId when connected
- [ ] Captain document has socketId and status when connected
- [ ] socketId cleared on disconnect
- [ ] Captain status changes to "offline" on disconnect

### Test 15: Ride Data
**MongoDB Check:**
```javascript
db.rides.findOne({ status: "pending" })
```

- [ ] Ride created with correct pickup/destination
- [ ] OTP generated (4 digits)
- [ ] Fare calculated correctly
- [ ] User reference set
- [ ] Captain reference empty initially
- [ ] Status changes through lifecycle: pending → accepted → ongoing → completed

## Performance Tests

### Test 16: Multiple Simultaneous Connections
- [ ] Open 5 user tabs
- [ ] Open 5 captain tabs
- [ ] All connect successfully
- [ ] No significant lag
- [ ] Backend handles all connections

### Test 17: Rapid Location Updates
**Captain Dashboard:**
- [ ] Change location rapidly (use browser dev tools)
- [ ] User map updates smoothly
- [ ] No lag or crashes
- [ ] Console shows throttled updates (10s intervals)

## Security Tests

### Test 18: Authentication
**Without Token:**
- [ ] Cannot create ride (401 Unauthorized)
- [ ] Cannot accept ride (401 Unauthorized)
- [ ] Cannot update location (401 Unauthorized)

**With Invalid Token:**
- [ ] All protected routes return 401

### Test 19: Authorization
**User Token on Captain Endpoint:**
- [ ] Cannot accept ride (403 Forbidden)
- [ ] Cannot start ride (403 Forbidden)

**Captain Token on User Endpoint:**
- [ ] Cannot create ride (403 Forbidden)

## Edge Cases

### Test 20: No Nearby Drivers
- [ ] Create ride in remote location
- [ ] Ride created successfully
- [ ] nearbyDriversCount: 0 in response
- [ ] No captains notified

### Test 21: Captain Goes Offline During Ride
- [ ] User creates ride
- [ ] Captain accepts
- [ ] Captain closes tab/disconnects
- [ ] Status updates to "offline"
- [ ] User still has ride info

### Test 22: Rapid Status Changes
- [ ] Create ride
- [ ] Accept immediately
- [ ] Start immediately
- [ ] Complete immediately
- [ ] All events fire correctly
- [ ] No race conditions

## Console Logs Checklist

### Backend Console Should Show:
- [ ] Socket.io server initialization
- [ ] New client connections
- [ ] Join events with user IDs
- [ ] Location update events
- [ ] Disconnect events
- [ ] API requests (ride create/accept/start/complete)

### Frontend Console Should Show:
- [ ] Socket connected messages
- [ ] Join room confirmations
- [ ] Incoming socket events logged
- [ ] No error messages
- [ ] Location permission requests

## Browser DevTools Network Tab

### Check Socket.io Connections:
- [ ] WS (WebSocket) connection established
- [ ] Status: 101 Switching Protocols
- [ ] Multiple frames sent/received
- [ ] Ping/pong frames for keepalive

### Check API Calls:
- [ ] POST /rides/create → 201 Created
- [ ] POST /rides/accept → 200 OK
- [ ] POST /rides/start → 200 OK
- [ ] POST /rides/complete → 200 OK
- [ ] POST /rides/update-location → 200 OK

## Final Verification

### Visual Checks:
- [ ] Green connection dots visible
- [ ] Maps rendering correctly
- [ ] Popups animating smoothly (GSAP)
- [ ] Driver marker on user map
- [ ] No console errors

### Functional Checks:
- [ ] End-to-end ride flow works
- [ ] Real-time updates happening
- [ ] Notifications appearing
- [ ] Database updating correctly

### Documentation Checks:
- [ ] README updated
- [ ] SOCKETIO_IMPLEMENTATION.md complete
- [ ] SOCKET_SUMMARY.md created
- [ ] Code comments added

## Troubleshooting

If any test fails, check:

1. **Connection Issues:**
   - CORS settings in server.js
   - Environment variables
   - Firewall/antivirus blocking ports

2. **Event Not Received:**
   - Socket room joined correctly
   - Event name matches exactly
   - Backend emitting to correct room

3. **Location Not Updating:**
   - Geolocation permissions granted
   - HTTPS in production (required for geolocation)
   - Location update interval (10s)

4. **Database Issues:**
   - MongoDB connection string
   - Model schema matches
   - Indexes created

5. **Authentication Errors:**
   - Token in Authorization header
   - Token not expired
   - Correct user/captain middleware

## Success Criteria

All tests passing = ✅ Implementation Complete!

- [ ] All Backend Tests Passed
- [ ] All Frontend Tests Passed
- [ ] All Integration Tests Passed
- [ ] No Console Errors
- [ ] Documentation Complete
- [ ] Ready for Production

---

**Happy Testing! 🚀**
