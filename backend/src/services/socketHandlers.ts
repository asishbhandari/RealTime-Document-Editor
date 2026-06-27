import * as Y from "yjs";
import { DocumentSocket } from "../types/socket.js";
import { pubClient } from "../redis.js";
import { SERVER_ID } from "../constants/server.js";
import { presenceMap } from "../store/presenceStore.js";
import { getUSerColor } from "../utilites/helperFunctions.js";
import { updateQueue } from "../store/updateQueue.js";

export function registerUpdateHandler(socket: DocumentSocket) {
  socket.on("send-update", async (update: number[]) => {
    const docId = socket.data.docId;
    const doc = socket.data.doc;

    if (!docId || !doc) return;

    try {
      const uint8Update = new Uint8Array(update);

      Y.applyUpdate(doc.yDoc, uint8Update);

      doc.isDirty = true;

      socket
        .to(docId)
        .emit("receive-update", Array.from(uint8Update));

      // await pubClient.publish(
      //   `doc:${docId}`,
      //   JSON.stringify({
      //     docId,
      //     update: Array.from(uint8Update),
      //     source: SERVER_ID,
      //   })
      // );

      let queue = updateQueue.get(docId);
      if(!queue){
        queue = [];
        updateQueue.set(docId, queue);
      }
      queue.push(uint8Update);

      console.log(
        `[${SERVER_ID}] Queued update for doc:${docId}`
      );
    } catch (err) {
      console.error("Invalid update", err);
    }
  });
}

export function registerCursorHandler(socket: DocumentSocket) {
  socket.on(
    "cursor-update",
    ({ index, length }: { index: number; length: number }) => {
      const docId = socket.data.docId;

      if (!docId) return;

      let docPresence = presenceMap.get(docId);

      if (!docPresence) {
        docPresence = new Map();
        presenceMap.set(docId, docPresence);
      }

      const presence = {
        userId: socket.id,
        displayName: socket.id.slice(0, 6),
        color: getUSerColor(socket.id),
        cursor: {
          index,
          length,
        },
        lastSeen: Date.now(),
      };

      docPresence.set(socket.id, presence);

      socket.to(docId).emit(
        "presence-updated",
        presence
      );
    }
  );
}

export function registerDisconnectHandler(socket: DocumentSocket) {
  socket.on("disconnect", () => {
    const docId = socket.data.docId;
    const doc = socket.data.doc;

    if (!docId) {
      console.log("Disconnect before document join");
      return;
    }
    
    if (doc) {
      doc.users.delete(socket.id);
      if (doc.users.size === 0) {
        doc.lastUserLeftAt = Date.now();
      }
    }

    const presence = presenceMap.get(docId);

    if (presence) {
      presence.delete(socket.id);

      if (presence.size === 0) {
        presenceMap.delete(docId);
      }
    }

    console.log("User disconnected:", socket.id);
  });
}