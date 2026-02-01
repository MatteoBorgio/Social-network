const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log("Connessione riuscita: " + connection.connection.host)
    }
    catch (err) {
        console.log("Errore di connessione: " + err)
        process.exit(1)
    }
}

module.exports = connectDB