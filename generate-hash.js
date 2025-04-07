// generate-hash.js

const bcrypt = require("bcrypt");

const password = "root123456"; // Remplacez par le mot de passe que vous voulez hacher

bcrypt.hash(password, 10).then((newHash) => {
  console.log("Nouveau hash généré :", newHash);
}).catch((err) => {
  console.error("Erreur lors de la génération du hash :", err);
});