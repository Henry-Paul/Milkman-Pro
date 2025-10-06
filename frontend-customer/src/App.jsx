import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Calendar, DollarSign, Package, History, Check, X, CreditCard, MapPin, Phone } from 'lucide-react';

// Use your actual backend URL
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Customer Portal Component
const CustomerPortal = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Demo data - Replace with actual API calls
  useEffect(() => {
    // Simulate loading customer data
    setTimeout(() => {
      setCustomer({
        id: customerId || '1',
        name: 'Raj Kumar',
        phone: '9876543210',
        address: 'Gachibowli, Hyderabad',
        milkQuantity: 2,
        rate: 30,
        joinDate: '2024-01-01'
      });

      setDeliveries([
        { id: '1', date: '2024-01-15', packets: 2, amount: 60, status: 'delivered' },
        { id: '2', date: '2024-01-14', packets: 2, amount: 60, status: 'delivered' },
        { id: '3', date: '2024-01-13', packets: 0, amount: 0, status: 'not-delivered' },
        { id: '4', date: '2024-01-12', packets: 2, amount: 60, status: 'delivered' },
        { id: '5', date: '2024-01-11', packets: 2, amount: 60, status: 'delivered' },
        { id: '6', date: '2024-01-10', packets: 1, amount: 30, status: 'delivered' },
      ]);

      setPayments([
        { id: '1', month: '2024-01', totalAmount: 1500, paidAmount: 1500, status: 'paid', paymentDate: '2024-01-10', paymentMethod: 'upi' },
        { id: '2', month: '2023-12', totalAmount: 1500, paidAmount: 1500, status: 'paid', paymentDate: '2023-12-05', paymentMethod: 'cash' },
        { id: '3', month: '2023-11', totalAmount: 1500, paidAmount: 0, status: 'pending' }
      ]);
    }, 1000);
  }, [customerId]);

  const DeliveryCalendar = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-20 border border-gray-200"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const delivery = deliveries.find(d => d.date === dateStr);
      
      days.push(
        <div key={day} className="h-20 border border-gray-200 p-1 relative hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-gray-700">{day}</span>
            {delivery && (
              delivery.status === 'delivered' ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-red-500" />
              )
            )}
          </div>
          {delivery && delivery.status === 'delivered' && (
            <div className="mt-1 text-xs space-y-1">
              <div className="text-green-600 font-semibold">{delivery.packets} 🥛</div>
              <div className="text-blue-600">₹{delivery.amount}</div>
            </div>
          )}
          {delivery && delivery.status === 'not-delivered' && (
            <div className="mt-1 text-xs text-red-600 font-semibold">Not Delivered</div>
          )}
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          My Delivery Calendar - {new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })}
        </h2>
        
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2 bg-gray-50 rounded text-sm">
              {day}
            </div>
          ))}
          {days}
        </div>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-1" />
            <span>Delivered</span>
          </div>
          <div className="flex items-center">
            <X className="h-4 w-4 text-red-500 mr-1" />
            <span>Not Delivered</span>
          </div>
        </div>
      </div>
    );
  };

  const PaymentModal = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthDeliveries = deliveries.filter(d => d.date.startsWith(currentMonth));
    const totalAmount = currentMonthDeliveries.reduce((sum, d) => sum + d.amount, 0);

    const handlePayment = (method, transactionId = '') => {
      // Simulate payment processing
      alert(`Payment of ₹${totalAmount} recorded via ${method.toUpperCase()}!`);
      setShowPaymentModal(false);
      
      // Update payment status
      const updatedPayments = payments.map(p => 
        p.month === currentMonth 
          ? { ...p, status: 'paid', paidAmount: totalAmount, paymentMethod: method, paymentDate: new Date().toISOString().split('T')[0] }
          : p
      );
      setPayments(updatedPayments);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Make Payment</h2>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 font-semibold text-center text-lg">Total Due: ₹{totalAmount}</p>
            <p className="text-yellow-600 text-sm text-center mt-1">
              For {new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })} deliveries
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Pay via UPI
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <p className="text-blue-800 font-mono text-center text-lg font-bold">8317581308@ybl</p>
                <p className="text-blue-600 text-sm text-center mt-2">
                  Scan QR Code or Send to this UPI ID
                </p>
              </div>
              <button 
                onClick={() => handlePayment('upi')}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold mt-3 hover:bg-green-600 transition-colors"
              >
                I have paid via UPI
              </button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Pay via Cash
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Mark as paid when you give cash to delivery person
              </p>
              <button 
                onClick={() => handlePayment('cash')}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Mark as Paid by Cash
              </button>
            </div>
          </div>

          <button 
            onClick={() => setShowPaymentModal(false)}
            className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold mt-4 hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthDeliveries = deliveries.filter(d => d.date.startsWith(currentMonth));
    const deliveredCount = currentMonthDeliveries.filter(d => d.status === 'delivered').length;
    const totalPackets = currentMonthDeliveries.reduce((sum, d) => sum + d.packets, 0);
    const totalAmount = currentMonthDeliveries.reduce((sum, d) => sum + d.amount, 0);

    const pendingPayment = payments.find(p => p.status === 'pending');

    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{deliveredCount}/{currentMonthDeliveries.length}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Packets</p>
                <p className="text-2xl font-bold text-gray-900">{totalPackets}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Amount Due</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalAmount}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DeliveryCalendar />
          
          <div className="space-y-6">
            {/* Payment Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Payment Status
              </h3>
              <div className="space-y-3">
                {payments.map(payment => (
                  <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-semibold">
                        {new Date(payment.month + '-01').toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600">₹{payment.totalAmount}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                      {payment.status === 'paid' && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {pendingPayment && (
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold mt-4 hover:bg-green-600 transition-colors"
                >
                  Make Payment
                </button>
              )}
            </div>

            {/* Recent Deliveries */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <History className="h-5 w-5 mr-2" />
                Recent Deliveries
              </h3>
              <div className="space-y-2">
                {deliveries.slice(0, 5).map((delivery, index) => (
                  <div key={delivery.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">
                        {new Date(delivery.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {delivery.status === 'delivered' ? `${delivery.packets} packets` : 'Not delivered'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{delivery.amount}</p>
                      <span className={`text-xs ${
                        delivery.status === 'delivered' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {delivery.status === 'delivered' ? '✓ Delivered' : '✗ Missed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PaymentHistory = () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment History</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">Month</th>
                <th className="text-left py-3 font-semibold">Total Amount</th>
                <th className="text-left py-3 font-semibold">Paid Amount</th>
                <th className="text-left py-3 font-semibold">Status</th>
                <th className="text-left py-3 font-semibold">Payment Date</th>
                <th className="text-left py-3 font-semibold">Method</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    {new Date(payment.month + '-01').toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                  </td>
                  <td className="py-3">₹{payment.totalAmount}</td>
                  <td className="py-3">₹{payment.paidAmount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3">
                    {payment.paymentMethod === 'upi' ? 'UPI' : payment.paymentMethod === 'cash' ? 'Cash' : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const DeliveryHistory = () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Delivery History</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">Date</th>
                <th className="text-left py-3 font-semibold">Packets</th>
                <th className="text-left py-3 font-semibold">Amount</th>
                <th className="text-left py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(delivery => (
                <tr key={delivery.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    {new Date(delivery.date).toLocaleDateString()}
                  </td>
                  <td className="py-3">{delivery.packets}</td>
                  <td className="py-3">₹{delivery.amount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      delivery.status === 'delivered' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {delivery.status === 'delivered' ? 'Delivered' : 'Not Delivered'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const Profile = () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
      
      {customer && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4 text-lg">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="mt-1 text-lg">{customer.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="mt-1 text-lg flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {customer.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer ID</label>
                  <p className="mt-1 font-mono text-lg">{customer.id}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-4 text-lg">Delivery Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Delivery Address</label>
                  <p className="mt-1 text-lg flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {customer.address}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Daily Milk Packets</label>
                  <p className="mt-1 text-lg">{customer.milkQuantity} packets</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Rate per Packet</label>
                  <p className="mt-1 text-lg">₹{customer.rate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Daily Cost</label>
                  <p className="mt-1 text-lg">₹{customer.milkQuantity * customer.rate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Monthly Estimate</label>
                  <p className="mt-1 text-lg">₹{customer.milkQuantity * customer.rate * 30}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MilkMan Pro</h1>
                <p className="text-gray-600">Customer Portal</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{customer.name}</p>
              <p className="text-gray-600 text-sm">Customer ID: {customer.id}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard' },
              { id: 'deliveries', name: 'Deliveries' },
              { id: 'payments', name: 'Payments' },
              { id: 'profile', name: 'Profile' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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
      <main>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'payments' && <PaymentHistory />}
        {activeTab === 'deliveries' && <DeliveryHistory />}
        {activeTab === 'profile' && <Profile />}
      </main>

      {showPaymentModal && <PaymentModal />}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>© 2024 MilkMan Pro. All rights reserved.</p>
            <p>Need help? Contact your milk agency</p>
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
          <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">MilkMan Pro</h1>
              <p className="text-gray-600 mb-6">Customer Portal</p>
              <p className="text-sm text-gray-500 mb-6">
                Please use your customer portal link provided by your milk delivery service.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  Demo: Use URL like <code>/customer/123</code> to access your portal
                </p>
              </div>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
