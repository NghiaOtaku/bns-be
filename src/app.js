// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const storyRouter = require("./routes/storyRouter.js");
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Example route
app.use("/api", storyRouter);

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
