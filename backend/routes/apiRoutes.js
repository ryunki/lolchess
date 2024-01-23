const express = require("express")
const app = express()
const router = express.Router();
const adminRoutes = require("./adminRoutes")
const userRoutes = require("./userRoutes")

app.use("/users", userRoutes)
app.use("/admin", adminRoutes)

module.exports = app