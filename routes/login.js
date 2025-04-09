const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController'); // Import du contrôleur

router.get('/', authController.getLoginPage);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

module.exports = router; // Export des routes