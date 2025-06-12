import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Zap,
  RefreshCw,
  Calendar,
  Code,
  Upload,
  CheckSquare,
  Square
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { reviewUtils } from '../services/api';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const ReviewsPage = () => {
  const { 
    reviews, 
    reviewsLoading, 
    fetchReviews, 
    deleteReview, 
    analyzeReview,
    bulkAnalyze 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [showUserOnly, setShowUserOnly] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    const params = {};
    if (showUserOnly) params.user_only = 'true';
    if (statusFilter !== 'all') params.status = statusFilter;
    if (languageFilter !== 'all') params.language = languageFilter;
    
    fetchReviews(params);
  }, [showUserOnly, statusFilter, languageFilter]);

  // Filter reviews based on search term
  const filteredReviews = reviews.filter(review => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (review.original_filename && review.original_filename.toLowerCase().includes(searchLower)) ||
      review.language.toLowerCase().includes(searchLower) ||
      review.id.toLowerCase().includes(searchLower)
    );
  });

  // Handle individual review selection
  const toggleReviewSelection = (reviewId) => {
    const newSelected = new Set(selectedReviews);
    if (newSelected.has(reviewId)) {
      newSelected.delete(reviewId);
    } else {
      newSelected.add(reviewId);
    }
    setSelectedReviews(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  // Select all reviews
  const toggleSelectAll = () => {
    if (selectedReviews.size === filteredReviews.length) {
      setSelectedReviews(new Set());
      setShowBulkActions(false);
    } else {
      const allIds = new Set(filteredReviews.map(r => r.id));
      setSelectedReviews(allIds);
      setShowBulkActions(true);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedReviews(new Set());
    setShowBulkActions(false);
  };

  // Handle bulk analysis
  const handleBulkAnalyze = async () => {
    const reviewIds = Array.from(selectedReviews);
    const pendingReviews = reviews.filter(r => 
      reviewIds.includes(r.id) && (r.status === 'pending' || r.status === 'failed')
    );
    
    if (pendingReviews.length === 0) {
      toast.error('No reviews available for analysis');
      return;
    }

    try {
      await bulkAnalyze(pendingReviews.map(r => r.id));
      clearSelection();
    } catch (error) {
      console.error('Bulk analysis failed:', error);
    }
  };

  // Handle individual delete
  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  // Handle individual analyze
  const handleAnalyze = async (reviewId) => {
    try {
      await analyzeReview(reviewId);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  // Get unique languages for filter
  const availableLanguages = [...new Set(reviews.map(r => r.language))];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Code Reviews</h1>
              <p className="text-gray-600 mt-2">
                View and manage your code analysis results
              </p>
            </div>
            <Link
              to="/analyze"
              className="btn-primary"
            >
              <Upload className="h-4 w-4 mr-2" />
              New Analysis
            </Link>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="card p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="analyzing">Analyzing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            {/* Language Filter */}
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Languages</option>
              {availableLanguages.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>

            {/* User Only Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUserOnly}
                onChange={(e) => setShowUserOnly(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">My Reviews Only</span>
            </label>
          </div>
        </motion.div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-primary-900">
                  {selectedReviews.size} reviews selected
                </span>
                <button
                  onClick={handleBulkAnalyze}
                  className="btn-primary btn-sm"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Bulk Analyze
                </button>
              </div>
              <button
                onClick={clearSelection}
                className="text-primary-600 hover:text-primary-800 text-sm"
              >
                Clear Selection
              </button>
            </div>
          </motion.div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviewsLoading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : filteredReviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reviews found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' || languageFilter !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'Start by analyzing your first piece of code.'}
              </p>
              <Link to="/analyze" className="btn-primary">
                <Upload className="h-4 w-4 mr-2" />
                Analyze Code
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Select All Header */}
              <div className="card p-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {selectedReviews.size === filteredReviews.length ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    <span>Select All ({filteredReviews.length})</span>
                  </button>
                </div>
              </div>

              {/* Reviews */}
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={clsx(
                    'card p-6 hover:shadow-md transition-shadow',
                    selectedReviews.has(review.id) && 'ring-2 ring-primary-500 bg-primary-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Selection Checkbox */}
                      <button
                        onClick={() => toggleReviewSelection(review.id)}
                        className="flex-shrink-0"
                      >
                        {selectedReviews.has(review.id) ? (
                          <CheckSquare className="h-5 w-5 text-primary-600" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>

                      {/* Review Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {review.submission_type === 'file' ? (
                              <FileText className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Code className="h-5 w-5 text-gray-400" />
                            )}
                            <h3 className="font-medium text-gray-900 truncate">
                              {review.original_filename || `Text Submission`}
                            </h3>
                          </div>
                          
                          <span className={`badge ${reviewUtils.getStatusColor(review.status)}`}>
                            {review.status}
                          </span>
                          
                          <span className="badge bg-gray-100 text-gray-800">
                            {review.language}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{reviewUtils.formatDate(review.created_at)}</span>
                          </div>
                          {review.lines_of_code && (
                            <span>{review.lines_of_code} lines</span>
                          )}
                          {review.file_size && (
                            <span>{reviewUtils.formatFileSize(review.file_size)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/reviews/${review.id}`}
                        className="btn-secondary btn-sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                      
                      {(review.status === 'pending' || review.status === 'failed') && (
                        <button
                          onClick={() => handleAnalyze(review.id)}
                          className="btn-primary btn-sm"
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Analyze
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="btn-danger btn-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;