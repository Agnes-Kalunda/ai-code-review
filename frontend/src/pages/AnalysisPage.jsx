
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  User,
  Bot,
  Loader2,
  Plus,
  Copy
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AnalysisPage = () => {
  const { sendMessage, getChatSession, currentChatSession } = useApp();
  const [searchParams] = useSearchParams();
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const urlSessionId = searchParams.get('session');
    if (urlSessionId) {
      loadExistingSession(urlSessionId);
    }
  }, [searchParams]);

  const loadExistingSession = async (id) => {
    try {
      const sessionData = await getChatSession(id);
      setSessionId(id);
      setMessages(sessionData.messages || []);
    } catch (error) {
      console.error('Failed to load session:', error);
      toast.error('Failed to load chat session');
    }
  };

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

  const handleSend = async () => {
    if (!inputValue.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsAnalyzing(true);

    
    const tempUserMessage = {
      id: Date.now(),
      message_type: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
  
      const response = await sendMessage(userMessage, sessionId);
      
   
      if (!sessionId && response.session_id) {
        setSessionId(response.session_id);
      }

 
      setMessages(prev => [
        ...prev.slice(0, -1), 
        response.user_message,
        response.assistant_message
      ]);

    } catch (error) {
      
      setMessages(prev => prev.slice(0, -1));
      toast.error('Failed to send message');
    } finally {
      setIsAnalyzing(false);
    }
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
    setSessionId(null);
    toast.success('New conversation started');
  };

  const Message = ({ message }) => {
    const isUser = message.message_type === 'user';
    
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
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
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
                  Ask me anything about coding! I can help with debugging, best practices, algorithms, and more.
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
                        <span className="text-xs text-slate-500 font-medium">Thinking...</span>
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
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about coding..."
                className="w-full px-4 py-3 pr-20 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                rows={1}
                disabled={isAnalyzing}
              />
              
              <div className="absolute right-3 bottom-3 flex items-center space-x-1">
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
            </div>

            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isAnalyzing}
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