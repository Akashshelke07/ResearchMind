# 📚 ResearchMind - AI-Powered Academic Research Assistant

<div align="center">

![ResearchMind Logo](https://img.shields.io/badge/ResearchMind-AI%20Assistant-blue?style=for-the-badge&logo=book&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

**Transform your academic writing with AI-powered research assistance, document analysis, and intelligent feedback.**

[🚀 Quick Start](#-quick-start) •
[📖 Documentation](#-documentation) •
[✨ Features](#-features) •
[🛠️ Installation](#️-installation) •
[🤝 Contributing](#-contributing)

</div>

---

## 🎯 **What is ResearchMind?**

ResearchMind is a comprehensive academic research assistant that leverages advanced AI to help researchers, students, and academics write better papers. From document analysis to plagiarism detection, it provides intelligent feedback to enhance your academic writing quality.

### 🌟 **Why Choose ResearchMind?**

- **🤖 AI-Powered**: Advanced Google Gemini AI for intelligent research assistance
- **📄 Document Analysis**: Upload PDF/DOCX files for comprehensive analysis
- **🔍 Plagiarism Detection**: Built-in originality checking with citation suggestions
- **📝 Grammar & Style**: Professional-grade writing improvement recommendations
- **💬 Interactive Chat**: Real-time AI assistant for research questions
- **🎤 Voice Input**: Natural voice interaction for seamless workflow
- **📊 Analytics**: Track your writing progress and improvement over time
- **🆓 Free Tier**: Get started with 50 AI requests per month

---

## ✨ **Features**

<table>
<tr>
<td width="50%">

### 🎓 **For Students**
- **Paper Structure Guidance** - Get help organizing your research
- **Citation Assistance** - Proper APA, MLA, IEEE formatting
- **Grammar Enhancement** - Improve clarity and academic tone
- **Originality Checking** - Ensure your work is plagiarism-free
- **Research Questions** - AI-generated research directions

</td>
<td width="50%">

### 👨‍🏫 **For Educators**
- **Bulk Document Analysis** - Process multiple papers efficiently
- **Student Progress Tracking** - Monitor improvement over time
- **Custom Feedback** - Personalized suggestions for each student
- **Academic Standards** - Ensure compliance with institutional requirements
- **Time-Saving Tools** - Automate repetitive review tasks

</td>
</tr>
</table>

### 🔧 **Technical Features**

| Feature | Description | Status |
|---------|-------------|--------|
| 🤖 **AI Chat Assistant** | Real-time research help with Google Gemini | ✅ Active |
| 📄 **Document Upload** | PDF & DOCX support with text extraction | ✅ Active |
| 🔍 **Plagiarism Detection** | Similarity checking with citation suggestions | ✅ Active |
| ✍️ **Grammar Analysis** | Advanced grammar and style improvements | ✅ Active |
| 📊 **Analytics Dashboard** | Usage tracking and progress monitoring | ✅ Active |
| 🎤 **Voice Input** | Speech-to-text for natural interaction | ✅ Active |
| 🔄 **Real-time Sync** | WebSocket-based live updates | ✅ Active |
| 🌐 **Multi-format Export** | Download improved documents | 🚧 Coming Soon |

---

## 🚀 **Quick Start**

Get ResearchMind running in under 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/mcp-research-assistant.git
cd mcp-research-assistant

# 2. Install all dependencies
npm run install:all

# 3. Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# 4. Add your Google Gemini API key to server/.env
# GEMINI_API_KEY=your_api_key_here

# 5. Start the application
npm run dev
```

🎉 **That's it!** Open http://localhost:3000 and start researching!

> **Need an API key?** Get your free Google Gemini API key at [Google AI Studio](https://makersuite.google.com/app/apikey)

---

## 🛠️ **Installation**

### 📋 **Prerequisites**

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0+ ([Download](https://nodejs.org/))
- **MongoDB** 5.0+ ([Download](https://www.mongodb.com/try/download/community)) or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### 🔑 **Required API Keys**

| Service | Purpose | How to Get |
|---------|---------|------------|
| **Google Gemini API** | AI Research Assistant | [Get API Key](https://makersuite.google.com/app/apikey) |
| **MongoDB** | Database Storage | [Local](https://docs.mongodb.com/manual/installation/) or [Atlas](https://www.mongodb.com/atlas) |

### 📦 **Step-by-Step Installation**

#### 1. **Clone and Setup**
```bash
# Clone the repository
git clone https://github.com/your-username/mcp-research-assistant.git
cd mcp-research-assistant

# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Return to root directory
cd ..
```

#### 2. **Environment Configuration**

**Server Configuration (`server/.env`):**
```env
# Server Settings
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/mcp-research-assistant
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/mcp-research-assistant

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_64_characters_minimum
JWT_EXPIRE=30d

# AI Integration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# Free Tier Limits
FREE_TIER_REQUESTS_PER_MONTH=50
FREE_TIER_MAX_FILE_SIZE=5242880

# CORS
CLIENT_URL=http://localhost:3000
```

**Client Configuration (`client/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_MAX_FILE_SIZE=5242880
```

#### 3. **Database Setup**

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# macOS (with Homebrew)
brew services start mongodb/brew/mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `server/.env`

#### 4. **Get API Keys**

**Google Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy key to `GEMINI_API_KEY` in `server/.env`

#### 5. **Run the Application**

```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately:
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm start
```

#### 6. **Access the Application**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

---

## 📖 **Documentation**

### 🎯 **Usage Guide**

#### **Getting Started**
1. **Register Account**: Create your free account at http://localhost:3000/register
2. **Upload Document**: Go to Dashboard → Upload and select a PDF or DOCX file
3. **AI Analysis**: Click "Analyze" to get AI-powered feedback
4. **Chat Assistant**: Use the chat feature for research questions
5. **Track Progress**: Monitor your usage and improvements in the dashboard

#### **Free Tier Limits**
| Resource | Free Tier | Premium |
|----------|-----------|---------|
| Monthly AI Requests | 50 | Unlimited |
| File Size Limit | 5 MB | 50 MB |
| Document Storage | 10 files | Unlimited |
| Plagiarism Checks | 5/month | Unlimited |
| Voice Input | 10 min/month | Unlimited |

### 📚 **API Documentation**

#### **Authentication Endpoints**
```http
POST /api/auth/register     # Register new user
POST /api/auth/login        # User login
GET  /api/auth/profile      # Get user profile
PUT  /api/auth/profile      # Update profile
POST /api/auth/logout       # Logout user
GET  /api/auth/usage        # Get usage statistics
```

#### **Document Endpoints**
```http
POST   /api/documents/upload        # Upload document
GET    /api/documents               # Get user documents
GET    /api/documents/:id           # Get specific document
DELETE /api/documents/:id           # Delete document
POST   /api/documents/:id/analyze   # Analyze document
GET    /api/documents/:id/download  # Download document
```

#### **Chat Endpoints**
```http
POST   /api/chat/message     # Send chat message
GET    /api/chat/history     # Get chat history
DELETE /api/chat/:id         # Delete chat session
PUT    /api/chat/:id         # Update chat
POST   /api/chat/:id/clear   # Clear chat messages
```

#### **Analysis Endpoints**
```http
POST /api/analysis/plagiarism    # Check plagiarism
POST /api/analysis/grammar       # Check grammar
POST /api/analysis/format        # Check formatting
GET  /api/analysis/report/:id    # Get analysis report
```

### 🏗️ **Architecture**

```mermaid
graph TB
    A[React Client] --> B[Express Server]
    B --> C[MongoDB Database]
    B --> D[Google Gemini AI]
    B --> E[File Storage]
    A <--> F[WebSocket Connection]
    B --> F
    
    subgraph "Client Side"
        A --> A1[Authentication]
        A --> A2[Document Management]
        A --> A3[Chat Interface]
        A --> A4[Analytics Dashboard]
    end
    
    subgraph "Server Side"
        B --> B1[Auth Middleware]
        B --> B2[File Processing]
        B --> B3[AI Integration]
        B --> B4[Rate Limiting]
    end
```

---

## 🔧 **Development**

### 🚀 **Getting Started with Development**

```bash
# Clone for development
git clone https://github.com/your-username/mcp-research-assistant.git
cd mcp-research-assistant

# Install dependencies
npm run install:all

# Start development servers
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### 📁 **Project Structure**

```
mcp-research-assistant/
├── 📄 README.md
├── 📄 package.json                 # Root package management
├── 📁 server/                      # Backend (Node.js/Express)
│   ├── 📄 server.js               # Entry point
│   ├── 📄 package.json            # Server dependencies
│   ├── 📁 src/
│   │   ├── 📁 config/             # Configuration files
│   │   ├── 📁 controllers/        # Route controllers
│   │   ├── 📁 middleware/         # Express middleware
│   │   ├── 📁 models/             # MongoDB models
│   │   ├── 📁 routes/             # API routes
│   │   ├── 📁 services/           # Business logic
│   │   └── 📁 websocket/          # Socket.io handlers
│   ├── 📁 uploads/                # File storage
│   └── 📁 logs/                   # Application logs
├── 📁 client/                      # Frontend (React)
│   ├── 📄 package.json            # Client dependencies
│   ├── 📁 public/                 # Static assets
│   └── 📁 src/
│       ├── 📁 components/         # React components
│       ├── 📁 pages/              # Page components
│       ├── 📁 services/           # API services
│       ├── 📁 hooks/              # Custom hooks
│       ├── 📁 context/            # React contexts
│       └── 📁 styles/             # CSS files
└── 📁 docs/                       # Documentation
```

### 🛠️ **Tech Stack**

#### **Frontend**
- **React 18.2.0** - Modern UI framework
- **Tailwind CSS 3.3.0** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication

#### **Backend**
- **Node.js 18+** - Runtime environment
- **Express.js 4.18.0** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Multer** - File uploads

#### **AI & Services**
- **Google Gemini AI** - Language model
- **PDF-Parse** - PDF text extraction
- **Mammoth** - DOCX processing
- **Winston** - Logging

### 🧪 **Testing**

```bash
# Run all tests
npm test

# Run server tests
cd server && npm test

# Run client tests
cd client && npm test

# Run tests with coverage
npm run test:coverage
```

### 🚀 **Deployment**

#### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

#### **Manual Deployment**
```bash
# Build frontend
cd client && npm run build

# Start production server
cd ../server && npm run start:prod
```

---

## 🤝 **Contributing**

We welcome contributions from the community! Here's how you can help:

### 🌟 **Ways to Contribute**

- 🐛 **Bug Reports** - Help us identify and fix issues
- 💡 **Feature Requests** - Suggest new functionality
- 📝 **Documentation** - Improve guides and tutorials
- 🔧 **Code Contributions** - Submit pull requests
- 🎨 **UI/UX Improvements** - Enhance user experience
- 🌐 **Translations** - Add support for more languages

### 📋 **Contribution Guidelines**

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### 🎯 **Development Guidelines**

- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### 👥 **Contributors**

<a href="https://github.com/your-username/mcp-research-assistant/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=your-username/mcp-research-assistant" />
</a>

---

## 🆘 **Troubleshooting**

### 🐛 **Common Issues**

<details>
<summary><strong>❌ "Cannot connect to MongoDB"</strong></summary>

**Solution:**
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB service
# macOS
brew services start mongodb/brew/mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```
</details>

<details>
<summary><strong>❌ "GEMINI_API_KEY not defined"</strong></summary>

**Solution:**
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `server/.env`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. Restart server
</details>

<details>
<summary><strong>❌ "Port 3000/5000 already in use"</strong></summary>

**Solution:**
```bash
# Find and kill process using the port
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```
</details>

<details>
<summary><strong>❌ "Module not found" errors</strong></summary>

**Solution:**
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Do the same in server/ and client/ directories
```
</details>

### 📞 **Getting Help**

- 📖 **Documentation** - Check our comprehensive guides
- 💬 **Discord Community** - Join our developer community
- 🐛 **GitHub Issues** - Report bugs and request features
- 📧 **Email Support** - Contact our team directly

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 ResearchMind Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 **Acknowledgments**

Special thanks to:

- **Google Gemini AI** - For providing powerful AI capabilities
- **MongoDB** - For flexible database solutions
- **React Team** - For the amazing frontend framework
- **Node.js Community** - For the robust backend ecosystem
- **Open Source Contributors** - For various libraries and tools used
- **Academic Community** - For feedback and feature suggestions

---

## 📊 **Statistics**

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/your-username/mcp-research-assistant?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/mcp-research-assistant?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/mcp-research-assistant)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/mcp-research-assistant)

**Built with ❤️ for the academic community**

</div>

---

<div align="center">

### 🌟 **Star this repo if you find it helpful!**

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/mcp-research-assistant&type=Date)](https://star-history.com/#your-username/mcp-research-assistant&Date)

**[⬆ Back to Top](#-researchmind---ai-powered-academic-research-assistant)**

</div>
