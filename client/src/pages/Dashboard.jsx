// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  MessageCircle, 
  FileText, 
  BarChart3, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import FileUpload from '../components/Upload/FileUpload';
import ChatWindow from '../components/Chat/ChatWindow';
import UsageCard from '../components/Dashboard/UsageCard';
import QuickStats from '../components/Dashboard/QuickStats';

const Dashboard = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [docsResponse, chatsResponse, usageResponse] = await Promise.all([
        api.getDocuments(),
        api.getChatHistory(),
        api.getUsage()
      ]);

      setDocuments(docsResponse.data.data || []);
      setRecentChats(chatsResponse.data.data || []);
      setUsage(usageResponse.data.data);
      
    } catch (error) {
      console.error('Dashboard load error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await api.uploadFile(formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        toast.loading(`Uploading... ${progress}%`, { id: 'upload' });
      });

      toast.dismiss('upload');
      toast.success('File uploaded successfully!');
      
      // Refresh documents list
      loadDashboardData();
      
    } catch (error) {
      toast.dismiss('upload');
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await api.deleteDocument(docId);
      toast.success('Document deleted successfully');
      setDocuments(documents.filter(doc => doc._id !== docId));
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleAnalyzeDocument = async (docId) => {
    try {
      toast.loading('Analyzing document...', { id: 'analyze' });
      await api.analyzeDocument(docId, 'general');
      toast.dismiss('analyze');
      toast.success('Analysis completed!');
      loadDashboardData();
    } catch (error) {
      toast.dismiss('analyze');
      toast.error('Analysis failed');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'chat', label: 'Research Chat', icon: MessageCircle },
    { id: 'upload', label: 'Upload', icon: Upload }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your research documents and get AI-powered assistance.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Usage Stats */}
            {usage && <UsageCard usage={usage} />}
            
            {/* Quick Stats */}
            <QuickStats 
              documents={documents}
              chats={recentChats}
              usage={usage}
            />

            {/* Recent Documents */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Documents</h3>
              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.slice(0, 5).map((doc) => (
                    <div key={doc._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-sm text-gray-500">
                            {doc.wordCount} words • {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No documents uploaded yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">My Documents</h3>
              <p className="text-gray-600">Manage your uploaded research documents</p>
            </div>
            
            <div className="p-6">
              {documents.length > 0 ? (
                <div className="grid gap-4">
                  {documents.map((doc) => (
                    <div key={doc._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{doc.title}</h4>
                          <div className="text-sm text-gray-500 mt-1">
                            <span>{doc.fileType.toUpperCase()}</span> • 
                            <span> {doc.wordCount} words</span> • 
                            <span> {new Date(doc.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {doc.analysis?.overallScore && (
                            <div className="mt-2 flex items-center">
                              <span className="text-sm text-gray-500 mr-2">Overall Score:</span>
                              <div className={`px-2 py-1 rounded text-sm font-medium ${
                                doc.analysis.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                                doc.analysis.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {doc.analysis.overallScore}/100
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedDocument(doc)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleAnalyzeDocument(doc._id)}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="Analyze document"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteDocument(doc._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                  <p className="text-gray-500 mb-4">Upload your first research document to get started.</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Upload Document
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow h-96">
            <ChatWindow 
              selectedDocument={selectedDocument}
              onDocumentSelect={setSelectedDocument}
            />
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-4">Upload Research Document</h3>
              <FileUpload 
                onFileUpload={handleFileUpload}
                maxSize={usage?.limits?.maxFileSize || 5242880}
                usage={usage?.current}
                limits={usage?.limits}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <DocumentDetailModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

// Document Detail Modal Component
const DocumentDetailModal = ({ document, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{document.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Document Info</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Type:</span> {document.fileType.toUpperCase()}</p>
                    <p><span className="font-medium">Words:</span> {document.wordCount}</p>
                    <p><span className="font-medium">Pages:</span> {document.pageCount || 'N/A'}</p>
                    <p><span className="font-medium">Uploaded:</span> {new Date(document.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {document.analysis && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Analysis Scores</h3>
                    <div className="space-y-2">
                      {document.analysis.grammarScore && (
                        <div className="flex justify-between">
                          <span className="text-sm">Grammar:</span>
                          <span className="text-sm font-medium">{document.analysis.grammarScore}/100</span>
                        </div>
                      )}
                      {document.analysis.clarityScore && (
                        <div className="flex justify-between">
                          <span className="text-sm">Clarity:</span>
                          <span className="text-sm font-medium">{document.analysis.clarityScore}/100</span>
                        </div>
                      )}
                      {document.analysis.originalityScore && (
                        <div className="flex justify-between">
                          <span className="text-sm">Originality:</span>
                          <span className="text-sm font-medium">{document.analysis.originalityScore}/100</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Document Preview</h3>
                <div className="max-h-96 overflow-y-auto text-sm text-gray-700 leading-relaxed">
                  {document.extractedText ? (
                    <p className="whitespace-pre-wrap">{document.extractedText.substring(0, 2000)}...</p>
                  ) : (
                    <p className="text-gray-500">No text extracted from this document.</p>
                  )}
                </div>
              </div>
              
              {document.analysis?.suggestions && document.analysis.suggestions.length > 0 && (
                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">AI Suggestions</h3>
                  <ul className="space-y-1 text-sm">
                    {document.analysis.suggestions.slice(0, 5).map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;