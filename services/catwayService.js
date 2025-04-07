const Catway = require('../models/catway');

const getAllCatways = async () => {
    return await Catway.find();
};

const getCatwayById = async (id) => {
    return await Catway.findById(id);
};

const createCatway = async (data) => {
    const newCatway = new Catway(data);
    return await newCatway.save();
};

const updateCatwayById = async (id, data) => {
    return await Catway.findByIdAndUpdate(id, data, { new: true });
};

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