const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Vérification du header Authorization
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Accès non autorisé : aucun token fourni" });
  }

  // Extraction du token (en retirant 'Bearer ')
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Accès non autorisé : mauvais format de token" });
  }

  try {
    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "maCléSecrète");
    req.user = decoded; // Stockage des données utilisateur dans req.user
    next(); // Passage au middleware suivant ou à la route
  } catch (err) {
    console.error("Erreur lors de la vérification du token :", err);
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
};

module.exports = authMiddleware;