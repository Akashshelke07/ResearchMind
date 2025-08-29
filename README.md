# ResearchMind 🧠📝

## Free-Tier Research Paper Assistant with MCP Server Integration

ResearchMind is a specialized AI-powered research paper writing assistant that provides GPT-like interaction specifically tailored for academic writing. Unlike generic AI tools, ResearchMind focuses on research paper publishing standards, academic integrity, and originality checks.

---

## 🌟 Key Features

### Core Functionality
- **GPT-like Chat Interface** - Interactive AI guidance for research paper writing
- **Document Upload Support** - PDF/DOCX file processing and analysis
- **Voice-to-Text Integration** - Microphone input for hands-free writing
- **Session Management** - Start/Stop controls for writing sessions
- **Academic Structure Guidance** - Step-by-step paper structure assistance
- **Originality Scanning** - Basic plagiarism detection
- **Formatting Compliance** - APA/IEEE/MLA formatting checks
- **Ethical Compliance** - Bias and ethics validation

### Technical Features
- **Responsive Design** - Desktop, tablet, and mobile optimized
- **Free-Tier Limitations** - Sustainable usage controls
- **Real-time Processing** - Instant AI feedback
- **Document History** - Session and chat persistence
- **Scalable Architecture** - Ready for custom AI model integration

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Layer      │
│   (React)       │◄──►│ (Node.js/Express)│◄──►│ (Gemini API)    │
│                 │    │                 │    │                 │
│ • Chat UI       │    │ • File Upload   │    │ • Paper Analysis│
│ • File Upload   │    │ • Speech-to-Text│    │ • Structure Aid │
│ • Voice Input   │    │ • Document Parse│    │ • Originality   │
│ • Session Ctrl  │    │ • API Routing   │    │ • Format Check  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Database      │
                       │   (MongoDB)     │
                       │                 │
                       │ • User Data     │
                       │ • Documents     │
                       │ • Chat History  │
                       │ • Usage Logs    │
                       └─────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Gemini API key (free tier)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/researchmind.git
cd researchmind
```

2. **Install dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

3. **Environment Configuration**
```bash
# Create .env file in root directory
cp .env.example .env

# Configure your environment variables
MONGODB_URI=mongodb://localhost:27017/researchmind
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
SPEECH_API_KEY=your_speech_api_key_here
NODE_ENV=development
PORT=5000
```

4. **Start the application**
```bash
# Development mode (runs both backend and frontend)
npm run dev

# Production mode
npm run build
npm start
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

---

## 📁 Project Structure

```
researchmind/
├── client/                     # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Chat/
│   │   │   │   ├── ChatWindow.js
│   │   │   │   ├── MessageInput.js
│   │   │   │   └── VoiceInput.js
│   │   │   ├── FileUpload/
│   │   │   │   └── FileUploader.js
│   │   │   ├── Layout/
│   │   │   │   ├── Header.js
│   │   │   │   ├── Sidebar.js
│   │   │   │   └── Footer.js
│   │   │   └── UI/
│   │   │       ├── Button.js
│   │   │       ├── Modal.js
│   │   │       └── LoadingSpinner.js
│   │   ├── pages/              # Page components
│   │   │   ├── Home.js
│   │   │   ├── Dashboard.js
│   │   │   ├── PaperWriter.js
│   │   │   └── History.js
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useChat.js
│   │   │   ├── useFileUpload.js
│   │   │   └── useVoiceInput.js
│   │   ├── services/           # API services
│   │   │   ├── api.js
│   │   │   ├── chatService.js
│   │   │   └── fileService.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                     # Node.js backend
│   ├── controllers/            # Route controllers
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── fileController.js
│   │   └── userController.js
│   ├── middleware/             # Custom middleware
│   │   ├── auth.js
│   │   ├── rateLimiter.js
│   │   ├── fileUpload.js
│   │   └── errorHandler.js
│   ├── models/                 # MongoDB models
│   │   ├── User.js
│   │   ├── Document.js
│   │   ├── ChatSession.js
│   │   └── UsageLog.js
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── files.js
│   │   └── users.js
│   ├── services/               # Business logic
│   │   ├── aiService.js
│   │   ├── documentParser.js
│   │   ├── speechService.js
│   │   └── plagiarismService.js
│   ├── utils/                  # Utility functions
│   │   ├── logger.js
│   │   ├── validation.js
│   │   └── constants.js
│   ├── config/                 # Configuration files
│   │   ├── database.js
│   │   └── gemini.js
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
│
├── docs/                       # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── tests/                      # Test files
│   ├── frontend/
│   └── backend/
│
├── .env.example               # Environment template
├── .gitignore
├── package.json               # Root package.json
├── README.md
└── docker-compose.yml         # Docker setup
```

