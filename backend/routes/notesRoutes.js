import express from "express";
import {
    getNotes,
    getNote,
    createNote,
    editNote,
    deleteNote,
    deleteNotes,
} from "../controllers/notesController.js";

const router = express.Router();

router.get("/", getNotes); // Gets all notes
router.get("/:id", getNote); // Gets a specific note by ID
router.post("/", createNote); // Route to create a new note
router.patch("/:id", editNote); // Updates a specific note by ID
router.delete("/:id", deleteNote); // Deletes a specific note by ID
router.delete("/", deleteNotes); // Deletes all notes

export default router;
