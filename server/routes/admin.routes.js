/**
 * Routes du panel admin
 * Toutes les routes nécessitent d'être connecté en tant qu'admin
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');

// Toutes les routes admin sont protégées
router.use(verifyToken, verifyRole('admin'));

// Gestion des utilisateurs
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/role', adminController.updateRole);

// Gestion des offres
router.get('/offres', adminController.getAllOffres);
router.delete('/offres/:id', adminController.deleteOffre);

// Statistiques
router.get('/stats', adminController.getStats);

module.exports = router;