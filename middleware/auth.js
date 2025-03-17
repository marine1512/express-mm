const jwt = require("jsonwebtoken");

// Middleware de vérification du Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Headers de la requête

  // Vérifiez si un token est présent dans les headers
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Accès interdit. Token manquant." });
  }

  // Vérifiez la validité du token
  jwt.verify(token, "123456", (err, user) => { // Remplacez "SECRET_KEY" par votre clé secrète réelle
    if (err) {
      return res.status(403).json({ error: "Token invalide." });
    }
    req.user = user; // Stocker les informations décryptées dans req.user
    next(); // Passer à la route suivante
  });
};

module.exports = authenticateToken;