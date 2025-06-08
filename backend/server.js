import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(helmet()); // Security middleware
app.use(morgan("dev")); // Logging middleware, logs requests to the console
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
