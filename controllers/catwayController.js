const catwayService = require('../services/catwayService');
const Catway = require('../models/catway');

/** 
 * @module catwayController
 * @description Controller qui gère les catways
*/

/**
 * Récupère toutes les catways et les rend à la vue 'catways'.
 *
 * @async
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
const getAllCatways = async (req, res) => {
    try {
        const catways = await catwayService.getAllCatways();
        res.render('catways', { catways });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des catways', error });
    }
};

/**
 * Récupère une catway par son ID et la rend à la vue 'catway-detail'.
 *
 * @async
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
const getCatwayById = async (req, res) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ 
            message: 'ID invalide. Un ObjectId MongoDB valide est requis.' 
        });
    }

    try {
        const catway = await catwayService.getCatwayById(id);
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvée.' });
        }
        res.render('catway-detail', { catway });
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur interne du serveur',
            error: error.message 
        });
    }
};

/**
 * Crée une nouvelle catway et redirige vers la liste des catways.
 *
 * @async
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
const createCatway = async (req, res) => {
    const { catwayNumber, type, catwayState } = req.body;

    if (!catwayNumber) {
        return res.status(400).json({ message: 'Le champ Numéro est obligatoire.' });
    }

    try {
        await catwayService.createCatway({ catwayNumber, type, catwayState });
        res.redirect('/catways');
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la Catway.', error });
    }
};

/**
 * Met à jour une catway par son ID.
 *
 * @async
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
const updateCatway = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCatway = await catwayService.updateCatwayById(id, req.body);
        if (!updatedCatway) {
            return res.status(404).send('Catway introuvable');
        }
        res.render('catway-detail', { catway: updatedCatway });
    } catch (error) {
        res.status(500).send('Erreur serveur lors de la mise à jour');
    }
};

/**
 * Supprime une catway par son ID.
 *
 * @async
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>}
 */
const deleteCatway = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCatway = await catwayService.deleteCatwayById(id);
        if (!deletedCatway) {
            return res.status(404).json({ message: 'Catway non trouvée' });
        }
        res.redirect('/catways');
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la catway', error });
    }
};

/**
 * Service pour gérer les opérations sur les catways.
 */
class CatwayService {
    /**
     * Récupère les détails d'un catway par son ID.
     *
     * @async
     * @param {string} catwayId - L'ID de la catway.
     * @returns {Promise<Object>} La catway correspondante ou `null` si elle n'existe pas.
     */
    static async getCatwayDetails(catwayId) {
        return await Catway.findById(catwayId);
    }

    /**
     * Met à jour un catway par son ID.
     *
     * @async
     * @param {string} catwayId - L'ID de la catway.
     * @param {Object} updateData - Les données mises à jour.
     * @returns {Promise<Object>} La catway mise à jour ou `null` si elle n'existe pas.
     */
    static async updateCatway(catwayId, updateData) {
        return await Catway.findByIdAndUpdate(
            catwayId,
            { $set: updateData },
            { new: true }
        );
    }
}

/**
 * Contrôleur pour les opérations sur les catways.
 */
class CatwayController {
    /**
     * Met à jour une catway par son ID.
     *
     * @async
     * @param {Object} req - L'objet de requête HTTP.
     * @param {Object} res - L'objet de réponse HTTP.
     * @returns {Promise<void>}
     */
    static async update(req, res) {
        try {
            const updatedCatway = await catwayService.updateCatway(req.params.id, req.body);
            if (!updatedCatway) return res.status(404).send("Catway not found");
            res.redirect('/catways');
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = {
    getAllCatways,
    getCatwayById,
    createCatway,
    updateCatway,
    deleteCatway,
    CatwayService,
    CatwayController
};