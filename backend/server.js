import express from "express";
import api from './routes/index.js'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from "cors";

dotenv.config()
mongoose.connect(process.env.MONGODB_PATH, () => {
    console.log('connect');
}, (e) => console.log(e))

const PORT = process.env.SERVER_PORT || 9000

const app = express()

// --- BULLETPROOF CORS CONFIGURATION ---
app.use(cors({
    origin: [
        "https://projectsync-projectsync.vercel.app", // Your live Vercel frontend
        "http://localhost:3000" // Your local environment
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));
// --------------------------------------

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(api)

app.listen(PORT, () => {
    console.log(`Your app is running on port ${PORT}`)
})