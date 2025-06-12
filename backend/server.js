import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import noteRoutes from "./routes/notesRoutes.js";
import sql from "../config/db.js"; // Import the database connection

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(helmet()); // Security middleware
app.use(morgan("dev")); // Logging middleware, logs requests to the console
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes

async function seedDB() {
    try {
        console.log("Seeding the database...");
        console.log("Dropping existing notes table...");
        await sql`
            DROP TABLE IF EXISTS notes;
        `;
        console.log("Creating notes table...");
        await sql`
            CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        console.log("Database seeded successfully.");
    } catch (error) {
        console.error("Error seeding the database:", error);
    }
}
// Routes
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the Notes API!");
});

seedDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
