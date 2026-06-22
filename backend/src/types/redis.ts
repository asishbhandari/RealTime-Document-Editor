export interface RedisDocumentMessage {
    documentId: string,
    serverId: string,
    update: number[]
}