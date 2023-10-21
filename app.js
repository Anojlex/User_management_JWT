const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const app = express();
const db = require('./config/db');
const userRouter = require("./routes/userRouter");
app.use(cors()); // CORS middleware
app.use(cors({ origin: 'http://localhost:3000' })); 
require('dotenv').config();

// Connect to the database
db.connect();

// Apply middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());

// Configure session
app.use(
  session({
      resave: false,
      saveUninitialized: true,
      secret: "anyrandomstring",
    })
  );

// Routes
app.use("/", userRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
