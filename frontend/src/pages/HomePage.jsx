import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Zap, 
  Shield, 
  Target, 
  FileText, 
  BarChart3,
  Upload,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const HomePage = () => {
  const { stats, fetchStats, session } = useApp();

  useEffect(() => {
    fetchStats();
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Analysis',
      description: 'Get intelligent code reviews using advanced AI models that understand code patterns and best practices.',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      icon: Shield,
      title: 'Security Scanning',
      description: 'Detect potential security vulnerabilities and unsafe coding patterns before they become problems.',
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      icon: Target,
      title: 'Performance Optimization',
      description: 'Identify performance bottlenecks and get suggestions for more efficient code implementations.',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: FileText,
      title: 'Detailed Reports',
      description: 'Comprehensive analysis reports with line-by-line feedback and actionable improvement suggestions.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Code',
      description: 'Upload your code files or paste code directly into the analyzer.',
      icon: Upload,
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our AI analyzes your code for quality, security, and performance issues.',
      icon: Zap,
    },
    {
      number: '03',
      title: 'Get Results',
      description: 'Receive detailed feedback with suggestions for improvement.',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <Code2 className="h-16 w-16 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              AI Code Review
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Get instant, intelligent feedback on your code quality, security, and performance 
              with our AI-powered analysis tool.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analyze"
                className="btn-primary btn-lg hover-scale"
              >
                <Zap className="h-5 w-5 mr-2" />
                Analyze Code Now
              </Link>
              
              <Link
                to="/reviews"
                className="btn-secondary btn-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <FileText className="h-5 w-5 mr-2" />
                View Reviews
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Floating code snippets background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 opacity-10 text-white font-code text-sm rotate-12">
            def analyze_code():
          </div>
          <div className="absolute top-40 right-20 opacity-10 text-white font-code text-sm -rotate-6">
            if security_issue:
          </div>
          <div className="absolute bottom-32 left-1/4 opacity-10 text-white font-code text-sm rotate-3">
            return feedback
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{stats.total_reviews}</div>
                <div className="text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.completed_reviews}</div>
                <div className="text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.analyzing_reviews}</div>
                <div className="text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{stats.recent_activity?.reviews_last_30_days || 0}</div>
                <div className="text-gray-600">This Month</div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Code Analysis Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides comprehensive code analysis to help you write better, 
              more secure, and more efficient code.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  className="card p-6 hover-lift cursor-pointer"
                >
                  <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started with AI code review in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 + index * 0.2 }}
                  className="text-center"
                >
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">{step.number}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to improve your code quality?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start analyzing your code with AI-powered insights today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analyze"
                className="btn-primary bg-white text-primary-600 hover:bg-gray-50 btn-lg"
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Free Analysis
              </Link>
              
              <Link
                to="/stats"
                className="btn-secondary border-white/20 text-white hover:bg-white/10 btn-lg"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View Statistics
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Session info */}
      {session && (
        <div className="bg-blue-50 border-t border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center space-x-4 text-sm text-blue-700">
              <Info className="h-4 w-4" />
              <span>
                Session active: {session.created_reviews_count || 0} reviews created
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;