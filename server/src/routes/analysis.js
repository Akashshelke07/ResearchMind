// server/src/routes/analysis.js
const express = require('express');
const { body } = require('express-validator');
const {
  checkPlagiarism,
  checkGrammar,
  checkFormatting,
  getAnalysisReport
} = require('../controllers/analysisController');
const { protect, checkFreeTierLimits } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Validation rules
const textValidation = [
  body('text')
    .trim()
    .isLength({ min: 10, max: 10000 })
    .withMessage('Text must be between 10 and 10,000 characters')
];

const formatValidation = [
  ...textValidation,
  body('style')
    .optional()
    .isIn(['APA', 'MLA', 'IEEE', 'Chicago'])
    .withMessage('Style must be APA, MLA, IEEE, or Chicago')
];

// Routes
router.post('/plagiarism', aiLimiter, checkFreeTierLimits, textValidation, checkPlagiarism);
router.post('/grammar', aiLimiter, checkFreeTierLimits, textValidation, checkGrammar);
router.post('/format', aiLimiter, checkFreeTierLimits, formatValidation, checkFormatting);
router.get('/report/:documentId', getAnalysisReport);

module.exports = router;