/**
 * Establishes a connection to the MongoDB atlas database
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connessione riuscita: " + connection.connection.host);
    }
    catch (error) {
        console.log("Errore di connessione: " + error);
        process.exit(1);
    }
}

module.exports = connectDB;