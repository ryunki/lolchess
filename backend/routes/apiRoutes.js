const express = require("express")
const app = express()
const router = express.Router();
const adminRoutes = require("./adminRoutes")
const userRoutes = require("./userRoutes")

const jwt = require("jsonwebtoken")
app.get("/logout", (req,res)=>{
  res.clearCookie('access_token').send("access token cleared")
})
app.get("/get-token", (req,res)=>{
  try{
    const token = req.cookies.access_token
    const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY)
    res.json({_id:decoded._id, username: decoded.username})
    // res.json(decoded.username)
  } catch (error){
    return res.status(401).send("Unauthorized. Invalid Token")
  }
})

app.use("/users", userRoutes)
app.use("/admin", adminRoutes)

module.exports = app