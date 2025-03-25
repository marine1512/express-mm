const express = require('express');
const router = express.Router();

router.get('/tableau', (req, res) => {
    res.render('tableauDeBord');
});

// Exporter le router pour l'utiliser dans server.js
module.exports = router;