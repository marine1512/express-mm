const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Lire le token dans les cookies

  if (!token) {
    return res.status(401).render('404'); // Redirige vers la page 404
  }

  try {
    const decoded = jwt.verify(token, process.env.secretKey); // Décoder le token
    req.user = decoded; // Attacher les infos utilisateur à req.user
    next(); // Continuer vers la prochaine étape (route)
  } catch (error) {
    return res.status(403).render('404'); // Redirige vers la page 404
  }
};

module.exports = authMiddleware;