// server/src/routes/chat.js
const express = require('express');
const { body } = require('express-validator');
const {
  sendMessage,
  getChatHistory,
  deleteChat,
  clearChat,
  updateChat
} = require('../controllers/chatController');
const { protect, checkFreeTierLimits } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Validation rules
const messageValidation = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters')
];

const titleValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
];

// Routes
router.post('/message', aiLimiter, checkFreeTierLimits, messageValidation, sendMessage);
router.get('/history', getChatHistory);
router.delete('/:id', deleteChat);
router.post('/:id/clear', clearChat);
router.put('/:id', titleValidation, updateChat);

module.exports = router;