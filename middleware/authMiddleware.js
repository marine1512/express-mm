const jwt = require('jsonwebtoken');
const app = require('express')();

// Exclure Swagger et ses fichiers statiques du middleware d'authentification
app.use((req, res, next) => {
  if (
    req.path.startsWith('/api-docs') ||
    req.path.startsWith('/swagger.json') ||
    req.path.startsWith('/swagger-ui')
  ) {
    return next(); // Passer directement à la route suivante
  }
  authMiddleware(req, res, next); // Appliquer l'authentification pour les autres routes
});

const authMiddleware = (req, res, next) => {
    // Ignorer l'authentification en mode test
    if (process.env.NODE_ENV === 'test') {
      console.log('Middleware auth ignoré en mode test');
      return next();
    };
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