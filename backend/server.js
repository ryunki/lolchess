const express = require('express')
const app = express()
// const middleware = require('./middleware')
const apiRoutes = require('./routes/apiRoutes')

// middleware that allows postman website to send data to express
app.use(express.json());
app.use("/api", apiRoutes);

const connectDB = require("./config/db");
connectDB();

// 개발중 에러났을때 브라우저와 콘솔에 표시
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  next(error);
});

const port = 3000
app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`)
})