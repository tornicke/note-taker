const path = require("path");

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static("public")); //serving the static resources

//CODE Here

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/db/db.json"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}.`));
