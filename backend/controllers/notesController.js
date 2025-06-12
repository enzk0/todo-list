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
    const { id } = req.params;
    return res.send(`Update note with ID: ${id}`);
};

export const deleteNote = async (req, res) => {
    const { id } = req.params;
    return res.send(`Delete note with ID: ${id}`);
};
