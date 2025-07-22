import sql from "../../config/db.js";

export const getNotes = async (req, res) => {
    try {
        const { is_completed } = req.query;

        let notes;

        if (is_completed === "true" || is_completed === "false") {
            const is_completedBool = is_completed === "true";
            notes = await sql`
                SELECT * FROM notes
                WHERE is_completed = ${is_completedBool}
                ORDER BY created_at DESC;
            `;
        } else {
            notes = await sql`
                SELECT * FROM notes
                ORDER BY created_at DESC;
            `;
        }

        console.log("Notes fetched successfully:", notes);
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getNote = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Note ID is required" });
        }

        const note = await sql`SELECT * FROM notes WHERE id=${id}`;

        if (note.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Note not found" });
        }

        console.log("Note fetched successfully:", note[0]);
        return res.status(200).json({ success: true, data: note[0] });
    } catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required",
            });
        }

        const newNote =
            await sql`INSERT INTO notes(title, content) VALUES (${title}, ${content}) RETURNING *;`;

        console.log("Note created successfully:", { title, content });

        res.status(201).json({
            success: true,
            data: newNote[0],
        });
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const editNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, is_completed } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Note ID is required",
            });
        }

        const existingNote = await sql`SELECT * FROM notes WHERE id = ${id};`;
        if (existingNote.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }
        console.log("Existing note:", existingNote[0]);

        // Validate required fields
        if (
            title === undefined &&
            content === undefined &&
            is_completed === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "At least one field---title, content, is_completed---must be provided for the update.",
            });
        }

        // Collect fields to update
        const fieldsToUpdate = {};
        fieldsToUpdate.title =
            title !== undefined ? title : existingNote[0].title;
        fieldsToUpdate.content =
            content !== undefined ? content : existingNote[0].content;
        fieldsToUpdate.is_completed =
            is_completed !== undefined
                ? is_completed
                : existingNote[0].is_completed;
        // Ensure is_completed is a boolean if provided

        console.log("Fields to update:", fieldsToUpdate);

        const updatedNote = await sql`UPDATE notes SET 
                    title = ${fieldsToUpdate.title},
                    content = ${fieldsToUpdate.content},
                    is_completed = ${fieldsToUpdate.is_completed},
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${id} RETURNING *;`;

        if (updatedNote.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        console.log("Note updated successfully:", updatedNote[0]);
        res.status(200).json({
            success: true,
            data: updatedNote[0],
        });
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const deleteNotes = async (req, res) => {
    try {
        const { is_completed } = req.query;

        if (is_completed === "true" || is_completed === "false") {
            const is_completedBool = is_completed === "true";
            const deletedNotes = await sql`
                DELETE FROM notes
                WHERE is_completed = ${is_completedBool}
                RETURNING *;
            `;

            if (deletedNotes.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No notes found to delete",
                });
            }

            console.log("Notes deleted successfully:", deletedNotes);
            return res.status(200).json({
                success: true,
                data: deletedNotes,
            });
        }
        const deletedNotes = await sql`DELETE FROM notes RETURNING *;`;

        if (deletedNotes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No notes found to delete",
            });
        }

        console.log("All notes deleted successfully");
        res.status(200).json({
            success: true,
            data: deletedNotes,
        });
    } catch (error) {
        console.error("Error deleting notes:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedNote =
            await sql`DELETE FROM notes WHERE id = ${id} RETURNING *;`;

        if (deletedNote.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        console.log("Note deleted successfully:", id);
        res.status(200).json({
            success: true,
            data: deletedNote[0],
        });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
