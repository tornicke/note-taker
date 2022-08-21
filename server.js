const { readAndAppend, readFromFile } = require("./db/fsUtils");

const path = require("path");

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const fs = require("fs");

const { v4 } = require("uuid"); //importing a package that will ensure each note has a unique ID

app.use(express.static("public")); //serving the static resources

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//serving the notes.html file on /notes endpoint
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/api/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/db/db.json"))
);

//adding new notes to the db.json file
app.post("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => {
    const notes = JSON.parse(data);
    const newNotes = req.body;
    newNotes.id = v4(); // using the uuid package to attach unique ids to notes
    notes.push(newNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes, null, 4)); //writing new notes to the db.json file as separate arrays (null, 4 makes this possible)
    res.json(notes);
  });
});

//targeting a specific note with its unique id and saving all other notes (excluding the targeted one) into the db.json file
app.delete("/api/notes/:id", (req, res) => {
  readFromFile("./db/db.json").then((data) => {
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id !== req.params.id); // making sure that the note with a targeted id is not kept

    fs.writeFileSync("./db/db.json", JSON.stringify(updatedNotes, null, 4)); //writing the rest of the notes into the db.json file as separate arrays (using null, 4)
    res.json(notes);
  });
});

//serving the index.html file on all other endpoints
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}.`));
