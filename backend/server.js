const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()

// Enable CORS for all routes
app.use(cors());
// Enable for express() to read cookie coming from browser
app.use(cookieParser())
const apiRoutes = require('./routes/apiRoutes')

// middleware that allows postman website to send data to express
app.use(express.json());
app.use("/api", apiRoutes);

const connectDB = require("./config/db");
connectDB();

// show errors in development mode
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      message: error.message,
      // stack may contain sensitive info
      stack: error.stack,
    });
  } else {
    // production 
    res.status(500).json({
      message: error.message,
    }); 
}});

const port = 5000
app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`)
})