import * as Y from "yjs";
import { updateQueue } from "../store/updateQueue.js";
import { pubClient } from "../redis.js";
import { SERVER_ID } from "../constants/server.js";

export function startBatchPublisher() {
  setInterval(async () => {
    for ( const [docId, updates] of updateQueue ) {
      if (updates.length === 0) {
        continue;
      }
      try {
        const merged = Y.mergeUpdates(updates);

        await pubClient.publish(
          `doc:${docId}`,
          JSON.stringify({
            docId,
            update: Array.from(merged),
            source: SERVER_ID,
          })
        );

        console.log(`Batch Published ${docId}`, updates.length);

      } catch (err) {
        console.error("Batch Publish Error",err);
      }
      updateQueue.delete(docId);
    }

  }, 50);
}