const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { isAuthenticated } = require('../config/auth-middleware');

router.use(isAuthenticated);

router.get('/rotation', reportController.getRotationReport);
router.get('/movements', reportController.getMovementsReport);
router.get('/profits', reportController.getProfitsReport);

module.exports = router;