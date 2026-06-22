import { io } from "socket.io-client";

const backendPort =
  new URLSearchParams(window.location.search)
    .get("port") || "3003";

export const socket = io(
  `http://localhost:${backendPort}`
);