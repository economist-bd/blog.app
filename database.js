const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'blog.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Create table with new columns if not exists
        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author_name TEXT,
            author_uid TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            } else {
                // Attempt to add columns to existing table if they don't exist
                // This is a naive migration for this scratchpad app
                const columns = ['author_name', 'author_uid'];
                columns.forEach(col => {
                    db.run(`ALTER TABLE posts ADD COLUMN ${col} TEXT`, (err) => {
                        // Ignore error if column already exists
                        if (!err) {
                            console.log(`Added column ${col}`);
                        }
                    });
                });
            }
        });
    }
});

module.exports = db;
