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
    // { name: 'Reviews', href: '/reviews', icon: FileText },
    { name: 'Analyze', href: '/analyze', icon: Zap },
    // { name: 'Stats', href: '/stats', icon: BarChart3 },
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
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-slate-200/60 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur-sm opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                  AI Code Review
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Intelligent code analysis
                </p>
              </div>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center bg-slate-50/70 rounded-2xl p-1 border border-slate-200/60">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-white border border-blue-100 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
                    } ${index === 0 ? '' : 'ml-1'}`}
                  >
                    <Icon className={`h-4 w-4 transition-transform duration-200 ${isActive(item.href) ? 'scale-110' : 'group-hover:scale-105'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Session info */}
          <div className="hidden md:flex items-center">
            {session ? (
              <div className="flex items-center space-x-2 px-4 py-2.5 bg-slate-50/70 rounded-xl border border-slate-200/60">
                <div className="flex items-center space-x-2 text-sm text-slate-700">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="font-medium">{session.created_reviews_count || 0}</span>
                  <span className="text-slate-500">reviews</span>
                </div>
              </div>
            ) : (
              <div className="w-24"></div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-5 w-5" />
              ) : (
                <Menu className="block h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50 border border-blue-100 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive(item.href) ? 'scale-110' : 'group-hover:scale-105'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile session info */}
            <div className="border-t border-slate-200 pt-4 mt-6">
              {session && (
                <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-3 text-sm text-slate-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <User className="h-4 w-4 text-slate-500" />
                    <span className="font-medium">Session: {session.created_reviews_count || 0} reviews</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;