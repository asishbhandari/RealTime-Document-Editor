import { DocumentState } from "../types/documents.js";
import * as Y from "yjs"

export async function getSnapshot(doc: DocumentState): Promise<Uint8Array> {
  if (doc.snapshotCache && !doc.isDirty) {
    return doc.snapshotCache;
  }

  if (doc.snapshotPromise) {
    return doc.snapshotPromise;
  }

  doc.snapshotPromise = (async () => {
    const snapshot = Y.encodeStateAsUpdate(doc.yDoc);

    doc.snapshotCache = snapshot;
    doc.isDirty = false;
    doc.snapshotPromise = null;

    return snapshot;
  })();

  return doc.snapshotPromise;
}