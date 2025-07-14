require("dotenv").config();
const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const app = express();
const fs = require("fs");
const options = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost.pem"),
};

const IP = process.env.IP || "127.0.0.1";
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*", methods: ["POST", "GET"] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// app.get("/", (req, res) => res.send("Hello World!"));

const router = require("./controllers");
app.use("/", router);

// const server = http.createServer(app);

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server jalan di https://localhost:${PORT}`);
});
