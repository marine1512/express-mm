const jwt = require('jsonwebtoken');

// Définissez votre clé secrète ici
const secretKey = '123456'; // Assurez-vous que cette clé est la même utilisée pour signer le token

const verifyToken = (req, res, next) => {
  // Récupérer l'en-tête Authorization
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).send('Accès interdit. Aucun token fourni.');
  }

  const token = authHeader.split(' ')[1]; // Supprime le "Bearer " pour obtenir uniquement le token

  try {
    // Vérifie et décode le token
    const decoded = jwt.verify(token, secretKey);

    // Enregistre les informations du token dans `req.user` pour la route suivante
    req.user = decoded;

    // Passe au traitement de la route protégée
    next();
  } catch (err) {
    console.error('Erreur lors de la validation du token :', err.message);

    // Le token est peut-être expiré ou invalide
    if (err.name === 'TokenExpiredError') {
      return res.status(403).send('Token expiré. Veuillez vous reconnecter.');
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(403).send('Token invalide.');
    }

    // Erreurs génériques
    return res.status(403).send('Impossible de vérifier le token.');
  }
};

module.exports = verifyToken;