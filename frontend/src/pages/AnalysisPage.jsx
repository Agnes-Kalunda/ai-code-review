import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Paperclip,
  User,
  Bot,
  FileText,
  Loader2,
  Plus,
  Upload,
  Copy
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { reviewUtils } from '../services/api';
import toast from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AnalysisPage = () => {
  const { createReview } = useApp();
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const validation = reviewUtils.validateFile(file);
      
      if (validation) {
        toast.error(validation);
        return;
      }

      setAttachedFile(file);
      toast.success(`File attached: ${file.name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cpp', '.c', '.php', '.go', '.rs', '.rb'],
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    noClick: true,
    noKeyboard: true,
  });

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onDrop([file]);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
    toast.success('File removed');
  };

  const addUserMessage = (content, file = null) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content,
      file,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    return userMessage;
  };

  const addAssistantMessage = (content, isStreaming = false) => {
    const assistantMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content,
      timestamp: new Date(),
      isStreaming,
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    return assistantMessage;
  };

  const handleSend = async () => {
    if (!inputValue.trim() && !attachedFile) {
      toast.error('Please enter a message or attach a file');
      return;
    }

    let userContent = inputValue.trim();
    let fileContent = null;

    if (attachedFile) {
      try {
        fileContent = await readFileContent(attachedFile);
        userContent = userContent || `Please analyze this file: ${attachedFile.name}`;
      } catch (error) {
        toast.error('Failed to read file content');
        return;
      }
    }

    addUserMessage(userContent, attachedFile);
    
    setInputValue('');
    setAttachedFile(null);
    setIsAnalyzing(true);

    const typingMessage = addAssistantMessage('Analyzing your code...', true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
      
      addAssistantMessage("I'm ready to help you analyze your code! However, I need to be connected to an AI service to provide detailed analysis. Please integrate with OpenAI API or your Django backend for real AI responses.");
      
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
      addAssistantMessage("I encountered an error. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const clearConversation = () => {
    setMessages([]);
    toast.success('New conversation started');
  };

  const Message = ({ message }) => {
    const isUser = message.type === 'user';
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-[90%] lg:max-w-[80%]`}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
            isUser 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 ml-2' 
              : 'bg-gradient-to-r from-slate-600 to-slate-700 mr-2'
          }`}>
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
          
          <div className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
              : 'bg-white text-slate-900 border border-slate-200'
          }`}>
            {message.file && (
              <div className={`mb-3 p-3 rounded-xl flex items-center space-x-3 ${
                isUser ? 'bg-white/15 border border-white/20' : 'bg-slate-50 border border-slate-200'
              }`}>
                <FileText className="w-4 h-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{message.file.name}</div>
                  <div className="text-xs opacity-75">
                    {reviewUtils.formatFileSize(message.file.size)}
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-sm leading-relaxed break-words">
              {formatMessageContent(message.content, isUser)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const formatMessageContent = (content, isUser) => {
    if (content.includes('```')) {
      return content.split('```').map((part, index) => {
        if (index % 2 === 0) {
          return (
            <span key={index} className="whitespace-pre-wrap break-words">
              {part}
            </span>
          );
        } else {
          const lines = part.split('\n');
          const language = lines[0] || 'text';
          const code = lines.slice(1).join('\n');
          
          return (
            <div key={index} className="my-3 relative group max-w-full">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => copyToClipboard(code)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-white shadow-sm"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <SyntaxHighlighter
                  language={language}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '16px',
                    maxWidth: '100%',
                  }}
                  wrapLines={true}
                  wrapLongLines={true}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            </div>
          );
        }
      });
    }
    return content;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50" {...getRootProps()}>
      {isDragActive && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 flex items-center justify-center z-50">
          <div className="text-center">
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="text-blue-700 font-medium">Drop your file here</p>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto min-h-full flex flex-col justify-end">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  AI Code Assistant
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Start a conversation to analyze your code. Upload files or paste code directly to get intelligent feedback.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Message message={message} />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isAnalyzing && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-sm">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">Analyzing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Container */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-white p-4">
        <div className="max-w-4xl mx-auto">
          {attachedFile && (
            <div className="mb-3 flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-blue-900 truncate">{attachedFile.name}</div>
                <div className="text-xs text-blue-600">
                  {reviewUtils.formatFileSize(attachedFile.size)}
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-blue-500 hover:text-blue-700 text-xl leading-none flex-shrink-0 w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message AI Code Assistant..."
                className="w-full px-4 py-3 pr-20 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                rows={1}
                disabled={isAnalyzing}
              />
              
              <div className="absolute right-3 bottom-3 flex items-center space-x-1">
                <button
                  onClick={handleFileAttach}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Attach file"
                  disabled={isAnalyzing}
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                
                {messages.length > 0 && (
                  <button
                    onClick={clearConversation}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="New chat"
                    disabled={isAnalyzing}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".py,.js,.jsx,.ts,.tsx,.java,.cpp,.c,.php,.go,.rs,.rb"
                className="hidden"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={(!inputValue.trim() && !attachedFile) || isAnalyzing}
              className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200 hover:shadow-md"
            >
              {isAnalyzing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;