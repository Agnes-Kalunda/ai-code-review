import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';
import toast from 'react-hot-toast';


const initialState = {
  // Session data
  session: null,
  sessionLoading: false,
  
  
  reviews: [],
  reviewsLoading: false,
  currentReview: null,
  currentReviewLoading: false,
  
  
  stats: null,
  statsLoading: false,

  isAnalyzing: false,
  error: null,
};


const actionTypes = {
  
  SET_SESSION_LOADING: 'SET_SESSION_LOADING',
  SET_SESSION: 'SET_SESSION',
  CLEAR_SESSION: 'CLEAR_SESSION',
  

  SET_REVIEWS_LOADING: 'SET_REVIEWS_LOADING',
  SET_REVIEWS: 'SET_REVIEWS',
  ADD_REVIEW: 'ADD_REVIEW',
  UPDATE_REVIEW: 'UPDATE_REVIEW',
  DELETE_REVIEW: 'DELETE_REVIEW',
  

  SET_CURRENT_REVIEW_LOADING: 'SET_CURRENT_REVIEW_LOADING',
  SET_CURRENT_REVIEW: 'SET_CURRENT_REVIEW',
  CLEAR_CURRENT_REVIEW: 'CLEAR_CURRENT_REVIEW',
  
  
  SET_STATS_LOADING: 'SET_STATS_LOADING',
  SET_STATS: 'SET_STATS',
  
  
  SET_ANALYZING: 'SET_ANALYZING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};


function appReducer(state, action) {
  switch (action.type) {
    // Session reducers
    case actionTypes.SET_SESSION_LOADING:
      return { ...state, sessionLoading: action.payload };
    
    case actionTypes.SET_SESSION:
      return { ...state, session: action.payload, sessionLoading: false };
    
    case actionTypes.CLEAR_SESSION:
      return { ...state, session: null };
    
    
    case actionTypes.SET_REVIEWS_LOADING:
      return { ...state, reviewsLoading: action.payload };
    
    case actionTypes.SET_REVIEWS:
      return { ...state, reviews: action.payload, reviewsLoading: false };
    
    case actionTypes.ADD_REVIEW:
      return { 
        ...state, 
        reviews: [action.payload, ...state.reviews] 
      };
    
    case actionTypes.UPDATE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review.id === action.payload.id ? action.payload : review
        ),
        currentReview: state.currentReview?.id === action.payload.id 
          ? action.payload 
          : state.currentReview
      };
    
    case actionTypes.DELETE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.filter(review => review.id !== action.payload),
        currentReview: state.currentReview?.id === action.payload 
          ? null 
          : state.currentReview
      };
    

    case actionTypes.SET_CURRENT_REVIEW_LOADING:
      return { ...state, currentReviewLoading: action.payload };
    
    case actionTypes.SET_CURRENT_REVIEW:
      return { 
        ...state, 
        currentReview: action.payload, 
        currentReviewLoading: false 
      };
    
    case actionTypes.CLEAR_CURRENT_REVIEW:
      return { ...state, currentReview: null };
    
    
    case actionTypes.SET_STATS_LOADING:
      return { ...state, statsLoading: action.payload };
    
    case actionTypes.SET_STATS:
      return { ...state, stats: action.payload, statsLoading: false };
    
    
    case actionTypes.SET_ANALYZING:
      return { ...state, isAnalyzing: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
}

const AppContext = createContext();


