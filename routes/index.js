const express = require('express');
const router = express.Router(); // Crée une instance de routeur

router.get('/', (req, res) => {
    res.render('login');
});

// Exporte le routeur
module.exports = router;