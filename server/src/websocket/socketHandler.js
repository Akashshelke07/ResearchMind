// server/src/websocket/socketHandler.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Chat = require('../models/Chat');
const geminiService = require('../config/gemini');

const socketHandler = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.name} connected: ${socket.id}`);

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Handle chat message
    socket.on('chat_message', async (data) => {
      try {
        const { message, chatId, context } = data;

        // Check user limits
        if (!socket.user.canMakeRequest()) {
          socket.emit('error', { message: 'Monthly request limit exceeded' });
          return;
        }

        // Validate message
        if (!message || !message.trim()) {
          socket.emit('error', { message: 'Message is required' });
          return;
        }

        let chat;

        // Get or create chat
        if (chatId) {
          chat = await Chat.findOne({ _id: chatId, user: socket.userId });
          if (!chat) {
            socket.emit('error', { message: 'Chat not found' });
            return;
          }
        } else {
          chat = new Chat({
            user: socket.userId,
            context: context || {}
          });
        }

        // Add user message
        await chat.addMessage('user', message.trim());

        // Emit user message to client
        socket.emit('message_received', {
          role: 'user',
          content: message.trim(),
          timestamp: new Date()
        });

        // Generate AI response
        socket.emit('ai_typing', true);

        const aiContext = buildAIContext(context, chat);
        const aiResponse = await geminiService.generateResponse(message, aiContext);

        socket.emit('ai_typing', false);

        const responseText = aiResponse.success 
          ? aiResponse.text 
          : 'I apologize, but I encountered an error processing your request. Please try again.';

        // Add AI response to chat
        await chat.addMessage('assistant', responseText, {
          tokens: aiResponse.tokens,
          model: 'gemini-pro'
        });

        // Emit AI response to client
        socket.emit('message_received', {
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
          chatId: chat._id
        });

        // Increment user usage
        await socket.user.incrementUsage('request');

      } catch (error) {
        console.error('Socket chat error:', error);
        socket.emit('error', { message: 'Failed to process message' });
        socket.emit('ai_typing', false);
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(`user_${socket.userId}`).emit('user_typing', {
        userId: socket.userId,
        chatId: data.chatId
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(`user_${socket.userId}`).emit('user_stopped_typing', {
        userId: socket.userId,
        chatId: data.chatId
      });
    });

    // Handle document analysis requests
    socket.on('analyze_document', async (data) => {
      try {
        const { documentId, analysisType } = data;

        if (!socket.user.canMakeRequest()) {
          socket.emit('error', { message: 'Monthly request limit exceeded' });
          return;
        }

        const Document = require('../models/Document');
        const document = await Document.findOne({
          _id: documentId,
          user: socket.userId
        });

        if (!document) {
          socket.emit('error', { message: 'Document not found' });
          return;
        }

        socket.emit('analysis_started', { documentId });

        const analysisResult = await geminiService.analyzeDocument(
          document.extractedText,
          analysisType
        );

        socket.emit('analysis_completed', {
          documentId,
          result: analysisResult,
          timestamp: new Date()
        });

        await socket.user.incrementUsage('request');

      } catch (error) {
        console.error('Socket analysis error:', error);
        socket.emit('error', { message: 'Analysis failed' });
      }
    });

    // Handle file upload progress
    socket.on('upload_progress', (data) => {
      socket.emit('upload_status', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.name} disconnected: ${socket.id}`);
      socket.leave(`user_${socket.userId}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};

// Helper function to build AI context
const buildAIContext = (context, chat) => {
  let aiContext = 'You are an expert academic research assistant. Help researchers write high-quality papers with proper structure, citations, and academic language.';

  // Add paper type context
  if (context?.paperType) {
    aiContext += `\n\nPaper Type: ${context.paperType}`;
  }

  // Add stage context
  if (context?.stage) {
    aiContext += `\nCurrent Stage: ${context.stage}`;
  }

  // Add recent conversation history
  const recentContext = chat.getRecentContext(5);
  if (recentContext) {
    aiContext += `\n\nRecent conversation:\n${recentContext}`;
  }

  return aiContext;
};

module.exports = socketHandler;