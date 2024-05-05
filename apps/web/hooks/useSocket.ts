"use client";

import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

interface SocketIoHookOptions {
  url: string;
  options?: Parameters<typeof io>[1];
}

interface SocketState {
  isConnected: boolean;
  transport: string;
  joinRoom: (room: string) => void;
  socketRef: React.MutableRefObject<Socket | null>;
}

export const useSocket = ({ options }: SocketIoHookOptions): SocketState => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    socketRef.current = io("http://localhost:8080", options);

    function onConnect() {
      if (!socketRef.current) return;
      setIsConnected(true);
      setTransport(socketRef.current.io.engine.transport.name);
      socketRef.current.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }
    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }
    socketRef.current.on("connect", onConnect);
    socketRef.current.on("disconnect", onDisconnect);

    return () => {
      socketRef.current?.off("connect", onConnect);
      socketRef.current?.off("disconnect", onDisconnect);
    };
  }, [ options]);
  const joinRoom = (room: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("join", room);
  };

  return {
    isConnected,
    joinRoom,
    transport,
    socketRef,
  };
};
