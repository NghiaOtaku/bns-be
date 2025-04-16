// src/server.js
const http = require("http");
const app = require("./app");
const PORT = process.env.PORT || 2211;
const connectDB = require("./config/db.js");
const server = http.createServer(app);

connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
