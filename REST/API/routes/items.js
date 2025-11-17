const express = require('express');
const router = express.Router();
const { getAllItems, getItemById, createItem, updateItem, deleteItem } = require('../controllers/items');
const { itemValidation } = require('../validators/itemValidator');
const { validateToken } = require('../middleware/auth');

router.get('/', getAllItems);
router.get('/:id', getItemById);

router.post('/', validateToken, itemValidation, createItem);
router.put('/:id', validateToken, itemValidation, updateItem);
router.delete('/:id', validateToken, deleteItem);

module.exports = router;