import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Truck, 
  DollarSign, 
  Calendar, 
  Plus, 
  MapPin, 
  Phone, 
  Check, 
  X,
  LogOut,
  Package,
  BarChart3
} from 'lucide-react';

// Use your actual backend URL after deployment
const API_BASE = 'https://your-backend-url.onrender.com/api';

function App() {
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    milkQuantity: 1
  });
  const [newDelivery, setNewDelivery] = useState({
    customerId: '',
    packets: 1,
    status: 'delivered',
    notes: ''
  });

  // Demo data - Replace with actual API calls
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setCustomers([
        {
          id: '1',
          name: 'Raj Kumar',
          phone: '9876543210',
          address: 'Gachibowli, Hyderabad',
          milkQuantity: 2,
          rate: 30,
          joinDate: '2024-01-01'
        },
        {
          id: '2',
          name: 'Priya Singh', 
          phone: '9876543211',
          address: 'Hitech City, Hyderabad',
          milkQuantity: 1,
          rate: 30,
          joinDate: '2024-01-02'
        },
        {
          id: '3',
          name: 'Amit Sharma',
          phone: '9876543212',
          address: 'Madhapur, Hyderabad',
          milkQuantity: 3,
          rate: 30,
          joinDate: '2024-01-03'
        }
      ]);

      setDeliveries([
        { id: '1', customerId: '1', date: '2024-01-15', packets: 2, amount: 60, status: 'delivered' },
        { id: '2', customerId: '1', date: '2024-01-14', packets: 2, amount: 60, status: 'delivered' },
        { id: '3', customerId: '1', date: '2024-01-13', packets: 0, amount: 0, status: 'not-delivered' },
        { id: '4', customerId: '2', date: '2024-01-15', packets: 1, amount: 30, status: 'delivered' },
        { id: '5', customerId: '2', date: '2024-01-14', packets: 1, amount: 30, status: 'delivered' },
        { id: '6', customerId: '3', date: '2024-01-15', packets: 3, amount: 90, status: 'delivered' }
      ]);
    }, 1000);
  }, []);

  // Calculate monthly revenue
  const calculateMonthlyRevenue = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return deliveries
      .filter(d => d.date.startsWith(currentMonth) && d.status === 'delivered')
      .reduce((sum, delivery) => sum + delivery.amount, 0);
  };

  // Calculate today's deliveries
  const getTodayDeliveries = () => {
    const today = new Date().toISOString().split('T')[0];
    return deliveries.filter(d => d.date === today && d.status === 'delivered').length;
  };

  // Calculate pending deliveries
  const getPendingDeliveries = () => {
    const today = new Date().toISOString().split('T')[0];
    const deliveredToday = deliveries.filter(d => d.date === today && d.status === 'delivered').length;
    return customers.length - deliveredToday;
  };

  // Add new customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    
    // Create customer object
    const customer = {
      id: Date.now().toString(),
      ...newCustomer,
      rate: 30,
      joinDate: new Date().toISOString().split('T')[0]
    };

    // Add to customers list
    setCustomers([...customers, customer]);
    
    // Reset form
    setNewCustomer({
      name: '',
      phone: '',
      address: '',
      milkQuantity: 1
    });

    // Show success message
    alert('Customer added successfully! 🎉');
    
    // Go back to customers list
    setActiveTab('customers');
  };

  // Record delivery
  const handleRecordDelivery = async (e) => {
    e.preventDefault();
    
    const delivery = {
      id: Date.now().toString(),
      ...newDelivery,
      date: new Date().toISOString().split('T')[0],
      amount: newDelivery.packets * 30
    };

    // Add to deliveries
    setDeliveries([...deliveries, delivery]);
    
    // Reset form
    setNewDelivery({
      customerId: '',
      packets: 1,
      status: 'delivered',
      notes: ''
    });

    alert('Delivery recorded successfully! ✅');
    setActiveTab('dashboard');
  };

  // Calendar Component
  const DeliveryCalendar = ({ customerId }) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const customerDeliveries = deliveries.filter(d => d.customerId === customerId);
    
    const days = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const delivery = customerDeliveries.find(d => d.date === dateStr);
      
      days.push(
        <div key={day} className="h-24 border border-gray-200 p-1 relative hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-700">{day}</span>
            {delivery && (
              delivery.status === 'delivered' ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
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
          Delivery Calendar - {new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })}
        </h2>
        
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2 bg-gray-50 rounded">
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

  // Login Component
  const Login = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">MilkMan Pro</h1>
          <p className="text-gray-600 mt-2">Agency Portal</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email or Phone</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email or phone"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setUser({ name: 'Hyderabad Milk Agency', email: 'agency@milkman.com' })}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          Demo: Click "Sign In" to continue
        </div>
      </div>
    </div>
  );

  // Dashboard Component
  const Dashboard = () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Agency Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Deliveries</p>
              <p className="text-2xl font-bold text-gray-900">{getTodayDeliveries()}/{customers.length}</p>
            </div>
            <Truck className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Deliveries</p>
              <p className="text-2xl font-bold text-gray-900">{getPendingDeliveries()}</p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{calculateMonthlyRevenue()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('add-customer')}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Customer
            </button>
            <button 
              onClick={() => setActiveTab('record-delivery')}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <Truck className="h-5 w-5 mr-2" />
              Record Today's Delivery
            </button>
            <button className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Generate Monthly Bills
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Deliveries</h3>
          <div className="space-y-3">
            {deliveries.slice(0, 5).map(delivery => {
              const customer = customers.find(c => c.id === delivery.customerId);
              return (
                <div key={delivery.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{customer?.name || 'Customer'}</p>
                    <p className="text-sm text-gray-600">{delivery.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{delivery.packets} packets</p>
                    <p className={`text-sm ${
                      delivery.status === 'delivered' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {delivery.status === 'delivered' ? '✓ Delivered' : '✗ Missed'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calendar Overview */}
      <DeliveryCalendar />
    </div>
  );

  // Customers List Component
  const CustomersList = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customers ({customers.length})</h1>
        <button 
          onClick={() => setActiveTab('add-customer')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">No customers yet</p>
          <button 
            onClick={() => setActiveTab('add-customer')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Add Your First Customer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map(customer => (
            <div 
              key={customer.id}
              onClick={() => {
                setSelectedCustomer(customer);
                setActiveTab('customer-details');
              }}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-blue-200"
            >
              <h3 className="font-semibold text-lg mb-2">{customer.name}</h3>
              <p className="text-gray-600 flex items-center mb-2">
                <Phone className="h-4 w-4 mr-2" />
                {customer.phone}
              </p>
              <p className="text-gray-600 flex items-center mb-3">
                <MapPin className="h-4 w-4 mr-2" />
                {customer.address}
              </p>
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {customer.milkQuantity} packets/day
                </span>
                <span className="font-semibold">₹{customer.milkQuantity * 30}/day</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Add Customer Component
  const AddCustomer = () => (
    <div className="p-6">
      <button 
        onClick={() => setActiveTab('customers')}
        className="text-blue-500 hover:underline mb-4 flex items-center"
      >
        ← Back to Customers
      </button>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Customer</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <form onSubmit={handleAddCustomer} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
              <input
                type="text"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter customer name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
              <textarea
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter complete delivery address"
                rows="3"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Milk Packets *</label>
              <input
                type="number"
                value={newCustomer.milkQuantity}
                onChange={(e) => setNewCustomer({...newCustomer, milkQuantity: parseInt(e.target.value) || 1})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                required
              />
            </div>
            
            <div className="flex items-end">
              <div className="bg-blue-50 p-3 rounded-lg w-full">
                <p className="text-sm text-blue-800">
                  <strong>Rate:</strong> ₹30 per packet<br/>
                  <strong>Daily Cost:</strong> ₹{newCustomer.milkQuantity * 30}<br/>
                  <strong>Monthly Revenue:</strong> ₹{newCustomer.milkQuantity * 30 * 30}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Save Customer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('customers')}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Record Delivery Component
  const RecordDelivery = () => (
    <div className="p-6">
      <button 
        onClick={() => setActiveTab('dashboard')}
        className="text-blue-500 hover:underline mb-4 flex items-center"
      >
        ← Back to Dashboard
      </button>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Record Delivery</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <form onSubmit={handleRecordDelivery} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer *</label>
            <select
              value={newDelivery.customerId}
              onChange={(e) => setNewDelivery({...newDelivery, customerId: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Packets Delivered *</label>
              <input
                type="number"
                value={newDelivery.packets}
                onChange={(e) => setNewDelivery({...newDelivery, packets: parseInt(e.target.value) || 0})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Status *</label>
              <select
                value={newDelivery.status}
                onChange={(e) => setNewDelivery({...newDelivery, status: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="delivered">✓ Delivered</option>
                <option value="not-delivered">✗ Not Delivered</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={newDelivery.notes}
              onChange={(e) => setNewDelivery({...newDelivery, notes: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any delivery notes..."
              rows="3"
            />
          </div>
          
          {newDelivery.customerId && newDelivery.packets > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-semibold text-center">
                Amount: ₹{newDelivery.packets * 30}
              </p>
            </div>
          )}
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Record Delivery
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Customer Details Component
  const CustomerDetails = () => {
    if (!selectedCustomer) return null;
    
    const customerDeliveries = deliveries.filter(d => d.customerId === selectedCustomer.id);
    const deliveredThisMonth = customerDeliveries.filter(d => 
      d.date.startsWith(new Date().toISOString().slice(0, 7)) && 
      d.status === 'delivered'
    ).length;
    
    const totalPackets = customerDeliveries
      .filter(d => d.status === 'delivered')
      .reduce((sum, d) => sum + d.packets, 0);
    
    const totalAmount = customerDeliveries
      .filter(d => d.status === 'delivered')
      .reduce((sum, d) => sum + d.amount, 0);

    return (
      <div className="p-6">
        <button 
          onClick={() => setActiveTab('customers')}
          className="text-blue-500 hover:underline mb-4 flex items-center"
        >
          ← Back to Customers
        </button>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{selectedCustomer.name}</h1>
            <p className="text-gray-600 flex items-center mt-2">
              <Phone className="h-4 w-4 mr-2" />
              {selectedCustomer.phone}
            </p>
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-2" />
              {selectedCustomer.address}
            </p>
          </div>
          <button 
            onClick={() => {
              setNewDelivery({
                customerId: selectedCustomer.id,
                packets: selectedCustomer.milkQuantity,
                status: 'delivered',
                notes: ''
              });
              setActiveTab('record-delivery');
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
          >
            <Truck className="h-4 w-4 mr-2" />
            Record Delivery
          </button>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">{deliveredThisMonth}</div>
            <div className="text-gray-600 text-sm">This Month</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">{totalPackets}</div>
            <div className="text-gray-600 text-sm">Total Packets</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-purple-600">₹{totalAmount}</div>
            <div className="text-gray-600 text-sm">Total Amount</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-orange-600">{selectedCustomer.milkQuantity}</div>
            <div className="text-gray-600 text-sm">Daily Packets</div>
          </div>
        </div>

        {/* Delivery Calendar */}
        <DeliveryCalendar customerId={selectedCustomer.id} />

        {/* Recent Deliveries */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Deliveries</h2>
          <div className="space-y-3">
            {customerDeliveries.slice(0, 10).map(delivery => (
              <div key={delivery.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-semibold">{delivery.date}</p>
                  <p className="text-sm text-gray-600">
                    {delivery.status === 'delivered' ? `${delivery.packets} packets delivered` : 'Not delivered'}
                    {delivery.notes && ` - ${delivery.notes}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{delivery.amount}</p>
                  <p className={`text-sm ${
                    delivery.status === 'delivered' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {delivery.status === 'delivered' ? '✓ Delivered' : '✗ Missed'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Reports Component
  const Reports = () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Report */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Delivery Overview
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span>Total Deliveries This Month</span>
              <span className="font-semibold">{deliveries.filter(d => d.date.startsWith(new Date().toISOString().slice(0, 7))).length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span>Successful Deliveries</span>
              <span className="font-semibold">{deliveries.filter(d => d.status === 'delivered').length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded">
              <span>Failed Deliveries</span>
              <span className="font-semibold">{deliveries.filter(d => d.status === 'not-delivered').length}</span>
            </div>
          </div>
        </div>

        {/* Revenue Report */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Revenue Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span>Total Revenue</span>
              <span className="font-semibold">₹{deliveries.reduce((sum, d) => sum + d.amount, 0)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span>This Month</span>
              <span className="font-semibold">₹{calculateMonthlyRevenue()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
              <span>Average per Customer</span>
              <span className="font-semibold">₹{customers.length > 0 ? Math.round(calculateMonthlyRevenue() / customers.length) : 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">MilkMan Pro - Agency</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user.name}</span>
              <button 
                onClick={() => setUser(null)}
                className="text-gray-600 hover:text-gray-800 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'customers', name: 'Customers', icon: Users },
              { id: 'record-delivery', name: 'Record Delivery', icon: Truck },
              { id: 'reports', name: 'Reports', icon: DollarSign }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== 'customer-details') setSelectedCustomer(null);
                  }}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'customers' && <CustomersList />}
        {activeTab === 'add-customer' && <AddCustomer />}
        {activeTab === 'record-delivery' && <RecordDelivery />}
        {activeTab === 'customer-details' && <CustomerDetails />}
        {activeTab === 'reports' && <Reports />}
      </main>
    </div>
  );
}

export default App;
