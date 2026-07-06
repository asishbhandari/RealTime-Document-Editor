import { Server } from "socket.io";
import { DocumentSocket } from "../types/socket.js";
import { getYDoc } from "../store/documentStore.js";
import { subscribeToDocument } from "./redisSubscriptions.js";
import { getSnapshot } from "./documentSnapshotService.js";
import * as Y from "yjs"
import { SERVER_ID } from "../constants/server.js";

export function registerJoinHandler(socket: DocumentSocket, io: Server){
    socket.on("join-document", async({docId, stateVector}:{docId: string, stateVector: Uint8Array})=>{
        console.log(`Socket JOin-document event received for ${docId}, user: ${socket.id}`)
        const doc=getYDoc(docId);
        socket.join(docId);

        socket.data.docId = docId;
        socket.data.doc = doc;
        
        doc.users.add(socket.id);
        doc.lastUserLeftAt = undefined;

        await subscribeToDocument(docId, io, socket);

        // send current state to client
        let update: Uint8Array;
        if (!stateVector || stateVector.length === 0) {
            // New user → send snapshot
            update = await getSnapshot(doc);
        } else {
            // Returning user → send only missing updates
            update = Y.encodeStateAsUpdate(doc.yDoc, stateVector);
        }

        socket.emit("load-document", Array.from(update));
        
        console.log(`[${SERVER_ID}] ${socket.id} joined ${docId}`);
    })
}