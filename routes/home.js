const express = require('express');
const router = express.Router(); // Crée une instance de routeur

router.get('/home', (req, res) => {
    res.render('home');
});

// Exporte le routeur
module.exports = router;