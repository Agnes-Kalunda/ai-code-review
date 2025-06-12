import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  Code,
  TrendingUp,
  Users,
  Calendar,
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const StatsPage = () => {
  const { stats, statsLoading, fetchStats } = useApp();

  useEffect(() => {
    fetchStats();
  }, []);

  // Sample data for charts (replace with real data from API)
  const languageData = stats?.languages || [];
  const statusData = stats ? [
    { name: 'Completed', value: stats.completed_reviews, color: '#22c55e' },
    { name: 'Pending', value: stats.pending_reviews, color: '#f59e0b' },
    { name: 'Analyzing', value: stats.analyzing_reviews, color: '#3b82f6' },
    { name: 'Failed', value: stats.failed_reviews, color: '#ef4444' },
  ] : [];

  // Mock weekly data (replace with real data)
  const weeklyData = [
    { name: 'Mon', reviews: 12, completed: 10 },
    { name: 'Tue', reviews: 15, completed: 13 },
    { name: 'Wed', reviews: 8, completed: 8 },
    { name: 'Thu', reviews: 20, completed: 18 },
    { name: 'Fri', reviews: 25, completed: 22 },
    { name: 'Sat', reviews: 5, completed: 5 },
    { name: 'Sun', reviews: 3, completed: 3 },
  ];

  const statCards = [
    {
      title: 'Total Reviews',
      value: stats?.total_reviews || 0,
      icon: FileText,
      color: 'blue',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Completed',
      value: stats?.completed_reviews || 0,
      icon: CheckCircle,
      color: 'green',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'In Progress',
      value: stats?.analyzing_reviews || 0,
      icon: Clock,
      color: 'yellow',
      change: '-2%',
      changeType: 'decrease'
    },
    {
      title: 'Failed',
      value: stats?.failed_reviews || 0,
      icon: XCircle,
      color: 'red',
      change: '0%',
      changeType: 'neutral'
    },
  ];

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-8 w-8 animate-pulse text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading statistics...</p>
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
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Analytics & Statistics
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Insights into your code review patterns and analysis results
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="card p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 
                    stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.title}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Review Status Distribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Language Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="card p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Programming Languages
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={languageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="language" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="card p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Weekly Activity
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="reviews" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Total Reviews"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last 30 days</span>
                <span className="font-medium">
                  {stats?.recent_activity?.reviews_last_30_days || 0} reviews
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-medium text-green-600">
                  {stats?.recent_activity?.completed_last_30_days || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-medium">
                  {stats?.recent_activity?.reviews_last_30_days ? 
                    Math.round((stats.recent_activity.completed_last_30_days / stats.recent_activity.reviews_last_30_days) * 100) : 0}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Session Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Your Session</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reviews Created</span>
                <span className="font-medium">
                  {stats?.user_session?.reviews_in_session || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Session ID</span>
                <span className="font-mono text-xs text-gray-500">
                  {stats?.user_session?.session_key?.slice(0, 8) || 'N/A'}...
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <a
                href="/analyze"
                className="block w-full btn-primary btn-sm text-center"
              >
                New Analysis
              </a>
              <a
                href="/reviews"
                className="block w-full btn-secondary btn-sm text-center"
              >
                View All Reviews
              </a>
              <button
                onClick={fetchStats}
                className="block w-full btn-secondary btn-sm"
              >
                Refresh Stats
              </button>
            </div>
          </motion.div>
        </div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Performance Insights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {stats?.completed_reviews || 0}
              </div>
              <div className="text-sm text-green-700">
                Successfully Analyzed
              </div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {Math.round(((stats?.completed_reviews || 0) / (stats?.total_reviews || 1)) * 100)}%
              </div>
              <div className="text-sm text-blue-700">
                Success Rate
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {stats?.languages?.length || 0}
              </div>
              <div className="text-sm text-purple-700">
                Languages Supported
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsPage;