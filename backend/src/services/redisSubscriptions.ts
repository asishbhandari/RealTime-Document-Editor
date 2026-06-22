import * as Y from "yjs";
import { subClient } from "../redis.js";
import { documents } from "../store/documentStore.js";
import { subscribedDocs } from "../store/subscriptionStore.js";
import { SERVER_ID } from "../constants/server.js";
import { Server } from "socket.io";

export async function subscribeToDocument(docId: string, io: Server) {
  if (subscribedDocs.has(docId)) {
    return;
  }

  await subClient.subscribe(`doc:${docId}`, (message) => {
    const { update, source } = JSON.parse(message);

    if (source === SERVER_ID) return;
    const doc = documents[docId];
    console.log(`[${SERVER_ID}] Received Redis update for ${docId}`);
    console.log(`[${SERVER_ID}] Documents loaded`, Object.keys(documents));
    console.log(`[${SERVER_ID}] Users in document:`, doc?.users.size);

    if (!doc) return;

    Y.applyUpdate(doc.yDoc, new Uint8Array(update));
    console.log(`[${SERVER_ID}] Broadcasting to room ${docId}`);
    console.log("Room sockets:", io.sockets.adapter.rooms.get(docId));
    io.to(docId).emit("receive-update", update);
  });

  subscribedDocs.add(docId);

  console.log(`Subscribed to doc:${docId}`);
}

export async function unsubscribeFromDocument(docId: string) {
  if (!subscribedDocs.has(docId)) {
    return;
  }

  await subClient.unsubscribe(`doc:${docId}`);

  subscribedDocs.delete(docId);

  console.log(`Unsubscribed from doc:${docId}`);
}