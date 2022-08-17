const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static("public"));

//CODE Here

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}.`));
