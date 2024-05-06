"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import io, { ManagerOptions, Socket, SocketOptions } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
  addEventListener: (
    eventName: string,
    listener: (...args: any[]) => void
  ) => void;
  removeEventListener: (
    eventName: string,
    listener: (...args: any[]) => void
  ) => void;
}

interface ISocketProviderProps {
  uri: string;
  opts?: Partial<(ManagerOptions & SocketOptions) | undefined>;
  children: React.ReactNode;
}

const SocketContext = createContext<ISocketContext>({
  socket: null,
  addEventListener: () => {},
  removeEventListener: () => {},
});

export const useSocket = (): ISocketContext => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<ISocketProviderProps> = ({
  uri,
  opts,
  children,
}) => {
  const socketRef = useRef<Socket | null>(null);
  const eventListenersRef = useRef<Map<string, Set<(...args: any[]) => void>>>(
    new Map()
  );

  useEffect(() => {
    const socket = io(uri, opts);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("welcome", (data) => {
      console.log("data");
    });
    return () => {
      if (socketRef.current) {
        eventListenersRef.current.forEach((listeners, eventName) => {
          listeners.forEach((listener) => {
            socketRef.current?.off(eventName, listener);
          });
        });
        console.log("disconnected");
        socketRef.current.disconnect();
      }
    };
  }, [uri, opts]);

  const addEventListener = (
    eventName: string,
    listener: (...args: any[]) => void
  ) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, listener);
      if (!eventListenersRef.current.has(eventName)) {
        eventListenersRef.current.set(eventName, new Set());
      }
      eventListenersRef.current.get(eventName)?.add(listener);
    }
  };

  const removeEventListener = (
    eventName: string,
    listener: (...args: any[]) => void
  ) => {
    if (socketRef.current && eventListenersRef.current.has(eventName)) {
      socketRef.current.off(eventName, listener);
      eventListenersRef.current.get(eventName)?.delete(listener);
    }
  };

  const contextValue: ISocketContext = {
    socket: socketRef.current,
    addEventListener,
    removeEventListener,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
