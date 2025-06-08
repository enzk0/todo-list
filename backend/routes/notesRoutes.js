import express from "express";
import {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
} from "../controllers/notesController.js";

const router = express.Router();

// Route to get all notes
router.get("/", getNotes);
// Route to create a new note
router.post("/", createNote);
