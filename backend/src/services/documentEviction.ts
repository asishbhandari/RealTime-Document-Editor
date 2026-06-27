import { documents } from "../store/documentStore.js";
import { unsubscribeFromDocument } from "./redisSubscriptions.js";

// const EVICTION_TIME = 5 * 60 * 1000;
const EVICTION_TIME = 15000;

export function startDocumentEviction(){
    setInterval(async ()=>{
        const now = Date.now();

        for (const [docId, doc] of Object.entries(documents)){
            if (doc.users.size > 0) {
                continue;
            }

            if (!doc.lastUserLeftAt) {
                continue;
            }

            const inactiveTime = now - doc.lastUserLeftAt;

            if (inactiveTime < EVICTION_TIME) {
                continue;
            }

            console.log(`Starting eviction for ${docId}`);
            await unsubscribeFromDocument(docId);
            delete documents[docId];
            console.log(`Eviction completed for ${docId}`);
        }
    }, 60000)
}