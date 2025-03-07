const mongoose = require('mongoose');

   const connectDB = async () => {
       try {
           await mongoose.connect('mongodb://127.0.0.1:27017/EXPRESS_MM', {
               useNewUrlParser: true,
               useUnifiedTopology: true,
               useCreateIndex: true
           });
           console.log('Connexion à MongoDB réussie');
       } catch (err) {
           console.error('Erreur lors de la connexion à MongoDB :', err.message);
           process.exit(1); // Arrête le serveur si la connexion échoue
       }
   };

   module.exports = connectDB;
