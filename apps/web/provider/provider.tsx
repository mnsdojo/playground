"use client";

import { IoProvider } from "socket.io-react-hook";

export const SocketIoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <IoProvider>{children}</IoProvider>;
};
