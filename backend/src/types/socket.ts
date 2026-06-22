import { Socket } from "socket.io";
import { DocumentState } from "./documents.js";

export interface SocketData {
  docId?: string;
  doc?: DocumentState;
}

export interface DocumentSocket extends Socket {
  data: SocketData;
}