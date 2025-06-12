import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, FileText } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 404 Animation */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-9xl font-bold text-primary-600 opacity-20 select-none"
            >
              404
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Search className="h-16 w-16 text-primary-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="btn-primary"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
            
            <Link
              to="/reviews"
              className="btn-secondary"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Reviews
            </Link>
          </div>

          <div className="pt-4">
            <button
              onClick={() => window.history.back()}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="pt-8 text-sm text-gray-500"
        >
          <p>
            If you believe this is a mistake, please{' '}
            <a 
              href="mailto:support@example.com" 
              className="text-primary-600 hover:text-primary-700"
            >
              contact support
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;