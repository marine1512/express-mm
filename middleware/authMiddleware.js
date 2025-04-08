const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Lire le token dans les cookies

  console.log('Token reçu dans le middleware :', token); // Debugging

  if (!token) {
    console.log('Aucun token trouvé, accès refusé.');
    return res.status(401).render('login'); // Redirige vers la page de connexion
  }

  try {
    const decoded = jwt.verify(token, process.env.secretKey); // Décoder le token
    console.log('Token validé, utilisateur :', decoded); // Debugging
    req.user = decoded; // Attacher les infos utilisateur à req.user
    next(); // Continuer vers la prochaine étape (route)
  } catch (error) {
    console.log('Erreur de validation JWT :', error.message); // Debugging
    return res.status(403).render('login'); // Redirige vers la page de connexion ou une erreur
  }
};

module.exports = authMiddleware;