
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  
  async sendMessage(message, sessionId = null) {
    const data = {
      message: message.trim()
    };
    
    if (sessionId) {
      data.session_id = sessionId;
    }

    return this.request('/api/chat/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  
  async getChatSessions() {
    return this.request('/api/sessions/');
  }

  async getChatSession(id) {
    return this.request(`/api/sessions/${id}/`);
  }

  async createChatSession() {
    return this.request('/api/sessions/', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  async deleteChatSession(id) {
    return this.request(`/api/sessions/${id}/`, {
      method: 'DELETE',
    });
  }

  
  async getSession() {
    return this.request('/api/session/');
  }

  async clearSession() {
    return this.request('/api/session/', {
      method: 'DELETE',
    });
  }

  async getStats() {
    return this.request('/api/stats/');
  }

  
  async healthCheck() {
    return this.request('/api/health/');
  }
}


export const reviewUtils = {
  formatTimestamp: (timestamp) => {
    return new Date(timestamp).toLocaleString();
  },

  formatMessageTime: (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { 
      return 'Just now';
    } else if (diff < 3600000) { 
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) { 
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  },

  
  containsCode: (message) => {
    const codePatterns = [
      /```[\s\S]*?```/g, 
      /`[^`]+`/g, 
      /\b(function|const|let|var|if|else|for|while|class|def|import|export)\b/g, 
    ];
    
    return codePatterns.some(pattern => pattern.test(message));
  },

  
  extractCodeBlocks: (message) => {
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    const blocks = [];
    let match;
    
    while ((match = codeBlockRegex.exec(message)) !== null) {
      blocks.push({
        language: match[1] || 'text',
        code: match[2].trim()
      });
    }
    
    return blocks;
  }
};


const apiService = new ApiService();
export default apiService;