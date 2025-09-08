// server/src/services/documentService.js
const fs = require('fs').promises;
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

class DocumentService {
  
  // Extract text from uploaded file
  async extractText(filePath, fileType) {
    try {
      let extractedText = '';
      let metadata = {};

      if (fileType === 'pdf') {
        const result = await this.extractFromPDF(filePath);
        extractedText = result.text;
        metadata = result.metadata;
      } else if (fileType === 'docx') {
        const result = await this.extractFromDOCX(filePath);
        extractedText = result.text;
        metadata = result.metadata;
      }

      return {
        text: this.cleanText(extractedText),
        metadata,
        wordCount: this.countWords(extractedText),
        pageCount: metadata.numpages || 1
      };

    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error(`Failed to extract text from ${fileType.toUpperCase()} file`);
    }
  }

  // Extract text from PDF
  async extractFromPDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      
      return {
        text: data.text,
        metadata: {
          numpages: data.numpages,
          info: data.info,
          version: data.version
        }
      };
    } catch (error) {
      throw new Error('Invalid or corrupted PDF file');
    }
  }

  // Extract text from DOCX
  async extractFromDOCX(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      
      return {
        text: result.value,
        metadata: {
          messages: result.messages
        }
      };
    } catch (error) {
      throw new Error('Invalid or corrupted DOCX file');
    }
  }

  // Clean extracted text
  cleanText(text) {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .trim();
  }

  // Count words in text
  countWords(text) {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  // Analyze document structure
  analyzeStructure(text) {
    const sections = {
      abstract: false,
      introduction: false,
      methodology: false,
      results: false,
      discussion: false,
      conclusion: false,
      references: false
    };

    const lowercaseText = text.toLowerCase();

    // Check for common academic sections
    if (lowercaseText.includes('abstract')) sections.abstract = true;
    if (lowercaseText.includes('introduction')) sections.introduction = true;
    if (lowercaseText.includes('method') || lowercaseText.includes('approach')) sections.methodology = true;
    if (lowercaseText.includes('result') || lowercaseText.includes('finding')) sections.results = true;
    if (lowercaseText.includes('discussion') || lowercaseText.includes('analysis')) sections.discussion = true;
    if (lowercaseText.includes('conclusion') || lowercaseText.includes('summary')) sections.conclusion = true;
    if (lowercaseText.includes('reference') || lowercaseText.includes('bibliograph')) sections.references = true;

    return sections;
  }

  // Extract potential issues
  findPotentialIssues(text) {
    const issues = [];

    // Check for common writing issues
    const patterns = [
      {
        pattern: /\b(very|really|quite|pretty)\s+/gi,
        type: 'style',
        severity: 'low',
        description: 'Consider removing weak intensifiers'
      },
      {
        pattern: /\b(thing|things|stuff)\b/gi,
        type: 'clarity',
        severity: 'medium',
        description: 'Use more specific terms instead of vague words'
      },
      {
        pattern: /\b(I think|I believe|I feel)\b/gi,
        type: 'academic',
        severity: 'medium',
        description: 'Avoid first-person expressions in academic writing'
      },
      {
        pattern: /\?\?+|\!\!+/g,
        type: 'formatting',
        severity: 'high',
        description: 'Remove excessive punctuation'
      },
      {
        pattern: /\b\w{20,}\b/g,
        type: 'readability',
        severity: 'low',
        description: 'Consider breaking up very long words or terms'
      }
    ];

    patterns.forEach(({ pattern, type, severity, description }) => {
      const matches = text.match(pattern);
      if (matches) {
        issues.push({
          type,
          severity,
          description,
          count: matches.length,
          examples: matches.slice(0, 3) // First 3 examples
        });
      }
    });

    return issues;
  }

  // Generate document summary
  generateSummary(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const wordCount = this.countWords(text);
    const avgSentenceLength = wordCount / sentences.length || 0;
    
    return {
      totalWords: wordCount,
      totalSentences: sentences.length,
      averageSentenceLength: Math.round(avgSentenceLength),
      readabilityScore: this.calculateReadabilityScore(text),
      structure: this.analyzeStructure(text),
      issues: this.findPotentialIssues(text)
    };
  }

  // Simple readability score calculation (Flesch Reading Ease approximation)
  calculateReadabilityScore(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((total, word) => total + this.countSyllables(word), 0);

    if (sentences.length === 0 || words.length === 0) return 0;

    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    // Simplified Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // Count syllables in a word (simplified)
  countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let count = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }
    
    // Handle silent 'e'
    if (word.endsWith('e')) count--;
    
    return count < 1 ? 1 : count;
  }

  // Delete uploaded file
  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }

  // Validate file
  validateFile(file, maxSize = 5242880) { // 5MB default
    const errors = [];

    if (!file) {
      errors.push('No file provided');
      return errors;
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      errors.push('Only PDF and DOCX files are allowed');
    }

    // Check file extension
    const allowedExtensions = ['.pdf', '.docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      errors.push('Invalid file extension');
    }

    return errors;
  }
}

module.exports = new DocumentService();