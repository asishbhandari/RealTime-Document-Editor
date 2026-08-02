import mongoose from "mongoose";
import { env } from "../config/env.js";

export async function connectMongo() {
    try{
        await mongoose.connect(env.MONGO_URI!);
        console.log("✅ Mongo Connected");
    }catch(err){
        console.error("❌ Mongo Connection Failed", err);
        process.exit(1);
    }
}