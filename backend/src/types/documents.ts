import * as Y from "yjs";

export interface DocumentState {
    yDoc: Y.Doc;
    users: Set<string>;

    snapshotCache: Uint8Array | null;
    snapshotPromise: Promise<Uint8Array> | null;
    isDirty: boolean;

    lastUserLeftAt?: number;
}

export interface CursorPosition {
    index: number;
    length: number;
}

export interface PresenceState {
    userId: string;
    displayName: string;
    cursor: CursorPosition
    color: string;
    lastSeen: number;
}