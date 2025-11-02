# Socket.io Real-Time Updates - Quick Start Guide

This guide will help you quickly get started with the Socket.io real-time features.

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
# Backend
cd Backend
npm install socket.io

# Frontend
cd ../frontend
npm install socket.io-client
```

### Step 2: Configure Environment Variables

**Backend** - Create/update `Backend/.env`:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**Frontend** - Create/update `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

### Step 3: Start the Application

```bash
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

That's it! Socket.io is now running. 🎉

## 🧪 Quick Test

### Test Ride Request Broadcasting:

1. **Login as Captain:**
   - Navigate to `http://localhost:5173/captainlogin`
   - Login with captain credentials
   - Go to Captain Home

2. **Create a Ride Request:**
   Use this curl command or Postman:
   ```bash
   curl -X POST http://localhost:3000/rides/create \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer YOUR_USER_TOKEN" \
   -d '{
     "userId": "user123",
     "pickup": {
       "address": "Connaught Place, New Delhi",
       "coordinates": { "lat": 28.6139, "lng": 77.2090 }
     },
     "destination": {
       "address": "Noida Sector 18",
       "coordinates": { "lat": 28.5355, "lng": 77.3910 }
     },
     "vehicleType": "car"
   }'
   ```

3. **See Real-Time Update:**
   - The captain dashboard should show a popup with the new ride request immediately!
   - You should also see a browser notification (if permissions granted)

### Test Location Broadcasting:

1. **Captain Accepts Ride:**
   - Click accept on the ride popup
   - Navigate to the Captain Riding page

2. **User Views Ride:**
   - Login as a user
   - Navigate to the Riding page

3. **Watch Real-Time Location:**
   - The user should see location updates from the captain every 5 seconds
   - Check browser console for "Driver location updated" messages

## 📊 Verify Connection

Open your browser's developer console on any page:

```javascript
// You should see these logs:
"Socket connected: <socket-id>"
"Setting up socket listeners for captain: <captain-id>"
"Captain location updated: {lat: ..., lng: ...}"
```

## 🔍 Socket Events You Can Monitor

Open browser console and watch for these events:

### On Captain Dashboard:
```javascript
// Listen for new ride requests
socket.on('ride:new-request', (data) => {
  console.log('New ride:', data);
});
```

### On User Riding Page:
```javascript
// Listen for location updates
socket.on('location:updated', (data) => {
  console.log('Driver location:', data);
});
```

## 🎯 Key Features Implemented

✅ **Backend:**
- Socket.io server integrated with Express
- Ride request broadcasting to captains
- Location update handling
- Room-based communication

✅ **Frontend:**
- Socket context provider
- Captain ride request listener
- User location tracking
- Real-time notifications
- Connection status indicators

## 🛠️ Common Issues & Quick Fixes

### Issue: "Socket not connecting"
**Fix:** Check if backend is running on port 3000
```bash
curl http://localhost:3000
# Should return: "Helllo World"
```

### Issue: "Events not received"
**Fix:** Open browser console and check:
```javascript
// Is socket connected?
console.log(socket.isConnected); // Should be true

// Is captain/user ID available?
console.log(captain); // or console.log(user);
```

### Issue: "Location not updating"
**Fix:** Check geolocation permissions:
- Browser → Settings → Site Permissions → Location → Allow

### Issue: "CORS error"
**Fix:** Verify `FRONTEND_URL` in Backend `.env` matches your frontend URL

## 📱 Enable Browser Notifications

For the best experience, enable notifications:

**Chrome/Edge:**
1. Click the lock icon in address bar
2. Click "Site settings"
3. Change "Notifications" to "Allow"

**Firefox:**
1. Click the shield icon in address bar
2. Click "Permissions"
3. Enable notifications

## 🔗 API Endpoints Reference

### Create Ride Request
```
POST http://localhost:3000/rides/create
Headers: Authorization: Bearer <token>
Body: { pickup, destination, userId, vehicleType }
```

### Accept Ride
```
POST http://localhost:3000/rides/accept
Headers: Authorization: Bearer <captain-token>
Body: { rideId, captainId, userId }
```

### Update Ride Status
```
POST http://localhost:3000/rides/status
Headers: Authorization: Bearer <captain-token>
Body: { rideId, status, userId }
```

## 📖 Next Steps

1. **Read Full Documentation:** Check `SOCKET_IO_INTEGRATION.md` for detailed information
2. **Implement Nearby Logic:** Add geospatial queries to find nearby captains
3. **Add Ride Models:** Create MongoDB models for persistent ride storage
4. **Enhance UI:** Improve ride popup components with actual ride data
5. **Add Error Handling:** Implement retry logic and error states

## 🎓 Understanding the Flow

### New Ride Request Flow:
```
User Creates Ride → Backend Receives → Socket Emits to Captains → 
Captain Dashboard Updates → Captain Accepts → Socket Notifies User
```

### Location Tracking Flow:
```
Captain Starts Ride → Geolocation API Gets Position → 
Socket Emits Location → User Page Receives → Map Updates
```

## 💡 Pro Tips

1. **Keep Console Open:** Monitor socket events in browser console during development
2. **Use Multiple Browsers:** Test user and captain features simultaneously in different browsers
3. **Check Network Tab:** Verify WebSocket connection in browser DevTools → Network → WS
4. **Log Everything:** Backend logs show all socket events - keep terminal visible
5. **Test Reconnection:** Restart backend and watch frontend automatically reconnect

## 📞 Need Help?

- Check backend logs for socket connection attempts
- Verify frontend console for error messages
- Ensure both backend and frontend are running
- Check that ports 3000 and 5173 are not blocked by firewall

## ✨ Success Checklist

- [ ] Socket.io dependencies installed
- [ ] Environment variables configured
- [ ] Backend server running on port 3000
- [ ] Frontend running on port 5173
- [ ] Socket connected (check console)
- [ ] Captain can receive ride requests
- [ ] User can see driver location
- [ ] Browser notifications working
- [ ] No CORS errors

---

**Ready to build something amazing!** 🚀

For more details, see the comprehensive [SOCKET_IO_INTEGRATION.md](./SOCKET_IO_INTEGRATION.md) documentation.
