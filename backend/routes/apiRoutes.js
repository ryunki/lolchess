const express = require("express")
const app = express()
const adminRoutes = require("./adminRoutes")
const userRoutes = require("./userRoutes")

// for DB query
app.use("/admin", adminRoutes)
app.use("/users", userRoutes)

module.exports = app