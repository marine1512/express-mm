const express = require('express');

const router = express.Router();

/**
 * @swagger
 * /tableau:
 *   get:
 *     summary: Affiche le tableau de bord
 *     tags: [Tableau de bord]
 *     description: Cette route renvoie une page affichant le tableau de bord. Le contenu est rendu sous la forme d'une vue HTML.
 *     responses:
 *       200:
 *         description: Page du tableau de bord affichée avec succès.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html><body>Contenu du tableau de bord</body></html>"
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/tableau', (req, res) => {
    res.render('tableauDeBord');
});

// Exporter le router 
module.exports = router;