export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  

  const actions = {
    
    async fetchSession() {
      dispatch({ type: actionTypes.SET_SESSION_LOADING, payload: true });
      try {
        const response = await apiService.getSession();
        dispatch({ type: actionTypes.SET_SESSION, payload: response.data });
      } catch (error) {
        console.error('Failed to fetch session:', error);
        dispatch({ type: actionTypes.SET_SESSION_LOADING, payload: false });
      }
    },
    
    async clearSession() {
      try {
        await apiService.clearSession();
        dispatch({ type: actionTypes.CLEAR_SESSION });
        toast.success('Session cleared successfully');
      } catch (error) {
        console.error('Failed to clear session:', error);
      }
    },
    
    
    async fetchReviews(params = {}) {
      dispatch({ type: actionTypes.SET_REVIEWS_LOADING, payload: true });
      try {
        const response = await apiService.getReviews(params);
        dispatch({ type: actionTypes.SET_REVIEWS, payload: response.data.results || response.data });
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        dispatch({ type: actionTypes.SET_REVIEWS_LOADING, payload: false });
      }
    },
    
    async createReview(reviewData) {
      try {
        const response = await apiService.createReview(reviewData);
        dispatch({ type: actionTypes.ADD_REVIEW, payload: response.data });
        
  
        if (state.session) {
          const updatedSession = {
            ...state.session,
            user_reviews: [...(state.session.user_reviews || []), response.data.id],
            created_reviews_count: (state.session.created_reviews_count || 0) + 1
          };
          dispatch({ type: actionTypes.SET_SESSION, payload: updatedSession });
        }
        
        toast.success('Code review created successfully!');
        return response.data;
      } catch (error) {
        console.error('Failed to create review:', error);
        throw error;
      }
    },
    
    async fetchReview(id) {
      dispatch({ type: actionTypes.SET_CURRENT_REVIEW_LOADING, payload: true });
      try {
        const response = await apiService.getReview(id);
        dispatch({ type: actionTypes.SET_CURRENT_REVIEW, payload: response.data });
        return response.data;
      } catch (error) {
        console.error('Failed to fetch review:', error);
        dispatch({ type: actionTypes.SET_CURRENT_REVIEW_LOADING, payload: false });
        throw error;
      }
    },
    
    async deleteReview(id) {
      try {
        await apiService.deleteReview(id);
        dispatch({ type: actionTypes.DELETE_REVIEW, payload: id });
        toast.success('Review deleted successfully');
      } catch (error) {
        console.error('Failed to delete review:', error);
        throw error;
      }
    },
    
  
    async analyzeReview(id) {
      dispatch({ type: actionTypes.SET_ANALYZING, payload: true });
      try {
        await apiService.analyzeReview(id);
        
      
        const updatedReview = { ...state.currentReview, status: 'analyzing' };
        dispatch({ type: actionTypes.UPDATE_REVIEW, payload: updatedReview });
        
        toast.success('Analysis started! This may take a few moments...');
      } catch (error) {
        console.error('Failed to start analysis:', error);
        dispatch({ type: actionTypes.SET_ANALYZING, payload: false });
        throw error;
      } finally {
        dispatch({ type: actionTypes.SET_ANALYZING, payload: false });
      }
    },
    
    async bulkAnalyze(reviewIds) {
      dispatch({ type: actionTypes.SET_ANALYZING, payload: true });
      try {
        const response = await apiService.bulkAnalyze(reviewIds);
        toast.success(`Analysis started for ${response.data.triggered_reviews} reviews`);
        
    
        await actions.fetchReviews();
      } catch (error) {
        console.error('Failed to start bulk analysis:', error);
        throw error;
      } finally {
        dispatch({ type: actionTypes.SET_ANALYZING, payload: false });
      }
    },
    
    
    async fetchStats() {
      dispatch({ type: actionTypes.SET_STATS_LOADING, payload: true });
      try {
        const response = await apiService.getStats();
        dispatch({ type: actionTypes.SET_STATS, payload: response.data });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        dispatch({ type: actionTypes.SET_STATS_LOADING, payload: false });
      }
    },
    
    updateReview(review) {
      dispatch({ type: actionTypes.UPDATE_REVIEW, payload: review });
    },
    
    setError(error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error });
    },
    
    clearError() {
      dispatch({ type: actionTypes.CLEAR_ERROR });
    },
  };
  
  
  useEffect(() => {
    actions.fetchSession();
  }, []);
  
  
  const value = {
    ...state,
    ...actions,
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}


export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;