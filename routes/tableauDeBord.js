const express = require('express');

const router = express.Router();

router.get('/tableau', (req, res) => {
    console.log('Accès à /tableau avec utilisateur :', req.user); // Debugging
    res.render('tableauDeBord'); // Renvoi de la vue
  });

// Exporter le router 
module.exports = router;