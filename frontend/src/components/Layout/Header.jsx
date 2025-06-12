import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Code2, 
  Menu, 
  X, 
  FileText, 
  BarChart3, 
  Zap,
  User,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { session, clearSession } = useApp();
  
  const navigation = [
    { name: 'Home', href: '/', icon: Code2 },
    { name: 'Reviews', href: '/reviews', icon: FileText },
    { name: 'Analyze', href: '/analyze', icon: Zap },
    { name: 'Stats', href: '/stats', icon: BarChart3 },
  ];
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  const handleClearSession = async () => {
    try {
      await clearSession();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  };
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex-shrink-0">
                <Code2 className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                  AI Code Review
                </h1>
                <p className="text-xs text-gray-500">
                  Intelligent code analysis
                </p>
              </div>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Session info and actions */}
          <div className="hidden md:flex items-center space-x-4">
            {session && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{session.created_reviews_count || 0} reviews</span>
              </div>
            )}
            
            <button
              onClick={handleClearSession}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              title="Clear session"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">Clear Session</span>
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile session info */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {session && (
                <div className="px-3 py-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Session: {session.created_reviews_count || 0} reviews</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleClearSession}
                className="flex items-center space-x-2 w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Clear Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;