import { getSnapshot } from "../services/documentSnapshotService.js";
import { documents } from "../store/documentStore.js";

export function startSnapshotWorker(){
    setInterval(() => {
        Object.values(documents).forEach((doc) => {
            if (doc.isDirty && !doc.snapshotPromise) {
            doc.snapshotPromise = getSnapshot(doc);
            }
        });
    }, 5000);
}