"use client";

import { io, Socket } from "socket.io-client";


let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
      autoConnect: false, // kiểm soát connect thủ công
    });
  }
  return socket;
};

export const reconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected");
    socket.connect();
    console.log("Socket connected");
  }
};

// Heartbeat mechanism to keep online status active
let heartbeatInterval: NodeJS.Timeout | null = null;

export const startHeartbeat = () => {
  const s = getSocket();

  if (heartbeatInterval) return;

  heartbeatInterval = setInterval(() => {
    if (s.connected) {
      // console.log("Sending heartbeat...");
      s.emit('heartbeat');
    }
  }, 45000); // Send every 45 seconds

  s.on('heartbeat_ack', (data) => {
    console.log('Server confirmed online status:', data);
  });

  s.on('disconnect', () => {
    console.log("Socket disconnected, heartbeat will pause");
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
