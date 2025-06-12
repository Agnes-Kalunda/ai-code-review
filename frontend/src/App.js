import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import ReviewsPage from './pages/ReviewsPage';
import ReviewDetailPage from './pages/ReviewDetailPage';

import StatsPage from './pages/StatsPage';
import NotFoundPage from './pages/NotFoundPage';

// Context
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          {/* Header */}
          <Header />
          
          {/* Main content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/reviews/:id" element={<ReviewDetailPage />} />
              
              <Route path="/stats" element={<StatsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;