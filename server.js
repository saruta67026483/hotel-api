const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());


const db = new sqlite3.Database("hotel.db");


db.run(`
  CREATE TABLE IF NOT EXISTS hotel (
    hotel_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    rating REAL,
    contact TEXT
  )
`);



app.post("/hotels", (req, res) => {
  const { name, location, rating, contact } = req.body;
  db.run(
    "INSERT INTO hotel (name, location, rating, contact) VALUES (?, ?, ?, ?)",
    [name, location, rating, contact],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ hotel_id: this.lastID });
    }
  );
});


app.get("/hotels", (req, res) => {
  db.all("SELECT * FROM hotel", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});


app.get("/hotels/:id", (req, res) => {
  db.get(
    "SELECT * FROM hotel WHERE hotel_id = ?",
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json(err);
      res.json(row);
    }
  );
});


app.put("/hotels/:id", (req, res) => {
  const { name, location, rating, contact } = req.body;
  db.run(
    `UPDATE hotel 
     SET name=?, location=?, rating=?, contact=? 
     WHERE hotel_id=?`,
    [name, location, rating, contact, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});


app.delete("/hotels/:id", (req, res) => {
  db.run(
    "DELETE FROM hotel WHERE hotel_id=?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ deleted: this.changes });
    }
  );
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
