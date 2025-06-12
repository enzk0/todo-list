import sql from "../../config/db.js";

export const getNotes = async (req, res) => {
    try {
        const { isCompleted } = req.query;

        let notes;

        if (isCompleted === "true" || isCompleted === "false") {
            const isCompletedBool = isCompleted === "true";
            notes = await sql`
                SELECT * FROM notes
                WHERE isCompleted = ${isCompletedBool}
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

export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, isCompleted } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Note ID is required",
            });
        }
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required",
            });
        }
        if (typeof isCompleted !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isCompleted must be a boolean",
            });
        }

        const updatedNote = await sql`UPDATE notes 
            SET title = ${title}, 
            content = ${content}, 
            isCompleted = ${isCompleted}, 
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
