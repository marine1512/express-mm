const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth"); // Middleware pour valider le token

// Route protégée, accessible uniquement avec un token valide
router.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Bienvenue dans la route protégée !",
    user: req.user, // Les données utilisateur extraites du token
  });
});

module.exports = router;