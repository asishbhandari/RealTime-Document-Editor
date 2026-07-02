import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server, Socket } from "socket.io";
import http from "http";
import * as Y from "yjs";
import { getYDoc, documents } from "./store/documentStore.js"
import { DocumentState } from "./types/documents.js";
import { pubClient, subClient, connectRedis} from "./redis.js"
import { presenceMap } from "./store/presenceStore.js";
import { getUSerColor } from "./utilites/helperFunctions.js";
import { SERVER_ID } from "./constants/server.js";
import { subscribeToDocument } from "./services/redisSubscriptions.js";
import { registerCursorHandler, registerDisconnectHandler, registerUpdateHandler } from "./services/socketHandlers.js";
import { startBatchPublisher } from "./services/batchPublisher.js";
import { startDocumentEviction } from "./services/documentEviction.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import healthRoutes from "./routes/healthRoutes.js"
import { startSnapshotWorker } from "./background/snapshotWorker.js";
import { getSnapshot } from "./services/documentSnapshotService.js";
import { registerSocket } from "./sockets/registerSocket.js";

dotenv.config();

const app= express();
app.use(cors());

app.use("/api/health", healthRoutes);

const httpServer= http.createServer(app);
const CHANNEL= "doc-updates";

const io= new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods:["GET", "POST"]
    },
});

registerSocket(io)

await connectRedis();
startSnapshotWorker();
startBatchPublisher();
startDocumentEviction();

const PORT = process.env.PORT || 3003
httpServer.listen(PORT, ()=> {
    console.log("===========> Server v2 is running on PORT: ",PORT)
})