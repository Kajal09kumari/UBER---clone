# Quick Start Guide - Socket.io Testing

## Prerequisites
✅ Socket.io dependencies installed
✅ Backend server running
✅ Frontend dev server running
✅ User and Captain accounts created

## Step-by-Step Testing

### 1. Start the Servers

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
```
Expected output:
```
Server is running on port 3000
MongoDB connected
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Expected output:
```
VITE ready at http://localhost:5173
```

### 2. Open Two Browser Windows

**Window 1 - User:**
1. Navigate to `http://localhost:5173`
2. Login as a user
3. Go to `/home`

**Window 2 - Captain:**
1. Navigate to `http://localhost:5173` (in incognito/different browser)
2. Login as a captain
3. Go to `/captain-home`

### 3. Test Ride Request Flow

#### In User Window (Window 1):
1. **Check connection status**
   - Should NOT see "Connecting to server..." banner
   - Open browser console (F12)
   - Look for: `Socket connected: <socket-id>`

2. **Set pickup and destination**
   - Click "Use my location" (or type address)
   - Set destination location
   - Click to select a vehicle type

3. **Request a ride**
   - Click "Choose Vehicle" button
   - Watch for "Looking for driver..." screen

#### In Captain Window (Window 2):
1. **Check connection status**
   - Should see map with captain details at bottom
   - Open browser console (F12)
   - Look for: `Socket connected: <socket-id>`
   - Look for: `Captain <id> is available at: { lat, lng }`

2. **Receive ride request**
   - Ride popup should automatically appear from bottom
   - Should show user details and pickup/destination
   - Console should show: `New ride request received: {...}`

3. **Accept the ride**
   - Click "Accept" button in the popup
   - Console should show: `✅ Accepted ride: <ride-id>`

#### Back in User Window:
1. **Verify driver found**
   - "Looking for driver..." should disappear
   - "Waiting for driver" screen should appear
   - Should see driver details (name, vehicle)
   - Should see driver marker on map

2. **Watch real-time updates**
   - Driver's location should update every 5 seconds
   - Console should show: `Driver location update: { location, captainId }`

### 4. Test Location Updates

#### In Captain Window:
1. **Simulate movement** (if using actual device):
   - Move around with your device
   - Or use browser location spoofing

2. **Watch console**
   - Should see location updates being sent every 5 seconds
   - Look for: `captain:location-update` events

#### In User Window:
1. **Watch the map**
   - Driver marker should move in real-time
   - Console shows: `Driver location: { lat, lng }`

### 5. Test Ride Cancellation

#### In User Window:
1. Click "Cancel Ride" button (if available)
2. Console should show: `user:cancel-ride`
3. UI should reset to initial state

#### In Captain Window:
1. Console should show: `Ride cancelled: { rideId }`
2. Ride popup should close
3. Captain should be back to "Available" state

## Console Commands for Testing

Open browser console (F12) and try these:

### Check Socket Status:
```javascript
// In any logged-in page
const socketContext = window.__REACT_CONTEXT_DEVTOOL__;
// Or check logs for "Socket connected"
```

### Monitor All Socket Events:
```javascript
// Add to browser console
const originalEmit = socket.emit;
socket.emit = function(...args) {
  console.log('📤 EMIT:', args[0], args[1]);
  return originalEmit.apply(this, args);
};

socket.onAny((event, ...args) => {
  console.log('📥 RECEIVE:', event, args);
});
```

### Test Geolocation:
```javascript
navigator.geolocation.getCurrentPosition((pos) => {
  console.log('Your location:', pos.coords.latitude, pos.coords.longitude);
});
```

### Check Local Storage Token:
```javascript
console.log('Token:', localStorage.getItem('token'));
```

## Expected Console Logs

### Captain Console (when ride requested):
```
Socket connected: abc123
Captain 507f1f77bcf86cd799439011 is available at: {lat: 40.7128, lng: -74.0060}
📍 New ride request received: {
  rideId: "abc123-1234567890",
  userId: "507f1f77bcf86cd799439011",
  pickup: { lat: 40.7128, lng: -74.0060, address: "..." },
  destination: { lat: 40.7589, lng: -73.9851, address: "..." },
  vehicleType: "car"
}
✅ Accepted ride: abc123-1234567890
```

### User Console (when ride accepted):
```
Socket connected: xyz789
Ride requested: car
🚗 Driver found: {
  captainId: "507f1f77bcf86cd799439011",
  captain: {
    fullname: { firstname: "John", lastname: "Doe" },
    vehicle: { ... },
    location: { lat: 40.7128, lng: -74.0060 }
  }
}
📍 Driver location: { lat: 40.7128, lng: -74.0061 }
📍 Driver location: { lat: 40.7128, lng: -74.0062 }
...
```

## Troubleshooting

### Problem: "Connecting to server..." banner stays visible

**Solution:**
1. Check backend is running on port 3000
2. Verify `.env` has correct `VITE_BASE_URL`
3. Check console for connection errors
4. Ensure user is logged in (check localStorage token)

### Problem: No ride request received by captain

**Solution:**
1. Verify captain is logged in
2. Check captain console for "Socket connected"
3. Ensure captain emitted 'captain:available' event
4. Check backend console for event logs
5. Verify both clients connected to same server

### Problem: Location not updating

**Solution:**
1. Grant browser location permissions
2. Check console for geolocation errors
3. Verify 5-second interval is running
4. Check captain is in ride-specific room

### Problem: Authentication error

**Solution:**
1. Login again to refresh token
2. Check token in localStorage
3. Verify JWT_SECRET matches in backend
4. Check token hasn't expired

## Performance Checks

### Good Performance Indicators:
- ✅ Socket connects within 1-2 seconds
- ✅ Events received instantly (<100ms)
- ✅ Location updates smooth every 5 seconds
- ✅ No reconnection attempts
- ✅ Map updates without lag

### Bad Performance Indicators:
- ❌ Multiple reconnection attempts
- ❌ Events delayed >1 second
- ❌ "Connecting..." banner flashing
- ❌ Console shows connection errors
- ❌ Location updates choppy or frozen

## Success Criteria

✅ User can request a ride
✅ Captain receives notification instantly
✅ Captain can accept/reject ride
✅ User receives driver details immediately
✅ Driver location updates in real-time on user's map
✅ Connection status indicators work correctly
✅ No console errors
✅ Ride cancellation works from both sides

## Next Steps After Testing

1. ✅ Test with multiple captains
2. ✅ Test concurrent ride requests
3. ✅ Test network disconnection handling
4. ✅ Test on mobile devices
5. ✅ Performance testing with many connections
6. ✅ Load testing backend socket handlers

## Need Help?

- Check `SOCKETIO_IMPLEMENTATION.md` for detailed documentation
- Review `SocketExamples.jsx` for code patterns
- Check backend logs for error messages
- Open browser Network tab to see WebSocket frames
- Use Socket.io Admin UI for debugging (if installed)

## Demo Video Script

1. Show both windows side-by-side
2. Login as user and captain
3. Request ride from user
4. Show notification popup on captain
5. Accept ride from captain
6. Show driver found on user
7. Open console to show location updates
8. Show map marker moving in real-time
9. Cancel ride to reset

Record this flow for documentation!
