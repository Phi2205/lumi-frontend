"use client";

import { io, Socket } from "socket.io-client";
import { refreshTokenApi } from "@/apis/auth.api";



let socket: Socket | null = null;
let lastEmit: { event: string, args: any[] } | null = null;
let isRefreshing = false;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
      autoConnect: false, // kiểm soát connect thủ công
    });

    // Wrap emit to track last command for retry
    const originalEmit = socket.emit;
    socket.emit = function (event: string, ...args: any[]) {
      if (event !== 'heartbeat') {
        lastEmit = { event, args };
      }
      return originalEmit.apply(socket, [event, ...args]);
    } as any;

    // Listen for authentication errors
    socket.on('error', async (data: any) => {
      if (data?.message === 'Unauthenticated' || data === 'Unauthenticated') {
        console.warn("Socket unauthenticated, attempting to refresh token...");
        
        if (isRefreshing) return;
        isRefreshing = true;

        try {
          await refreshTokenApi();
          console.log("Token refreshed, reconnecting socket and retrying...");
          
          if (socket) {
            socket.disconnect();
            socket.connect();
            
            // Retry last command after a short delay to ensure connection
            if (lastEmit) {
              setTimeout(() => {
                if (socket?.connected && lastEmit) {
                  socket.emit(lastEmit.event, ...lastEmit.args);
                }
              }, 500);
            }
          }
        } catch (error) {
          console.error("Failed to refresh token for socket:", error);
          // Optional: handle logout/redirect if refresh fails
        } finally {
          isRefreshing = false;
        }
      }
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
