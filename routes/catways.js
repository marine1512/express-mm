const express = require('express');
const router = express.Router();

// Exemple de route principale
router.get('/catways', (req, res) => {
    res.render('catways');
});

// Exporter le router pour l'utiliser dans server.js
module.exports = router;