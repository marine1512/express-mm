const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Récupérer le cookie contenant le token
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé : aucun token trouvé.' });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Vérifie que le token est valide
    req.user = decoded; // Ajoute les données décodées du token à `req.user`
    next(); // Passe au middleware suivant
  } catch (error) {
    console.error('Erreur token authMiddleware :', error.message);
    res.status(403).json({ error: 'Token invalide ou expiré.' });
  }
};

module.exports = authMiddleware;