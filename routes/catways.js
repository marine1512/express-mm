const express = require('express');
const router = express.Router();
const Catway = require('../models/catway'); // Importer le modèle Catway
const reservationsRoutes = require('../routes/reservations'); // Chemin vers routes/reservation.js

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Récupère la liste des "catways"
 *     tags: [Catways]
 *     description: Cette route renvoie tous les "catways" disponibles depuis la base de données et les affiche au format HTML.
 *     responses:
 *       200:
 *         description: Liste de "catways" récupérée avec succès.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: |
 *                 <!DOCTYPE html>
 *                 <html>
 *                   <head><title>Catways</title></head>
 *                   <body>
 *                     <h1>Liste des Catways</h1>
 *                     <!-- Liste des catways ici -->
 *                   </body>
 *                 </html>
 *       500:
 *         description: Erreur interne lors de la récupération des "catways".
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la récupération des catways"
 *                 error:
 *                   type: string
 *                   example: "<Détails de l'erreur>"
 */
router.get('/', async (req, res) => {
    try {
        const catways = await Catway.find();
        res.render('catways', { catways });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des catways', error });
    }
});


// 2. Récupérer une catway par ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Vérifier si l'ID est un ObjectId valide
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                message: 'ID invalide. Un ObjectId MongoDB valide est requis.' 
            });
        }

        // Rechercher la catway dans la base de données
        const catway = await Catway.findById(id);

        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvée.' });
        }

        res.json(catway);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur interne du serveur',
            error: error.message 
        });
    }
});

/**
 * @swagger
 * /catways:
 *   post:
 *     summary: Crée une nouvelle catway
 *     tags: [Catways]
 *     description: Crée une nouvelle Catway avec le numéro, le type et l'état fournis, puis l'enregistre dans la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayNumber:
 *                 type: string
 *                 description: Numéro unique de la Catway.
 *                 example: "1234"
 *               type:
 *                 type: string
 *                 description: Type de la Catway.
 *                 example: "Standard"
 *               catwayState:
 *                 type: string
 *                 description: État actuel de la Catway.
 *                 example: "Actif"
 *             required:
 *               - catwayNumber
 *     responses:
 *       201:
 *         description: Catway créée avec succès.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Redirection vers la liste mise à jour des Catways.
 *       400:
 *         description: Données invalides ou champ manquant.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Le champ Numéro est obligatoire.
 *       500:
 *         description: Erreur serveur lors de la création de la Catway.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la création de la Catway.
 *                 error:
 *                   type: string
 *                   example: Détail de l'erreur serveur.
 */
router.post('/', async (req, res) => {
    const { catwayNumber, type, catwayState } = req.body;

    // Valider les données
    if (!catwayNumber) {
        return res.status(400).json({ message: 'Le champ Numéro est obligatoire.' });
    }

    try {
        // Créer une nouvelle instance avec les données de la requête
        const newCatway = new Catway({
            catwayNumber,
            type,
            catwayState,
        });

        // Enregistrer dans la base de données
        await newCatway.save();

        // Rediriger pour afficher la liste mise à jour
        res.redirect('/catways');
    } catch (error) {
        console.error('Erreur lors de la création de la Catway:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la Catway.', error });
    }
});

/**
 * @swagger
 * /catways/{id}:
 *   put:
 *     summary: Met à jour un Catway existant
 *     tags: [Catways]
 *     description: Met à jour les informations d'un Catway dans la base de données en utilisant son ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID unique du Catway à mettre à jour.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Données mises à jour pour le Catway.
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du Catway.
 *               description:
 *                 type: string
 *                 description: Description du Catway.
 *               status:
 *                 type: string
 *                 description: Statut du Catway (par exemple actif/inactif).
 *     responses:
 *       200:
 *         description: Succès - Catway mis à jour avec succès.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Redirection vers la liste des Catways.
 *       404:
 *         description: Catway introuvable.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Catway introuvable"
 *       500:
 *         description: Erreur interne sur le serveur.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Erreur serveur lors de la mise à jour"
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Journalisation avant mise à jour de la base

        const updatedCatway = await Catway.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCatway) {
            console.error('[ERROR] Aucun résultat pour ID :', id);
            return res.status(404).send('Catway introuvable');
        }
        res.redirect('/catways');
    } catch (error) {
        res.status(500).send('Erreur serveur lors de la mise à jour');
    }
});

/**
 * @swagger
 * /catways/{id}:
 *   delete:
 *     summary: Supprime une Catway
 *     tags: [Catways]
 *     description: Supprime une Catway de la base de données en fonction de l'identifiant fourni.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'identifiant unique de la Catway à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catway supprimée avec succès et redirection vers la liste.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Redirection vers /catways.
 *       404:
 *         description: Catway non trouvée.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Catway non trouvée"
 *       500:
 *         description: Erreur serveur lors de la suppression de la Catway.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la suppression de la catway"
 *                 error:
 *                   type: string
 *                   example: "<détails de l'erreur interne>"
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedCatway = await Catway.findByIdAndDelete(req.params.id);

        if (!deletedCatway) {
            return res.status(404).json({ message: 'Catway non trouvée' });
        }

        console.log(`Catway supprimée avec succès :`, deletedCatway);
        res.redirect('/catways'); // Redirige vers la liste des Catways
    } catch (error) {
        console.error('[DELETE ERROR]', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la catway', error });
    }
});

router.use('/:id', reservationsRoutes);
// Exporter les routes
module.exports = router;