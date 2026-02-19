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
