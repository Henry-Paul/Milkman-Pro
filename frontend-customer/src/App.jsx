import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Customer Portal Component
const CustomerPortal = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [bills, setBills] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    loadCustomerData();
    loadBills();
  }, [customerId]);

  const loadCustomerData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/customer/${customerId}/profile`);
      setCustomer(response.data);
    } catch (error) {
      console.error('Failed to load customer data:', error);
    }
  };

  const loadBills = async () => {
    try {
      const response = await axios.get(`${API_BASE}/customer/${customerId}/bills`);
      setBills(response.data);
    } catch (error) {
      console.error('Failed to load bills:', error);
    }
  };

  const handlePayment = async (billId, paymentMethod) => {
    try {
      await axios.post(`${API_BASE}/customer/${customerId}/bills/${billId}/pay`, {
        paymentMethod
      });
      alert('Payment successful!');
      loadBills(); // Reload bills to update status
    } catch (error) {
      alert('Payment failed: ' + error.message);
    }
  };

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
            </svg>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MilkMan Pro</h1>
                <p className="text-gray-600">Customer Portal</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{customer.name}</p>
              <p className="text-gray-600">{customer.phone}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-8">
            {[
              { id: 'profile', name: 'My Profile' },
              { id: 'bills', name: 'My Bills' },
              { id: 'deliveries', name: 'Delivery History' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Customer Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1">{customer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="mt-1">{customer.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Delivery Address</label>
                    <p className="mt-1">{customer.address}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Delivery Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Daily Milk Quantity</label>
                    <p className="mt-1">{customer.milkQuantity} liters</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rate per Liter</label>
                    <p className="mt-1">₹{customer.rate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Daily Cost</label>
                    <p className="mt-1">₹{customer.milkQuantity * customer.rate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Monthly Estimate</label>
                    <p className="mt-1">₹{customer.milkQuantity * customer.rate * 30}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bills' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">My Bills</h2>
            {bills.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600">No bills found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bills.map(bill => (
                  <div key={bill.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">Bill for {bill.month}</h3>
                        <p className="text-sm text-gray-600">Generated on {new Date(bill.generatedDate).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        bill.status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bill.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">₹{bill.totalAmount}</p>
                        <p className="text-sm text-gray-600">Total Amount</p>
                      </div>
                      
                      {bill.status === 'pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handlePayment(bill.id, 'upi')}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                          >
                            Pay via UPI
                          </button>
                          <button
                            onClick={() => handlePayment(bill.id, 'cash')}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                          >
                            Pay Cash
                          </button>
                        </div>
                      )}
                      
                      {bill.status === 'paid' && (
                        <div className="text-sm text-gray-600">
                          Paid on {new Date(bill.paymentDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'deliveries' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Delivery History</h2>
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600">Delivery history coming soon</p>
              <p className="text-sm text-gray-500 mt-2">Track your daily milk deliveries here</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>© 2024 MilkMan Pro. All rights reserved.</p>
            <p>Customer ID: {customerId}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App Component with Router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/customer/:customerId" element={<CustomerPortal />} />
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">MilkMan Pro</h1>
              <p className="text-gray-600 mb-6">Customer Portal</p>
              <p className="text-sm text-gray-500">
                Please use your customer portal link provided by your milk delivery service.
              </p>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
