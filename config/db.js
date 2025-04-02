const mongoose = require("mongoose"); // Importation de mongoose

// Connexion à MongoDB
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false); // Éviter les avertissements
    await mongoose.connect(process.env.DATABASE_URI, { // Utilisation de DATABASE_URI depuis .env
    });
  } catch (err) {
    process.exit(1); // Quitter l'application en cas d'échec
  }
};

// Fermer MongoDB proprement
const closeDB = async () => {
  try {
    await mongoose.connection.close(); // Fermer toutes les connexions
  } catch (err) {
  }
};

module.exports = { connectDB, closeDB };