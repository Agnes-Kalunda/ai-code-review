import React from 'react';
import { Code2, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand section */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Code2 className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-bold text-gray-900">AI Code Review</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Intelligent code analysis powered by AI. Get instant feedback on your code quality, 
              security, and best practices.
            </p>
          </div>
          
          {/* Features section */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• AI-powered code analysis</li>
              <li>• Static code analysis</li>
              <li>• Security vulnerability detection</li>
              <li>• Performance optimization tips</li>
              <li>• Best practices recommendations</li>
            </ul>
          </div>
          
          {/* Links section */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Resources
            </h3>
            <div className="space-y-2">
              
              <a
                href="https://docs.python.org/3/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <span>Python Documentation</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://eslint.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <span>ESLint</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              © {currentYear} AI Code Review by{' '}
              <a
                href="https://github.com/YOUR_GITHUB_USERNAME"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Agnes
              </a>
              . Built with React, Django, and OpenAI.
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-500">
                Powered by OpenAI GPT-4
              </span>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;