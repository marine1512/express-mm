const bcrypt = require('bcrypt');

const plainPassword = "root123456"; // Mot de passe en clair
const hashedPassword = "$2b$10$Kt53GJyMM/hC9sdFtiX4IeazLnMP.fmMvZEtt4HjzvRGDJNlfu6Pe"; // Mot de passe haché de votre base

bcrypt.compare(plainPassword, hashedPassword)
  .then((isMatch) => {
    console.log("Le mot de passe correspond ?", isMatch); // Doit afficher `true` si tout est correct
  })
  .catch((err) => {
    console.error("Erreur lors de la comparaison :", err);
  });