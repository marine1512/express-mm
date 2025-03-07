const express = require('express');
const router = express.Router();

// Exemple de route principale
router.get('/', (req, res) => {
    res.render('login');
});

// Exporter le router pour l'utiliser dans server.js
module.exports = router;