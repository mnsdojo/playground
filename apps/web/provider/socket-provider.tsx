"use client";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = (): SocketContextType => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  url: string;
  options?: Parameters<typeof io>[1];
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  url,
  options,
  children,
}) => {
  const socket = useMemo(() => io(url, options), [url, options]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
