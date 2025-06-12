import sql from "../../config/db.js";

export const getNotes = async (req, res) => {
    try {
        const notes = await sql` SELECT * FROM notes ORDER BY created_at DESC;`;
        console.log("Notes fetched successfully:", notes);
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        console.error("Error fetching notes:", error);
    }
};

export const getNote = async (req, res) => {
    const { id } = req.params;
    return res.send(`Get note with ID: ${id}`);
};

export const createNote = async (req, res) => {
    return res.send("Create a note");
};

export const updateNote = async (req, res) => {
    const { id } = req.params;
    return res.send(`Update note with ID: ${id}`);
};

export const deleteNote = async (req, res) => {
    const { id } = req.params;
    return res.send(`Delete note with ID: ${id}`);
};
