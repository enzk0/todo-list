import sql from "../config/db.js"; // Import the database connection

async function seedDB() {
    try {
        console.log("-----Seeding the database-----");
        console.log("Dropping existing notes table...");
        await sql`
            DROP TABLE IF EXISTS notes CASCADE;
            `;
        console.log("Creating notes table...");
        await sql`
            CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                isCompleted BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("Inserting initial data into notes table...");
        await sql`
            INSERT INTO notes (title, content, isCompleted)
            VALUES
                ('Do the Dishes', 'Do the dishes by 5:30pm', true),
                ('Sweep the Floor', 'Sweep the floor this coming Friday', false),
                ('Arrange Books', 'Arrange the books by series in alphabetical order.', false),
                ('Pay Bills', 'Pay the electricity and water bills by the end of the month.', true),
                ('Study for exams', 'Prepare for the upcoming exams next week.', false);
        `;

        console.log("-----Database seeded successfully.-----");
    } catch (error) {
        console.error("Error seeding the database:", error);
    }
}

export default seedDB;
// This function seeds the database with initial data
