
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatSession, setCurrentChatSession] = useState(null);

 
  useEffect(() => {
    initializeSession();
    fetchStats();
  }, []);

  const initializeSession = async () => {
    try {
      const sessionData = await apiService.getSession();
      setSession(sessionData);
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const statsData = await apiService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };
  const sendMessage = async (message, sessionId = null) => {
    try {
      setIsLoading(true);
      const response = await apiService.sendMessage(message, sessionId);
      
      
      if (session) {
        setSession(prev => ({
          ...prev,
          total_messages: (prev.total_messages || 0) + 2, // user + assistant
        }));
      }


      if (response.session_id) {
        await refreshCurrentChatSession(response.session_id);
      }

      
      await fetchStats();
      
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error(error.message || 'Failed to send message');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getChatSessions = async () => {
    try {
      setIsLoading(true);
      return await apiService.getChatSessions();
    } catch (error) {
      console.error('Failed to fetch chat sessions:', error);
      toast.error('Failed to load chat sessions');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getChatSession = async (id) => {
    try {
      setIsLoading(true);
      const sessionData = await apiService.getChatSession(id);
      setCurrentChatSession(sessionData);
      return sessionData;
    } catch (error) {
      console.error('Failed to fetch chat session:', error);
      toast.error('Failed to load chat session');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCurrentChatSession = async (sessionId) => {
    if (currentChatSession?.id === sessionId) {
      try {
        const updated = await apiService.getChatSession(sessionId);
        setCurrentChatSession(updated);
      } catch (error) {
        console.error('Failed to refresh chat session:', error);
      }
    }
  };

  const createChatSession = async () => {
    try {
      const newSession = await apiService.createChatSession();
      setCurrentChatSession(newSession);
      
    
      if (session) {
        setSession(prev => ({
          ...prev,
          chat_sessions_count: (prev.chat_sessions_count || 0) + 1,
        }));
      }

      toast.success('New chat session created!');
      return newSession;
    } catch (error) {
      console.error('Failed to create chat session:', error);
      toast.error('Failed to create chat session');
      throw error;
    }
  };

  const deleteChatSession = async (id) => {
    try {
      await apiService.deleteChatSession(id);
      
      
      if (session) {
        setSession(prev => ({
          ...prev,
          chat_sessions_count: Math.max((prev.chat_sessions_count || 1) - 1, 0),
        }));
      }

   
      if (currentChatSession?.id === id) {
        setCurrentChatSession(null);
      }

  
      await fetchStats();
      
      toast.success('Chat session deleted successfully!');
    } catch (error) {
      console.error('Failed to delete chat session:', error);
      toast.error('Failed to delete chat session');
      throw error;
    }
  };

  const clearSession = async () => {
    try {
      await apiService.clearSession();
      setSession(null);
      setStats(null);
      setCurrentChatSession(null);
      toast.success('Session cleared successfully!');
      
      
      await initializeSession();
    } catch (error) {
      console.error('Failed to clear session:', error);
      toast.error('Failed to clear session');
      throw error;
    }
  };


  const createReview = async (data) => {
    
    if (data.submission_type === 'text' && data.code_content) {
      return await sendMessage(data.code_content);
    }
    throw new Error('File uploads not supported in chat mode');
  };

  const getReview = async (id) => {

    return await getChatSession(id);
  };

  const getReviews = async () => {
  
    return await getChatSessions();
  };

  const value = {
    
    session,
    stats,
    isLoading,
    currentChatSession,

   
    sendMessage,
    getChatSessions,
    getChatSession,
    createChatSession,
    deleteChatSession,
    refreshCurrentChatSession,

    
    fetchStats,
    clearSession,
    initializeSession,

    
    createReview,
    getReview,
    getReviews,
    analyzeReview: () => Promise.resolve(), 

    
    apiService,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};