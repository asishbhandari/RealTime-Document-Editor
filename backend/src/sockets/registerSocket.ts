import { Server, Socket } from "socket.io";
import { getYDoc } from "../store/documentStore.js";
import { subscribeToDocument } from "../services/redisSubscriptions.js";
import { getSnapshot } from "../services/documentSnapshotService.js";
import * as Y from "yjs";
import { SERVER_ID } from "../constants/server.js";
import { registerCursorHandler, registerDisconnectHandler, registerUpdateHandler } from "../services/socketHandlers.js";
import { registerJoinHandler } from "../services/joinDocumentHandler.js";

export function registerSocket(io:Server) {
    io.on("connection", (socket: Socket)=> {
        console.log("user Connected: ",socket.id);

        registerJoinHandler(socket, io);
        registerUpdateHandler(socket);
        registerCursorHandler(socket);
        registerDisconnectHandler(socket);
    });
}