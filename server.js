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

//serving the notes.html on /notes endpoint
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/api/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/db/db.json"))
);

app.post("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => {
    const notes = JSON.parse(data);
    const newNotes = req.body;
    newNotes.id = v4(); // unique ids
    notes.push(newNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes, null, 4));
    res.json(notes);
  });
});

app.delete("/api/notes/:id", (req, res) => {
  readFromFile("./db/db.json").then((data) => {
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id !== req.params.id);

    fs.writeFileSync("./db/db.json", JSON.stringify(updatedNotes, null, 4));
    res.json(notes);
  });
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}.`));
