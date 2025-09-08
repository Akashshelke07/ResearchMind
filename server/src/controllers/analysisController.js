// server/src/controllers/analysisController.js
const geminiService = require('../config/gemini');
const documentService = require('../services/documentService');

// @desc    Check plagiarism
// @route   POST /api/analysis/plagiarism
// @access  Private
const checkPlagiarism = async (req, res) => {
  try {
    const { text } = req.body;
    const user = req.user;

    // Check if user can make request
    if (!user.canMakeRequest()) {
      return res.status(429).json({
        success: false,
        message: 'Monthly request limit exceeded'
      });
    }

    // Check plagiarism limits for free users
    if (user.subscription === 'free' && user.usage.plagiarismChecks >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Plagiarism check limit exceeded for free tier (5 per month)'
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for plagiarism check'
      });
    }

    // Analyze with AI
    const analysisResult = await geminiService.analyzeDocument(text, 'plagiarism');

    if (!analysisResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Plagiarism analysis failed'
      });
    }

    // Generate similarity score (simulated)
    const similarityScore = Math.floor(Math.random() * 30) + 10; // 10-40%
    const originalityScore = 100 - similarityScore;

    // Extract potential issues from text
    const issues = documentService.findPotentialIssues(text);

    // Increment usage
    await user.incrementUsage('plagiarism');
    await user.incrementUsage('request');

    res.status(200).json({
      success: true,
      message: 'Plagiarism check completed',
      data: {
        similarityScore,
        originalityScore,
        analysisText: analysisResult.text,
        issues: issues.filter(issue => issue.type === 'academic'),
        suggestions: [
          'Add proper citations for referenced concepts',
          'Paraphrase common phrases more uniquely',
          'Include more original analysis and interpretation',
          'Use direct quotes with proper attribution when necessary'
        ],
        checkedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Plagiarism check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform plagiarism check'
    });
  }
};

// @desc    Check grammar
// @route   POST /api/analysis/grammar
// @access  Private
const checkGrammar = async (req, res) => {
  try {
    const { text } = req.body;
    const user = req.user;

    // Check if user can make request
    if (!user.canMakeRequest()) {
      return res.status(429).json({
        success: false,
        message: 'Monthly request limit exceeded'
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for grammar check'
      });
    }

    // Analyze with AI
    const analysisResult = await geminiService.analyzeDocument(text, 'grammar');

    if (!analysisResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Grammar analysis failed'
      });
    }

    // Find grammar and style issues
    const issues = documentService.findPotentialIssues(text);
    const summary = documentService.generateSummary(text);

    // Calculate grammar score
    const grammarScore = Math.max(60, 100 - (issues.length * 5));

    // Increment usage
    await user.incrementUsage('request');

    res.status(200).json({
      success: true,
      message: 'Grammar check completed',
      data: {
        grammarScore,
        readabilityScore: summary.readabilityScore,
        analysisText: analysisResult.text,
        issues: issues.filter(issue => ['grammar', 'style', 'clarity'].includes(issue.type)),
        statistics: {
          wordCount: summary.totalWords,
          sentenceCount: summary.totalSentences,
          averageSentenceLength: summary.averageSentenceLength
        },
        checkedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Grammar check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform grammar check'
    });
  }
};

// @desc    Check formatting
// @route   POST /api/analysis/format
// @access  Private
const checkFormatting = async (req, res) => {
  try {
    const { text, style = 'APA' } = req.body;
    const user = req.user;

    // Check if user can make request
    if (!user.canMakeRequest()) {
      return res.status(429).json({
        success: false,
        message: 'Monthly request limit exceeded'
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for formatting check'
      });
    }

    // Analyze structure
    const structure = documentService.analyzeStructure(text);
    const issues = documentService.findPotentialIssues(text);

    // Generate formatting suggestions based on style
    const formatSuggestions = generateFormattingSuggestions(text, style, structure);

    // Calculate formatting score
    const formattingScore = calculateFormattingScore(structure, issues);

    // Increment usage
    await user.incrementUsage('request');

    res.status(200).json({
      success: true,
      message: 'Formatting check completed',
      data: {
        formattingScore,
        style,
        structure,
        suggestions: formatSuggestions,
        issues: issues.filter(issue => issue.type === 'formatting'),
        checkedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Formatting check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform formatting check'
    });
  }
};

// @desc    Get comprehensive analysis report
// @route   GET /api/analysis/report/:documentId
// @access  Private
const getAnalysisReport = async (req, res) => {
  try {
    const Document = require('../models/Document');
    
    const document = await Document.findOne({
      _id: req.params.documentId,
      user: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (!document.analysis || !document.analysis.lastAnalyzed) {
      return res.status(400).json({
        success: false,
        message: 'Document has not been analyzed yet'
      });
    }

    // Generate comprehensive report
    const summary = documentService.generateSummary(document.extractedText);
    
    const report = {
      document: {
        title: document.title,
        wordCount: document.wordCount,
        pageCount: document.pageCount,
        createdAt: document.createdAt
      },
      analysis: document.analysis,
      summary,
      recommendations: generateRecommendations(document.analysis, summary),
      generatedAt: new Date()
    };

    res.status(200).json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Get analysis report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate analysis report'
    });
  }
};

// Helper function to generate formatting suggestions
const generateFormattingSuggestions = (text, style, structure) => {
  const suggestions = [];

  if (!structure.abstract) {
    suggestions.push(`Add an abstract section (${style} style requires an abstract)`);
  }

  if (!structure.introduction) {
    suggestions.push('Include a clear introduction section');
  }

  if (!structure.methodology && style === 'APA') {
    suggestions.push('Add a methodology section for research papers');
  }

  if (!structure.references) {
    suggestions.push(`Include a references section formatted in ${style} style`);
  }

  // Check for proper headings
  if (!text.includes('# ') && !text.includes('## ')) {
    suggestions.push('Use proper heading hierarchy (H1, H2, H3)');
  }

  // Check citation format
  if (style === 'APA' && !text.includes('(') && !text.includes(')')) {
    suggestions.push('Use APA in-text citations (Author, Year)');
  }

  return suggestions;
};

// Helper function to calculate formatting score
const calculateFormattingScore = (structure, issues) => {
  let score = 100;

  // Deduct points for missing sections
  const requiredSections = ['introduction', 'conclusion', 'references'];
  requiredSections.forEach(section => {
    if (!structure[section]) score -= 15;
  });

  // Deduct points for formatting issues
  const formattingIssues = issues.filter(issue => issue.type === 'formatting');
  score -= formattingIssues.length * 5;

  return Math.max(0, score);
};

// Helper function to generate recommendations
const generateRecommendations = (analysis, summary) => {
  const recommendations = [];

  if (analysis.grammarScore < 80) {
    recommendations.push({
      priority: 'high',
      category: 'Grammar',
      suggestion: 'Review and improve grammar and sentence structure'
    });
  }

  if (analysis.clarityScore < 70) {
    recommendations.push({
      priority: 'high',
      category: 'Clarity',
      suggestion: 'Simplify complex sentences and improve clarity'
    });
  }

  if (analysis.originalityScore < 80) {
    recommendations.push({
      priority: 'medium',
      category: 'Originality',
      suggestion: 'Add more original analysis and ensure proper citations'
    });
  }

  if (summary.averageSentenceLength > 25) {
    recommendations.push({
      priority: 'medium',
      category: 'Readability',
      suggestion: 'Break down long sentences for better readability'
    });
  }

  return recommendations;
};

module.exports = {
  checkPlagiarism,
  checkGrammar,
  checkFormatting,
  getAnalysisReport
};