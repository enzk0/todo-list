import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import noteRoutes from "./routes/notesRoutes.js";
import seedDB from "../config/seed.js"; // Import the seed function to seed the database

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(helmet()); // Security middleware
app.use(morgan("dev")); // Logging middleware, logs requests to the console
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes

app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the Notes API!");
});

seedDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
