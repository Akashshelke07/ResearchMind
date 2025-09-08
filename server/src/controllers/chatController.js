// server/src/controllers/chatController.js
const Chat = require('../models/Chat');
const Document = require('../models/Document');
const geminiService = require('../config/gemini');

// @desc    Send chat message
// @route   POST /api/chat/message
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { message, chatId, context } = req.body;
    const user = req.user;

    // Check if user can make request
    if (!user.canMakeRequest()) {
      return res.status(429).json({
        success: false,
        message: 'Monthly request limit exceeded'
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    let chat;

    // Get or create chat
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: user._id });
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: 'Chat not found'
        });
      }
    } else {
      chat = new Chat({
        user: user._id,
        context: context || {}
      });
    }

    // Add user message
    await chat.addMessage('user', message.trim());

    // Build context for AI
    let aiContext = 'You are an expert academic research assistant. Help researchers write high-quality papers with proper structure, citations, and academic language.';

    // Add document context if available
    if (context?.documentId) {
      try {
        const document = await Document.findOne({
          _id: context.documentId,
          user: user._id
        });

        if (document) {
          aiContext += `\n\nDocument Context:\nTitle: ${document.title}\nContent: ${document.extractedText.substring(0, 3000)}...`;
        }
      } catch (docError) {
        console.error('Error fetching document context:', docError);
      }
    }

    // Add chat history context
    const recentContext = chat.getRecentContext(5);
    if (recentContext) {
      aiContext += `\n\nRecent conversation:\n${recentContext}`;
    }

    // Generate AI response
    const aiResponse = await geminiService.generateResponse(message, aiContext);

    if (!aiResponse.success) {
      await chat.addMessage('assistant', 'I apologize, but I encountered an error processing your request. Please try again.');
    } else {
      await chat.addMessage('assistant', aiResponse.text, {
        tokens: aiResponse.tokens,
        model: 'gemini-pro'
      });
    }

    // Increment user usage
    await user.incrementUsage('request');

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        chatId: chat._id,
        response: aiResponse.success ? aiResponse.text : 'I apologize, but I encountered an error processing your request. Please try again.',
        tokens: aiResponse.tokens || 0
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const { chatId, page = 1, limit = 10 } = req.query;
    const user = req.user;

    let query = { user: user._id, isActive: true };
    
    if (chatId) {
      query._id = chatId;
    }

    const chats = await Chat.find(query)
      .sort({ lastActivity: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.status(200).json({
      success: true,
      data: chats
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat history'
    });
  }
};

// @desc    Delete chat
// @route   DELETE /api/chat/:id
// @access  Private
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    chat.isActive = false;
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });

  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat'
    });
  }
};

// @desc    Clear chat messages
// @route   POST /api/chat/:id/clear
// @access  Private
const clearChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    chat.messages = [];
    chat.title = 'New Conversation';
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Chat cleared successfully'
    });

  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear chat'
    });
  }
};

// @desc    Update chat title
// @route   PUT /api/chat/:id
// @access  Private
const updateChat = async (req, res) => {
  try {
    const { title } = req.body;
    
    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (title) {
      chat.title = title.substring(0, 100); // Limit title length
    }

    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Chat updated successfully',
      data: chat
    });

  } catch (error) {
    console.error('Update chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update chat'
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  deleteChat,
  clearChat,
  updateChat
};