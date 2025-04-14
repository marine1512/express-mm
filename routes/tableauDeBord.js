/**
 * @swagger
 * tags:
 *   name: Tableau de bord
 *   description: Gestion du tableau de bord
 */

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /tableau:
 *   get:
 *     summary: Accès au tableau de bord
 *     tags: [Tableau de bord]
 *     responses:
 *       200:
 *         description: Vue rendue avec succès du tableau de bord
 *       401:
 *         description: Utilisateur non autorisé (non connecté)
 *       500:
 *         description: Erreur interne lors du rendu du tableau
 */
router.get('/tableau', (req, res) => {
    res.render('tableauDeBord'); // Renvoi de la vue
  });

// Exporter le router 
module.exports = router;
