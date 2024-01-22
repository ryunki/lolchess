const express = require('express')
const app = express()
// const middleware = require('./middleware')
const router = require('./routes/userRoutes')

// middleware that allows postman website to send data to express
app.use(express.json());
app.use(router)

const connectDB = require("./config/db");
connectDB();

const port = 3000
app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`)
})