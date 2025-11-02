import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true,
  autoConnect: true,
});

export default socket;