---

## 🎯 Free-Tier Limitations

### Daily Limits
- **3 document uploads per day** (max 10MB each)
- **5000 words per writing session**
- **50 AI interactions per day**
- **Basic plagiarism scan only** (no premium APIs)

### Storage Limits
- **Chat history**: 7 days retention
- **Document storage**: 30 days
- **User accounts**: Guest mode available

### API Rate Limits
- **Gemini API**: Free tier quota
- **Speech-to-Text**: Limited daily minutes
- **File processing**: Basic parsing only

---

## 🔧 Development

### Backend Development
```bash
# Start backend only
npm run server

# Run backend tests
npm run test:server

# Database migration
npm run migrate
```

### Frontend Development
```bash
# Start frontend only
npm run client

# Run frontend tests
npm run test:client

# Build production frontend
npm run build:client
```

### Environment Setup
- Copy `.env.example` to `.env`
- Configure MongoDB connection
- Add Gemini API key
- Set up speech-to-text service
- Configure JWT secret

---

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register        # User registration
POST /api/auth/login          # User login
POST /api/auth/logout         # User logout
GET  /api/auth/me             # Get user profile
```

### Chat Endpoints
```
POST /api/chat/message        # Send message to AI
GET  /api/chat/history        # Get chat history
DELETE /api/chat/clear        # Clear chat history
POST /api/chat/session/start  # Start writing session
POST /api/chat/session/stop   # Stop writing session
```

### File Management
```
POST /api/files/upload        # Upload document
GET  /api/files/list          # List user documents
DELETE /api/files/:id         # Delete document
GET  /api/files/:id/analyze   # Analyze document
```

### Voice Processing
```
POST /api/voice/transcribe    # Speech to text
POST /api/voice/synthesize    # Text to speech (future)
```

---

## 🛠️ Key Technologies

### Frontend Stack
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP requests
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Framer Motion** - Animations

### Backend Stack
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Multer** - File uploads
- **JWT** - Authentication
- **Winston** - Logging

### AI & Processing
- **Google Gemini API** - Core AI
- **pdf-parse** - PDF processing
- **mammoth** - DOCX processing
- **Google Speech API** - Speech-to-text
- **Natural** - Text processing

---

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-first approach**
- **Touch-friendly interface**
- **Adaptive layouts**
- **Dark/Light theme support**

### Accessibility
- **ARIA compliance**
- **Keyboard navigation**
- **Screen reader support**
- **High contrast mode**

### User Experience
- **Real-time feedback**
- **Progress indicators**
- **Error handling**
- **Offline capabilities** (limited)

---

## 🔒 Security Features

### Data Protection
- **JWT authentication**
- **Password hashing**
- **File validation**
- **XSS protection**
- **CSRF protection**

### API Security
- **Rate limiting**
- **Input sanitization**
- **File type validation**
- **Size restrictions**
- **Usage tracking**

---

## 📈 Future Roadmap

### Phase 1 (Current)
- ✅ Basic chat interface
- ✅ Document upload
- ✅ Gemini API integration
- ✅ Free-tier limitations
- ✅ Responsive design

### Phase 2 (Next)
- 🔄 Custom AI model training
- 🔄 Advanced plagiarism detection
- 🔄 Citation management
- 🔄 Collaboration features
- 🔄 Premium tier

### Phase 3 (Future)
- 📋 Multi-language support
- 📋 Advanced analytics
- 📋 Institutional licensing
- 📋 API marketplace
- 📋 Mobile apps

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details.

### Development Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- Use ESLint configuration
- Follow React best practices
- Maintain test coverage
- Document new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Email**: akashshelke594@gmail.com
- **Portfolio**: https://portfolio-g59hnaqmj-akashshelke07s-projects.vercel.app/

---

## 🏆 Acknowledgments

- **Google Gemini** - AI processing
- **MongoDB** - Database solution
- **React Team** - Frontend framework
- **Node.js Community** - Backend runtime
- **Open Source Contributors** - Various dependencies

---

**Built with ❤️ for researchers, by developers who understand academic writing challenges.**

---

*ResearchMind - Making academic writing accessible, ethical, and efficient.*
