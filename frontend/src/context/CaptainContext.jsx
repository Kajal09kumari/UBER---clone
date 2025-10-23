import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const CaptainDataContext = createContext();

const SOCKET_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const CaptainContext = ({ children }) => {
        const [captain, setCaptain] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);
        const [socket, setSocket] = useState(null);
        const [latestRide, setLatestRide] = useState(null);

        useEffect(() => {
            const s = io(SOCKET_URL, { transports: ['websocket'] });
            setSocket(s);

            s.on('connect', () => {
                // Join captains room so server can target captains
                s.emit('joinRoom', 'captains');
            });

            s.on('newRide', (ride) => {
                setLatestRide(ride);
            });

            s.on('disconnect', () => {
                console.log('socket disconnected');
            });

            return () => {
                s.disconnect();
            };
        }, []);

        const updateCaptain = (captainData) => {
                setCaptain(captainData);
        }
        const value = {
                captain,
                setCaptain,
                isLoading,
                setIsLoading,
                error,
                setError,
                updateCaptain,
                socket,
                latestRide,
        };

        return (
                <CaptainDataContext.Provider value={value}>
                        {children}
                </CaptainDataContext.Provider>
        );
};
export default CaptainContext;
