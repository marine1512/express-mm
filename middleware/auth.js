const jwt = require("jsonwebtoken");

const secretKey = "123456"; // Remplacez par votre clé secrète

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Récupérer le header Authorization
  const token = authHeader && authHeader.split(" ")[1]; // Obtenir le token après "Bearer "

  if (!token) {
    return res.status(401).json({ error: "Token manquant. Accès interdit." });
  }

  // Vérifier le token
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide." });
    }

    // Ajouter les informations utilisateur (du token) à la requête
    req.user = user;
    next(); // Passer au prochain middleware (ou à la route)
  });
};

module.exports = authenticateToken;