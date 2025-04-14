const Catway = require('../models/catway');

/** 
 * @module catwaysServices
 * @description Service qui gère les catways
*/

/**
 * Récupère toutes les entrées Catway depuis la base de données.
 * @async
 * @returns {Promise<Array>} Un tableau contenant tous les documents Catway.
 */
const getAllCatways = async () => {
    return await Catway.find();
};

/**
 * Récupère une entrée Catway par son ID.
 * @async
 * @param {string} id - L'ID du document Catway.
 * @returns {Promise<Object|null>} Le document Catway correspondant ou `null` si non trouvé.
 */
const getCatwayById = async (id) => {
    return await Catway.findById(id);
};

/**
 * Crée une nouvelle entrée Catway.
 * @async
 * @param {Object} data - Les détails de l'entrée Catway à créer.
 * @param {string} data.name - Nom du Catway (exemple).
 * @param {any} [data.property] - Autres propriétés du Catway.
 * @returns {Promise<Object>} L'entrée Catway nouvellement créée.
 */
const createCatway = async (data) => {
    const newCatway = new Catway(data);
    return await newCatway.save();
};

/**
 * Met à jour une entrée Catway par son ID.
 * @async
 * @param {string} id - L'ID du document Catway à mettre à jour.
 * @param {Object} data - Les données mises à jour pour le document Catway.
 * @param {string} [data.name] - Nom mis à jour (exemple).
 * @param {any} [data.property] - Autres propriétés mises à jour.
 * @returns {Promise<Object|null>} Le document Catway mis à jour ou `null` si non trouvé.
 */
const updateCatwayById = async (id, data) => {
    return await Catway.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Supprime une entrée Catway par son ID.
 * @async
 * @param {string} id - L'ID du document Catway à supprimer.
 * @returns {Promise<Object|null>} Le document Catway supprimé ou `null` si non trouvé.
 */
const deleteCatwayById = async (id) => {
    return await Catway.findByIdAndDelete(id);
};

module.exports = {
    getAllCatways,
    getCatwayById,
    createCatway,
    updateCatwayById,
    deleteCatwayById
};