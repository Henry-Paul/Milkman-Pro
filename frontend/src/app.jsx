import React, { useState, useEffect } from 'react';

// Use your actual backend URL after deployment
const API_BASE = 'https://your-backend-url.onrender.com/api';

function App() {
  const [stats, setStats] = useState({
    agencies: 5,
    customers: 142,
    revenue: 28400,
    deliveries: 1280
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-600 rounded-lg mr-3"></div>
            <h1 className="text-2xl font-bold text-gray-900">MilkMan Pro - Owner</h1>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Owner Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">{stats.agencies}</div>
            <div className="text-gray-600">Total Agencies</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">{stats.customers}</div>
            <div className="text-gray-600">Total Customers</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-purple-600">₹{stats.revenue}</div>
            <div className="text-gray-600">Monthly Revenue</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
            <div className="text-2xl font-bold text-orange-600">{stats.deliveries}</div>
            <div className="text-gray-600">Daily Deliveries</div>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Agencies</h2>
            <div className="space-y-3">
              {['Hyderabad Milk', 'Mumbai Dairy', 'Delhi Milkman'].map(agency => (
                <div key={agency} className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">{agency}</span>
                  <span className="text-green-600 text-sm">Active</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span>Backend API</span>
                <span className="text-green-600">✅ Running</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span>Database</span>
                <span className="text-green-600">✅ Connected</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span>Payment Gateway</span>
                <span className="text-green-600">✅ Active</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
