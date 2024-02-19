const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors")
const dotend = require("dotenv").config();
const db = require("./config/db")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const adminRoute = require("./routes/admin");

// const path = require("path")

// DB CONNECTION
db();
const app = express()
const port = process.env.BACKEND_PORT

// SET VIEW ENGINE to EJS
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

app.use(express.json())
app.use(cookieParser())
app.use(cors())

// ROUTES
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/admin", adminRoute)
app.get("*", (req, res) => {
    return res.status(404).json({message: "not found"})
})

// LISTEN
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})