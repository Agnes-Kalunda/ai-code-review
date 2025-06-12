import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  ArrowLeft,
  Zap,
  RefreshCw,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  Target,
  Code,
  FileText,
  Calendar,
  User,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { reviewUtils, createPollingService } from '../services/api';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const ReviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentReview, 
    currentReviewLoading, 
    fetchReview, 
    analyzeReview,
    deleteReview,
    updateReview
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showCode, setShowCode] = useState(true);
  const [feedback, setFeedback] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (id) {
      fetchReview(id);
    }
  }, [id]);

  // Set up polling for analyzing reviews
  useEffect(() => {
    if (!currentReview || currentReview.status !== 'analyzing') return;

    const cleanup = createPollingService(
      currentReview.id,
      (updatedReview) => {
        updateReview(updatedReview);
        
        if (updatedReview.status === 'completed') {
          toast.success('Analysis completed!');
        } else if (updatedReview.status === 'failed') {
          toast.error('Analysis failed. Please try again.');
        }
      }
    );

    return cleanup;
  }, [currentReview?.status]);

  // Extract feedback and metrics from review data
  useEffect(() => {
    if (currentReview?.feedback_items) {
      setFeedback(currentReview.feedback_items);
    }
    if (currentReview?.metrics) {
      setMetrics(currentReview.metrics);
    }
  }, [currentReview]);

  const handleAnalyze = async () => {
    try {
      await analyzeReview(id);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(id);
        navigate('/reviews');
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const getCodeContent = () => {
    if (currentReview?.submission_type === 'file') {
    
      return currentReview.analysis_summary || '// File content not available for display';
    }
    return currentReview?.code_content || '';
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'major':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'minor':
        return <Info className="h-5 w-5 text-yellow-600" />;
      case 'suggestion':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'performance':
        return <Target className="h-4 w-4" />;
      case 'bug':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  // Group feedback by severity
  const groupedFeedback = feedback.reduce((acc, item) => {
    const severity = item.severity || 'minor';
    if (!acc[severity]) acc[severity] = [];
    acc[severity].push(item);
    return acc;
  }, {});

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'feedback', label: 'Feedback', icon: FileText, count: feedback.length },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'metrics', label: 'Metrics', icon: Target },
  ];

  if (currentReviewLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading review...</p>
        </div>
      </div>
    );
  }

  if (!currentReview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Review not found</h2>
          <p className="text-gray-600 mb-6">The review you're looking for doesn't exist.</p>
          <Link to="/reviews" className="btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reviews
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/reviews"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reviews
            </Link>
            
            <div className="flex items-center space-x-3">
              {(currentReview.status === 'pending' || currentReview.status === 'failed') && (
                <button
                  onClick={handleAnalyze}
                  className="btn-primary"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze
                </button>
              )}
              
              <button
                onClick={handleDelete}
                className="btn-danger"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>

          {/* Review Header Info */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  {currentReview.submission_type === 'file' ? (
                    <FileText className="h-6 w-6 text-gray-400" />
                  ) : (
                    <Code className="h-6 w-6 text-gray-400" />
                  )}
                  <h1 className="text-2xl font-bold text-gray-900">
                    {currentReview.original_filename || 'Text Submission'}
                  </h1>
                  <span className={`badge ${reviewUtils.getStatusColor(currentReview.status)}`}>
                    {currentReview.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{reviewUtils.formatDate(currentReview.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4" />
                    <span>{currentReview.language}</span>
                  </div>
                  {currentReview.lines_of_code && (
                    <div>
                      <span>{currentReview.lines_of_code} lines</span>
                    </div>
                  )}
                  {currentReview.file_size && (
                    <div>
                      <span>{reviewUtils.formatFileSize(currentReview.file_size)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status indicator */}
              <div className="text-right">
                {currentReview.status === 'analyzing' && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Analyzing...</span>
                  </div>
                )}
                {currentReview.status === 'completed' && currentReview.analysis_completed_at && (
                  <div className="text-sm text-gray-500">
                    Completed: {reviewUtils.formatDate(currentReview.analysis_completed_at)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="card p-1 mb-6"
        >
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Summary */}
              <div className="lg:col-span-2 space-y-6">
                {currentReview.analysis_summary && (
                  <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Analysis Summary
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {currentReview.analysis_summary}
                    </p>
                  </div>
                )}

                {/* Recent Feedback Preview */}
                {feedback.length > 0 && (
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Key Issues
                      </h2>
                      <button
                        onClick={() => setActiveTab('feedback')}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View All →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {feedback.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          {getSeverityIcon(item.severity)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {item.title}
                              </span>
                              <span className={`badge ${reviewUtils.getSeverityColor(item.severity)}`}>
                                {item.severity}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Metrics Sidebar */}
              <div className="space-y-6">
                {metrics && (
                  <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Quality Metrics
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Complexity</span>
                          <span>{metrics.complexity_score?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${(metrics.complexity_score || 0) * 10}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Security</span>
                          <span>{metrics.security_score?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(metrics.security_score || 0) * 10}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Performance</span>
                          <span>{metrics.performance_score?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(metrics.performance_score || 0) * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Issue Summary */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Issue Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Critical</span>
                      </span>
                      <span className="font-medium">
                        {metrics?.critical_issues || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Major</span>
                      </span>
                      <span className="font-medium">
                        {metrics?.major_issues || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-2">
                        <Info className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Minor</span>
                      </span>
                      <span className="font-medium">
                        {metrics?.minor_issues || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Suggestions</span>
                      </span>
                      <span className="font-medium">
                        {metrics?.suggestions || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6">
              {Object.entries(groupedFeedback).map(([severity, items]) => (
                <div key={severity} className="card p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    {getSeverityIcon(severity)}
                    <h2 className="text-lg font-semibold text-gray-900 capitalize">
                      {severity} Issues ({items.length})
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={index} className="border-l-4 border-gray-200 pl-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(item.category)}
                            <span className="font-medium text-gray-900">
                              {item.title}
                            </span>
                            <span className="badge bg-gray-100 text-gray-700">
                              {item.category}
                            </span>
                          </div>
                          {item.line_number && (
                            <span className="text-sm text-gray-500">
                              Line {item.line_number}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">
                          {item.description}
                        </p>
                        {item.suggestion && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <p className="text-sm text-blue-800">
                              <strong>Suggestion:</strong> {item.suggestion}
                            </p>
                          </div>
                        )}
                        {item.code_snippet && (
                          <div className="mt-2">
                            <SyntaxHighlighter
                              language={currentReview.language}
                              style={vscDarkPlus}
                              customStyle={{
                                fontSize: '12px',
                                borderRadius: '6px',
                              }}
                            >
                              {item.code_snippet}
                            </SyntaxHighlighter>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {feedback.length === 0 && (
                <div className="card p-12 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No issues found
                  </h3>
                  <p className="text-gray-600">
                    Great! Your code looks good with no major issues detected.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Code Content
                </h2>
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="btn-secondary btn-sm"
                >
                  {showCode ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Hide Code
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Show Code
                    </>
                  )}
                </button>
              </div>
              
              {showCode && (
                <div className="relative">
                  <SyntaxHighlighter
                    language={currentReview.language}
                    style={vscDarkPlus}
                    showLineNumbers
                    customStyle={{
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                  >
                    {getCodeContent()}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {metrics ? (
                <>
                  <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Quality Scores
                    </h2>
                    <div className="space-y-4">
                      {[
                        { label: 'Complexity Score', value: metrics.complexity_score, color: 'primary' },
                        { label: 'Maintainability', value: metrics.maintainability_score, color: 'green' },
                        { label: 'Security Score', value: metrics.security_score, color: 'red' },
                        { label: 'Performance Score', value: metrics.performance_score, color: 'blue' },
                      ].map((metric) => (
                        <div key={metric.label}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">{metric.label}</span>
                            <span className="text-gray-600">
                              {metric.value?.toFixed(1) || 'N/A'}/10
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`bg-${metric.color}-600 h-3 rounded-full transition-all duration-500`}
                              style={{ width: `${(metric.value || 0) * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Issue Breakdown
                    </h2>
                    <div className="space-y-4">
                      {[
                        { label: 'Critical Issues', value: metrics.critical_issues, color: 'red' },
                        { label: 'Major Issues', value: metrics.major_issues, color: 'orange' },
                        { label: 'Minor Issues', value: metrics.minor_issues, color: 'yellow' },
                        { label: 'Suggestions', value: metrics.suggestions, color: 'blue' },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className={`badge badge-${item.color}`}>
                            {item.value || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="lg:col-span-2 card p-12 text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No metrics available
                  </h3>
                  <p className="text-gray-600">
                    Metrics will be available after the analysis is completed.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;