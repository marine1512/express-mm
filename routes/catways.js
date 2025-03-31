const express = require('express');
const router = express.Router();
const Catway = require('../models/catway'); // Importer le modèle Catway

const reservationsRoutes = require('../routes/reservations'); // Chemin vers routes/reservation.js


// 1. Récupérer toutes les catways
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

// 3. Créer une nouvelle Catway
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

// 4. Mettre à jour une catway par ID
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

// 5. Supprimer une catway par ID
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