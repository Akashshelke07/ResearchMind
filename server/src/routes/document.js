// server/src/routes/document.js
const express = require('express');
const {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  analyzeDocument,
  downloadDocument
} = require('../controllers/documentController');
const { protect, checkFreeTierLimits } = require('../middleware/auth');
const { handleUpload } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Routes
router.post('/upload', uploadLimiter, checkFreeTierLimits, handleUpload, uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);
router.post('/:id/analyze', checkFreeTierLimits, analyzeDocument);
router.get('/:id/download', downloadDocument);

module.exports = router;