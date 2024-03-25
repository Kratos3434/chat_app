import { io } from 'socket.io-client';

export const socket = io('https://3.96.216.225', {
  autoConnect: false
});