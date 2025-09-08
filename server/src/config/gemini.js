// server/src/config/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-pro' 
    });
  }

  async generateResponse(prompt, context = '') {
    try {
      const fullPrompt = context ? `${context}\n\nUser Query: ${prompt}` : prompt;
      
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      
      return {
        success: true,
        text: response.text(),
        tokens: response.candidates?.[0]?.tokenCount || 0
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        success: false,
        error: error.message,
        text: 'I apologize, but I encountered an error processing your request. Please try again.'
      };
    }
  }

  async analyzeDocument(text, analysisType = 'general') {
    const prompts = {
      general: `Please analyze this academic document and provide feedback on:
1. Overall structure and organization
2. Clarity of arguments
3. Academic writing style
4. Suggestions for improvement

Document text: ${text.substring(0, 4000)}...`,

      grammar: `Please review this text for grammar, spelling, and style issues. Provide specific corrections and suggestions:

${text.substring(0, 4000)}...`,

      plagiarism: `Analyze this text for potential originality issues. Look for:
1. Common phrases that might need citation
2. Academic concepts that require references
3. Suggestions for improving originality

Text: ${text.substring(0, 4000)}...`,

      structure: `Evaluate the structure of this academic paper. Comment on:
1. Introduction effectiveness
2. Methodology clarity
3. Results presentation
4. Conclusion strength
5. Overall flow and coherence

Document: ${text.substring(0, 4000)}...`
    };

    return this.generateResponse(prompts[analysisType] || prompts.general);
  }

  async generateResearchHelp(query, paperType = 'research') {
    const context = `You are an expert academic research assistant. Help researchers write high-quality papers with proper structure, citations, and academic language. Focus on ${paperType} papers.`;
    
    return this.generateResponse(query, context);
  }
}

export default new GeminiService();