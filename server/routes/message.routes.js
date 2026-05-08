/**
 * Routes des messages
 * POST /api/messages                    → envoyer un message
 * GET  /api/messages/conversations      → toutes ses conversations
 * GET  /api/messages/:user_id           → conversation avec un utilisateur
 */

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Toutes les routes nécessitent d'être connecté
router.post('/', verifyToken, messageController.envoyerMessage);
router.get('/conversations', verifyToken, messageController.getConversations);
router.get('/:user_id', verifyToken, messageController.getConversation);

module.exports = router;