const express = require('express')
const app = express()

const apiRoutes = require('./routes/apiRoutes')

// middleware that allows postman website to send data to express
app.use(express.json());
app.use("/api", apiRoutes);

const connectDB = require("./config/db");
connectDB();

// show errors in development mode
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  next(error);
});

const port = 5000
app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`)
})