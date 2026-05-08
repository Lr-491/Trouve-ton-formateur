/**
 * Routes des évaluations
 * POST /api/evaluations       
 * GET  /api/evaluations/user_id
 */

const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluation.controller');
const { verifyToken } = require('../middleware/auth.middleware');


// Voir les évaluationsd'unutilisateur (public)
router.get('/:user_id', evaluationController.getEvaluations);

// Notez un utilisateur (connecté)
router.post('/', verifyToken, evaluationController.noterUtilisateur);


module.exports = router;