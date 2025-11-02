# Real-Time Captain Locations & Ride Request Features

## New Features Added

### 1. Real-Time Captain Locations on User Map

**User Side Enhancement:**
- Users can now see real-time locations of nearby captains on the map
- Captain locations are shown with special markers (car icons)
- Locations update automatically every 10 seconds
- Visible when user is searching for locations or selecting pickup/destination

**Implementation Details:**
- Socket event: `request:nearby-captains` - User requests nearby captain locations
- Socket event: `captains:nearby` - Server sends array of captain locations
- Captain markers shown with `isCaptain: true` flag for custom styling

### 2. Automatic Ride Request on Vehicle Selection

**User Side Enhancement:**
- When user clicks on a vehicle type (Car/Bike/Auto), it automatically creates a ride request
- Ride request is sent to backend API
- Socket.io broadcasts the request to all nearby available captains
- Captain receives instant notification with ride details popup

**Implementation Details:**
- `VehiclePanel.jsx` now has `handleVehicleSelect()` function
- Makes API call to `POST /rides/create` with:
  - User ID
  - Pickup location (address & coordinates)
  - Destination location (address & coordinates)
  - Vehicle type
- Backend emits `ride:new-request` event to available captains
- Captain dashboard shows popup automatically

## How It Works

### User Flow:
1. User opens app and searches for pickup/destination
2. **NEW**: User sees captain locations on map (red car icons)
3. User selects vehicle type
4. **NEW**: Ride request automatically created and sent to captains
5. User waits for captain to accept
6. Once accepted, user sees driver's real-time location

### Captain Flow:
1. Captain logs in and goes to dashboard
2. Captain's location automatically broadcasts every 5 seconds
3. **NEW**: When user selects vehicle, captain receives instant popup notification
4. Captain sees ride details:
   - Pickup location
   - Destination
   - Fare estimate
   - Vehicle type requested
5. Captain can accept or decline

## Code Changes

### Frontend Files Modified:

**`frontend/src/pages/Home.jsx`:**
- Added Socket.io integration
- Added `captainLocations` state
- Added socket listener for `captains:nearby` event
- Request nearby captains periodically
- Updated map to show captain markers

**`frontend/src/Components/VehiclePanel.jsx`:**
- Added `handleVehicleSelect()` function
- Makes API call to create ride request
- Integrated with UserContext for user ID
- Improved UI with cursor pointer and hover effects

### Backend Files Modified:

**`Backend/services/socket.service.js`:**
- Added `request:nearby-captains` event handler
- Returns array of captain locations to requesting user
- Captain locations tracked in `captainLocations` Map

## Socket Events Reference

### New Events:

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `request:nearby-captains` | Client → Server | `{location: {lat, lng}}` | User requests nearby captain locations |
| `captains:nearby` | Server → Client | `Array<{captainId, location}>` | Server sends nearby captain locations |

## Testing the Features

### Test Real-Time Captain Locations:

1. **Start Backend & Frontend:**
```bash
# Terminal 1
cd Backend
npm start

# Terminal 2
cd frontend
npm run dev
```

2. **Open Two Browser Windows:**
   - Window 1: Login as Captain
   - Window 2: Login as User

3. **Captain Window:**
   - Go to Captain Dashboard
   - Your location broadcasts automatically

4. **User Window:**
   - Search for pickup location
   - You should see captain's location on map (red marker)
   - Moves in real-time as captain moves

### Test Automatic Ride Request:

1. **User Window:**
   - Select pickup and destination
   - Open vehicle selection panel
   - Click on any vehicle (Car/Bike/Auto)

2. **Captain Window:**
   - Popup should appear immediately
   - Shows ride request details
   - Can accept or decline

3. **Check Console:**
```javascript
// User console:
"Ride request created: {data}"

// Captain console:
"New ride request received: {rideData}"

// Backend console:
"Ride request sent to captain <captainId>"
```

## UI Improvements

### Captain Markers on Map:
```javascript
// Custom styling for captain markers
{
  lat: captain.location.lat,
  lng: captain.location.lng,
  text: 'Captain',
  isCaptain: true  // Used for custom icon/color
}
```

### Vehicle Selection Panel:
- Added `cursor-pointer` class
- Added `hover:border-gray-400` for hover effect
- Better click feedback

## Future Enhancements

1. **Filter Captains by Distance:**
   - Calculate distance from user's pickup location
   - Show only captains within specified radius (e.g., 5km)

2. **Captain Vehicle Type:**
   - Show captain's vehicle type on map
   - Different icons for car/bike/auto

3. **Captain Availability Status:**
   - Show green marker for available
   - Show yellow for busy
   - Hide offline captains

4. **Real-Time ETA:**
   - Calculate estimated time for captain to reach
   - Show on map and in vehicle panel

5. **Captain Details on Map:**
   - Click captain marker to see details
   - Name, rating, vehicle info
   - Distance from pickup

## Environment Variables

No new environment variables required! All features use existing configuration.

## Error Handling

**If pickup/destination not selected:**
```javascript
alert('Please select both pickup and destination locations');
```

**If API call fails:**
```javascript
alert('Failed to create ride request. Please try again.');
```

**If socket not connected:**
- Features gracefully degrade
- Connection status indicator shows in UI

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Requires WebSocket support
- ⚠️ Requires Geolocation API (for captain location)

## Performance Considerations

- Captain location updates: Every 5 seconds (captain side)
- Nearby captain requests: Every 10 seconds (user side)
- Map markers optimized for multiple captains
- Socket rooms prevent unnecessary broadcasts

## Troubleshooting

### Captain locations not showing:
1. Ensure captain is logged in and on dashboard
2. Check if captain granted geolocation permission
3. Verify socket connection (check console)
4. Check backend logs for location updates

### Ride request not reaching captain:
1. Verify user selected both pickup and destination
2. Check if captain is in 'available-captains' room
3. Verify backend socket service is running
4. Check browser console for errors

## Documentation Files

- Main Guide: `SOCKET_IO_INTEGRATION.md`
- Quick Start: `SOCKET_IO_QUICKSTART.md`
- Architecture: `SOCKET_IO_ARCHITECTURE.md`
- This File: Real-time features enhancement

---

**Status:** ✅ Implemented and Ready for Testing
**Date:** November 2, 2025
**Features:** Real-time captain locations + Automatic ride requests
