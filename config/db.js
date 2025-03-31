const mongoose = require("mongoose"); // Importation de mongoose

// Connexion à MongoDB
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false); // Éviter les avertissements
    await mongoose.connect(process.env.DATABASE_URI, { // Utilisation de DATABASE_URI depuis .env
    });
    console.log("Connexion réussie à MongoDB !");
  } catch (err) {
    console.error("Erreur de connexion à MongoDB :", err.message);
    process.exit(1); // Quitter l'application en cas d'échec
  }
};

module.exports = connectDB;