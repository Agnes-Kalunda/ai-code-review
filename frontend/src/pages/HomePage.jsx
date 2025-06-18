import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Zap, 
  MessageCircle, 
  Brain, 
  FileText, 
  BarChart3,
  Users,
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
      icon: Brain,
      title: 'AI-Powered Assistance',
      description: 'Get intelligent coding help using advanced AI models that understand programming concepts and best practices.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      icon: MessageCircle,
      title: 'Interactive Chat',
      description: 'Have natural conversations about coding problems, debugging, and software development concepts.',
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
    {
      icon: Zap,
      title: 'Instant Solutions',
      description: 'Get immediate answers to coding questions with explanations and code examples.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      icon: FileText,
      title: 'Code Examples',
      description: 'Receive detailed code snippets and explanations for various programming challenges.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Ask Question',
      description: 'Type your coding question or describe the problem you are facing.',
      icon: MessageCircle,
    },
    {
      number: '02',
      title: 'AI Response',
      description: 'Our AI analyzes your question and provides detailed explanations and solutions.',
      icon: Brain,
    },
    {
      number: '03',
      title: 'Learn & Apply',
      description: 'Get practical code examples and guidance to implement the solution.',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white/10 rounded-full"></div>
          <div className="absolute bottom-32 left-1/3 w-16 h-16 border border-white/15 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 border border-white/10 rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                <Code2 className="relative h-16 w-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              AI Coding Assistant
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-200 mb-10 max-w-4xl mx-auto leading-relaxed">
              Get instant help with coding questions, debugging, and programming concepts 
              from your intelligent AI assistant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/analyze"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
              >
                <MessageCircle className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Start Coding Chat
              </Link>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 opacity-10 text-white font-mono text-sm rotate-12 select-none">
            def solve_problem():
          </div>
          <div className="absolute top-40 right-20 opacity-10 text-white font-mono text-sm -rotate-6 select-none">
            while learning:
          </div>
          <div className="absolute bottom-32 left-1/4 opacity-10 text-white font-mono text-sm rotate-3 select-none">
            return solution
          </div>
        </div>
      </div>

      {stats && (
        <div className="bg-slate-50 py-16 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {stats.total_reviews}
                </div>
                <div className="text-slate-600 font-medium">Total Chats</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {stats.completed_reviews}
                </div>
                <div className="text-slate-600 font-medium">Questions Answered</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {stats.analyzing_reviews}
                </div>
                <div className="text-slate-600 font-medium">Active Sessions</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {stats.recent_activity?.reviews_last_30_days || 0}
                </div>
                <div className="text-slate-600 font-medium">This Month</div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <div className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Powerful Coding Assistant Features
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our AI-powered assistant helps you learn, debug, and improve your coding skills 
              with intelligent conversations and practical solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  className={`group relative bg-white rounded-2xl p-6 border-2 ${feature.border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
                >
                  <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-20 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-slate-600">
              Get coding help in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 + index * 0.2 }}
                  className="text-center group"
                >
                  <div className="relative mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-slate-700">{step.number}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-24 h-24 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-white/15 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/10 rounded-full"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to enhance your coding skills?
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed">
              Start chatting with your AI coding assistant today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/analyze"
                className="group inline-flex items-center px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 hover:bg-slate-50"
              >
                <MessageCircle className="h-5 w-5 mr-2 group-hover:animate-pulse text-blue-600" />
                Start Coding Chat
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {session && (
        <div className="bg-blue-50 border-t border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center space-x-3 text-sm text-blue-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <Info className="h-4 w-4" />
              </div>
              <span className="font-medium">
                Session active: {session.total_messages || session.created_reviews_count || 0} messages sent
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;