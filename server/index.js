const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const authRouter = require("./routes/authRoutes")

const PORT = process.env.PORT

app = express()

app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

connectDB();

app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
    res.send('Server Social Network Attivo');
});

app.listen(PORT, () => {
    console.log("Il server è attivo sulla porta " + PORT)
})