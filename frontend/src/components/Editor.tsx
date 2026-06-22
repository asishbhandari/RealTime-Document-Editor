import { useEffect, useRef } from "react";
import { socket } from "../socket/socket";
import { yDoc, yText } from "../yjs/yjsClient";
import Quill from "quill";
import { QuillBinding } from "y-quill";
import * as Y from "yjs";
import throttle from "lodash/throttle";

const docId = "doc1";

export default function Editor() {
  const editorRef= useRef<HTMLDivElement | null>(null);
  const remoteUsers =  useRef(new Map());

  const emitCursorUpdate = throttle(
    (range) => {
      socket.emit("cursor-update", {
        index: range.index,
        length: range.length
      });
    },
    50
  );

  useEffect(() => {
    // send event to join the doc
    if (!editorRef.current) return;
    const quill = new Quill(editorRef.current!, {
      theme: "snow",
    });
    // Bind Quill with Yjs
    new QuillBinding(yText, quill);

    quill.on("selection-change", (range)=>{
      if(!range) return;
      emitCursorUpdate(range);
    })

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      const stateVector = Y.encodeStateVector(yDoc);
      socket.emit("join-document", {docId , stateVector});
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    // send event to load the document
    socket.on("load-document", (update: number[]) => {
      Y.applyUpdate(yDoc, new Uint8Array(update), "remote");
      // setValue(yText.toString());
    });

    // send events to receive the update
    socket.on("receive-update", (update: number[]) => {
      console.log("Receive update", update.length);
      Y.applyUpdate(yDoc, new Uint8Array(update), "remote");
    });

    yDoc.on("update", (update: Uint8Array, origin: string) => {
      console.log("Current text:", yText.toString());
      if (origin === "remote") return;
      socket.emit("send-update", Array.from(update));
    });

    socket.on("presence-updated", (presence)=>{
      remoteUsers.current.set(presence.userId, presence );
      console.log("Remote Presence: ",presence)
    })

    // yText.observe(() => {
    //   setValue(yText.toString());
    // });

    return () => {
      socket.off("load-document");
      socket.off("receive-update");
    };
  }, []);

  // const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const newValue = e.target.value;

  //   // Replace content (temporary approach)
  //   yDoc.transact(() => {```
  //     yText.delete(0, yText.length);
  //     yText.insert(0, newValue);
  //   });
  // };

  return (
    // <textarea
    //   value={value}
    //   onChange={handleChange}
    //   style={{ width: "100%", height: "300px" }}
    // />
    <div ref={editorRef} style={{ height: "400px" }} />
  );
}