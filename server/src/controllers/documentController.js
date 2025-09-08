// server/src/controllers/documentController.js
const Document = require('../models/Document');
const documentService = require('../services/documentService');
const geminiService = require('../config/gemini');
const { cleanupFile } = require('../middleware/upload');
const path = require('path');

// @desc    Upload document
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    const user = req.user;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Check document limit for free users
    if (user.subscription === 'free') {
      const documentCount = await Document.getUserDocumentCount(user._id);
      if (documentCount >= 10) {
        cleanupFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Document limit reached for free tier (10 documents)'
        });
      }
    }

    const { originalname, filename, path: filePath, size, mimetype } = req.file;
    const fileType = mimetype.includes('pdf') ? 'pdf' : 'docx';

    try {
      // Extract text from document
      const extractionResult = await documentService.extractText(filePath, fileType);

      // Create document record
      const document = await Document.create({
        user: user._id,
        title: req.body.title || originalname.replace(/\.[^/.]+$/, ""),
        originalFilename: originalname,
        filename,
        filePath,
        fileType,
        fileSize: size,
        extractedText: extractionResult.text,
        wordCount: extractionResult.wordCount,
        pageCount: extractionResult.pageCount,
        status: 'completed',
        metadata: {
          ...extractionResult.metadata,
          uploadedAt: new Date()
        }
      });

      // Increment user usage
      await user.incrementUsage('document');
      await user.incrementUsage('request');

      res.status(201).json({
        success: true,
        message: 'Document uploaded and processed successfully',
        data: {
          document: {
            id: document._id,
            title: document.title,
            fileType: document.fileType,
            fileSize: document.fileSize,
            wordCount: document.wordCount,
            pageCount: document.pageCount,
            status: document.status,
            createdAt: document.createdAt
          }
        }
      });

    } catch (extractionError) {
      // Clean up file if extraction fails
      cleanupFile(filePath);
      throw extractionError;
    }

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process document',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all user documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    const query = { user: req.user._id };
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    if (status) {
      query.status = status;
    }

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-extractedText -filePath');

    const total = await Document.countDocuments(query);

    res.status(200).json({
      success: true,
      data: documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve documents'
    });
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.status(200).json({
      success: true,
      data: document
    });

  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve document'
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Clean up file from disk
    cleanupFile(document.filePath);

    // Delete from database
    await Document.findByIdAndDelete(req.params.id);

    // Decrement user document count
    await req.user.incrementUsage('document', -1);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document'
    });
  }
};

// @desc    Analyze document
// @route   POST /api/documents/:id/analyze
// @access  Private
const analyzeDocument = async (req, res) => {
  try {
    const { analysisType = 'general' } = req.body;
    const user = req.user;

    // Check if user can make request
    if (!user.canMakeRequest()) {
      return res.status(429).json({
        success: false,
        message: 'Monthly request limit exceeded'
      });
    }

    const document = await Document.findOne({
      _id: req.params.id,
      user: user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if document can be analyzed again
    if (!document.canAnalyze()) {
      return res.status(400).json({
        success: false,
        message: 'Document was analyzed recently. Please wait before analyzing again.'
      });
    }

    // Analyze document with AI
    const analysisResult = await geminiService.analyzeDocument(
      document.extractedText,
      analysisType
    );

    if (!analysisResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Analysis failed',
        error: analysisResult.error
      });
    }

    // Generate document summary
    const summary = documentService.generateSummary(document.extractedText);

    // Update document with analysis results
    document.analysis = {
      lastAnalyzed: new Date(),
      grammarScore: Math.floor(Math.random() * 30) + 70, // Simulated score
      clarityScore: Math.floor(Math.random() * 30) + 70,
      originalityScore: Math.floor(Math.random() * 30) + 70,
      structureScore: Math.floor(Math.random() * 30) + 70,
      overallScore: Math.floor(Math.random() * 30) + 70,
      suggestions: analysisResult.text.split('\n').filter(line => 
        line.trim().length > 0 && line.includes('.')
      ).slice(0, 10),
      issues: summary.issues
    };

    await document.save();

    // Increment user usage
    await user.incrementUsage('request');

    res.status(200).json({
      success: true,
      message: 'Document analysis completed',
      data: {
        analysis: document.analysis,
        summary,
        aiResponse: analysisResult.text
      }
    });

  } catch (error) {
    console.error('Analyze document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze document'
    });
  }
};

// @desc    Download document
// @route   GET /api/documents/:id/download
// @access  Private
const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const filePath = path.resolve(document.filePath);
    
    res.download(filePath, document.originalFilename, (error) => {
      if (error) {
        console.error('Download error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to download document'
        });
      }
    });

  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download document'
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  analyzeDocument,
  downloadDocument
};