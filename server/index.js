/**
 * Main file of the application
 * Contains all the routes and initialize the server
 * Manage the connection to the database and the static assets
 */

const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const authRouter = require("./routes/authRoutes")
const postRouter = require("./routes/postRoutes")

const PORT = process.env.PORT

app = express()

app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

app.use('/api/auth', authRouter)

app.use('/api/post', postRouter)

app.get('/', (req, res) => {
    res.send('Server Social Network Attivo');
});

app.listen(PORT, () => {
    console.log("Il server è attivo sulla porta " + PORT)
})