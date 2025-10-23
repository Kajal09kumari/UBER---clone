import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const UserDataContext = createContext();

const SOCKET_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const UserContext = ({ children }) => {
    const [user, setUser] = useState({
        email: '',
        fullname: {
            firstname: '',
            lastname: ''
        },
    });

    const [socket, setSocket] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);

    useEffect(() => {
      const s = io(SOCKET_URL, { transports: ['websocket'] });
      setSocket(s);

            s.on('connect', () => {
                const uid = localStorage.getItem('userId');
                if (uid) {
                    s.emit('joinRoom', `user:${uid}`);
                }
            });

            s.on('driverLocation', (loc) => {
                setDriverLocation(loc);
            });

      return () => s.disconnect();
    }, []);

    return (
        <UserDataContext.Provider value={{ user, setUser, socket, driverLocation }}>
            {children}
        </UserDataContext.Provider>
    );
}

export default UserContext