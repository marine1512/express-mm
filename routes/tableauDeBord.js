const express = require('express');
const router = express.Router();

router.get('/tableau', (req, res) => {
    res.render('tableauDeBord');
});

// Exporter le router 
module.exports = router;