const { validationResult } = require('express-validator');
const { findAll, findById, create, update, remove } = require('../models/Item');

const getAllItems = async (req, res) => {
    try {
        const items = await findAll();
        res.status(200).json(items);
    } catch(error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Failed to get items' });
    }
};

const getItemById = async (req, res) => {
    try {
        const id = req.params.id;
        const item = await findById(id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json(item);
    } catch(error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Failed to fetch item' });
    }
};

const createItem = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            error: validationErrors.array()
        });
    }

    try {
        const { name, price } = req.body;

        const newProduct = {
            name: name,
            price: parseFloat(price)
        };

        const itemId = await create(newProduct);

        res.status(201).json({ id: itemId });
    } catch(error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Failed to add item' });
    }
};

const updateItem = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            error: validationErrors.array()
        });
    }

    try {
        const id = req.params.id;
        const { name, price } = req.body;

        const item = await findById(id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Build update object with only provided fields
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (price !== undefined) updateData.price = parseFloat(price);

        const updatedItem = await update(id, updateData);

        res.status(200).json(updatedItem);
    } catch(error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Failed to update item' });
    }
};

const deleteItem = async (req, res) => {
    try {
        const id = req.params.id;

        const item = await findById(id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        await remove(id);

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch(error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
};

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
};