const express = require('express');
const verifyToken = require('../middleware/verifyToken'); // Middleware de vérification de token
const authenticateToken = require('../middleware/auth'); // Middleware d'authentification
const router = express.Router();
const catways = require('./catways');

// Définir la route GET /protected
router.get('/', authenticateToken, verifyToken, (req, res) => {
  res.render('catways');
});

module.exports = router;