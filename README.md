# 📚 MCP Research Assistant Server

A comprehensive academic research assistant platform designed to help researchers publish papers with clarity, originality, and adherence to academic standards.

## 🚀 Features

- **AI-Powered Research Guidance**: Step-by-step paper structuring support
- **Document Analysis**: Upload and analyze PDF/DOCX research papers
- **Plagiarism Detection**: Built-in plagiarism checking capabilities
- **Multi-modal Input**: Text, file upload, and voice input support
- **Academic Compliance**: Grammar, clarity, and formatting checks
- **Reference Management**: APA/IEEE/MLA formatting assistance
- **Free-Tier Access**: Accessible version with controlled limitations

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Features & Usage](#features--usage)
- [Free-Tier Limitations](#free-tier-limitations)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Tech Stack

### Frontend
- **React.js** (v18.2.0) - UI framework
- **Tailwind CSS** (v3.3.0) - Styling
- **Axios** - HTTP client
- **React Router** (v6) - Navigation
- **Web Speech API** - Voice input
- **Socket.io-client** - Real-time communication

### Backend
- **Node.js** (v18+) - Runtime environment
- **Express.js** (v4.18.0) - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction

### AI Integration
- **Google Gemini API** - Primary AI model
- **OpenAI Whisper API** - Voice transcription (optional)

## 📁 Project Structure

```
mcp-research-assistant/
├── client/                     # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── MessageList.jsx
│   │   │   │   └── MessageInput.jsx
│   │   │   ├── Upload/
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   └── UploadProgress.jsx
│   │   │   ├── Voice/
│   │   │   │   └── VoiceInput.jsx
│   │   │   ├── Layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── Auth/
│   │   │       ├── Login.jsx
│   │   │       ├── Register.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Analysis.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── websocket.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useChat.js
│   │   │   └── useVoice.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── validators.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                     # Node.js backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── gemini.js
│   │   │   └── config.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── chatController.js
│   │   │   ├── documentController.js
│   │   │   ├── analysisController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── upload.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Document.js
│   │   │   ├── Analysis.js
│   │   │   └── Chat.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── chat.js
│   │   │   ├── document.js
│   │   │   ├── analysis.js
│   │   │   └── index.js
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── documentService.js
│   │   │   ├── plagiarismService.js
│   │   │   └── formattingService.js
│   │   ├── utils/
│   │   │   ├── textExtractor.js
│   │   │   ├── validator.js
│   │   │   └── logger.js
│   │   ├── websocket/
│   │   │   └── socketHandler.js
│   │   └── app.js
│   ├── uploads/               # Temporary file storage
│   ├── logs/                  # Application logs
│   ├── package.json
│   ├── server.js
│   └── .env.example
│
├── docker/                    # Docker configuration
│   ├── Dockerfile.client
│   ├── Dockerfile.server
│   └── docker-compose.yml
│
├── scripts/                   # Utility scripts
│   ├── setup.sh
│   ├── seed.js
│   └── deploy.sh
│
├── docs/                      # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
│
├── .gitignore
├── README.md
├── LICENSE
└── package.json              # Root package.json for scripts

```

## 📦 Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager
- Google Cloud account (for Gemini API)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/mcp-research-assistant.git
cd mcp-research-assistant
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Set up environment variables

Create `.env` files in both client and server directories:

**Server `.env`:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/mcp-research-assistant
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/mcp-research-assistant

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_DIR=./uploads

# Rate Limiting (Free Tier)
FREE_TIER_REQUESTS_PER_MONTH=50
FREE_TIER_MAX_FILE_SIZE=5242880

# Email (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Whisper API (Optional - for voice)
WHISPER_API_KEY=your_whisper_api_key

# CORS
CLIENT_URL=http://localhost:3000
```

**Client `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_MAX_FILE_SIZE=5242880
```

### 4. Set up MongoDB

```bash
# If using local MongoDB
mongod --dbpath /path/to/your/db

# Create database and collections
mongo
> use mcp-research-assistant
> db.createCollection("users")
> db.createCollection("documents")
> db.createCollection("analyses")
> db.createCollection("chats")
```

## 🚀 Running the Application

### Development Mode

```bash
# From root directory - runs both frontend and backend
npm run dev

# Or run separately:

# Backend (from server directory)
npm run dev

# Frontend (from client directory)
npm start
```

### Production Mode

```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm run start:prod
```

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Stop containers
docker-compose down
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get user profile |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh` | Refresh token |

### Document Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload` | Upload document |
| GET | `/api/documents` | Get user documents |
| GET | `/api/documents/:id` | Get specific document |
| DELETE | `/api/documents/:id` | Delete document |
| POST | `/api/documents/:id/analyze` | Analyze document |

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/message` | Send chat message |
| GET | `/api/chat/history` | Get chat history |
| DELETE | `/api/chat/:id` | Delete chat session |

### Analysis Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analysis/plagiarism` | Check plagiarism |
| POST | `/api/analysis/grammar` | Check grammar |
| POST | `/api/analysis/format` | Check formatting |
| GET | `/api/analysis/report/:id` | Get analysis report |

## 💡 Features & Usage

### 1. User Registration & Login
- Create account with email verification
- Secure JWT-based authentication
- Password reset functionality

### 2. Document Upload
- Support for PDF and DOCX files
- Automatic text extraction
- File size validation (5MB for free tier)

### 3. AI-Powered Analysis
- Real-time chat interface
- Research paper structure guidance
- Grammar and clarity improvements
- Academic compliance checking

### 4. Voice Input
- Click microphone button to start recording
- Automatic speech-to-text conversion
- Support for multiple languages

### 5. Plagiarism Detection
- Basic similarity checking
- Citation verification
- Originality score calculation

### 6. Export & Download
- Download improved documents
- Export analysis reports
- Save chat history

## 🎯 Free-Tier Limitations

| Feature | Free Tier | Premium (Future) |
|---------|-----------|-----------------|
| Monthly AI Requests | 50 | Unlimited |
| Max File Size | 5 MB | 50 MB |
| Document Storage | 10 documents | Unlimited |
| Plagiarism Checks | 5/month | Unlimited |
| Voice Input | 10 min/month | Unlimited |
| Export Format | PDF only | All formats |
| Priority Support | ❌ | ✅ |

## 🏗 Architecture

### System Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Server    │────▶│   MongoDB   │
│  (React)    │     │  (Express)  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                            │
                            ▼
                    ┌─────────────┐
                    │  Gemini AI  │
                    │     API     │
                    └─────────────┘
```

### Data Flow
1. User interacts with React frontend
2. Request sent to Express backend
3. Backend processes request (auth, validation)
4. Document text extracted if file uploaded
5. AI service processes content via Gemini API
6. Results stored in MongoDB
7. Response sent back to client
8. UI updates with AI feedback

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write unit tests for new features
- Update documentation
- Ensure all tests pass before PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for providing the AI capabilities
- MongoDB for database solutions
- The open-source community for various libraries used

## 📧 Contact

Project Maintainer - [Email](akashshelke594@gmail.com)

Project Link: [Github](https://github.com/Akashshelke07/ResearchMind)

---

**Note**: This is a free-tier academic project. For commercial use or advanced features, please contact the maintainers.
