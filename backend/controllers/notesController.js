export const getNotes = async (req, res) => {
    return res.send("Get all notes");
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
