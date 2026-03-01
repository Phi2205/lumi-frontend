"use client";

import { createContext, useContext, useEffect } from "react";
import { getSocket, startHeartbeat } from "@/lib/socket";

const SocketContext = createContext<any>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = getSocket();

  useEffect(() => {
    socket.connect();
    startHeartbeat(); // Start the 45s heartbeat
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
