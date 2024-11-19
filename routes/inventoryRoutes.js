const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { isAuthenticated, isAdmin } = require('../config/auth-middleware');

router.use(isAuthenticated);

router.get('/dashboard', inventoryController.getDashboard);
router.get('/products', inventoryController.getProducts);
router.post('/products', isAdmin, inventoryController.createProduct);
router.put('/products/:id', isAdmin, inventoryController.updateProduct);
router.delete('/products/:id', isAdmin, inventoryController.deleteProduct);

router.get('/movements', inventoryController.getMovements);
router.post('/movements', inventoryController.createMovement);

module.exports = router;