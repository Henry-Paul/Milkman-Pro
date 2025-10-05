import React, { useState, useEffect } from 'react';

// Simple SVG icons to avoid external dependencies
const MilkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 15.07c-2.76 0-5-2.24-5-5.07V6.31l5-1.87 5 1.87v5.69c0 2.83-2.24 5.07-5 5.07z"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.02 3.02 0 0016.95 6h-2.66c-.76 0-1.45.43-1.79 1.11L9.39 14H8v-2h2l2.5-6l-2.25-3H4v4h2v10H4v2h14v-2h-2zm-7.5-10l1.5-4h1.5l1.5 4h-4.5z"/>
  </svg>
);

const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ 
    name: '', 
    phone: '', 
    address: '', 
    milkQuantity: 1 
  });

  // Load customers from localStorage
  useEffect(() => {
    const savedCustomers = localStorage.getItem('milkman-customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  // Save to localStorage whenever customers change
  useEffect(() => {
    localStorage.setItem('milkman-customers', JSON.stringify(customers));
  }, [customers]);

  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.address) {
      alert('Please fill all fields!');
      return;
    }
    
    const customer = { 
      ...newCustomer, 
      id: Date.now(), 
      rate: 50,
      joinDate: new Date().toLocaleDateString()
    };
    setCustomers([...customers, customer]);
    setNewCustomer({ name: '', phone: '', address: '', milkQuantity: 1 });
    setCurrentView('customers');
    alert('Customer added successfully! 🎉');
  };

  const calculateMonthlyRevenue = () => {
    return customers.reduce((total, customer) => {
      return total + (customer.milkQuantity * customer.rate * 30);
    }, 0);
  };

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: MilkIcon },
    { id: 'customers', name: 'Customers', icon: UsersIcon },
    { id: 'deliveries', name: 'Deliveries', icon: TruckIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
  ];

  const Dashboard = () => (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
          <div className="text-gray-600 text-sm">Total Customers</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">₹{calculateMonthlyRevenue()}</div>
          <div className="text-gray-600 text-sm">Monthly Revenue</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <button 
          onClick={() => setCurrentView('addCustomer')}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold mb-3"
        >
          Add New Customer
        </button>
        <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold">
          Generate Bills
        </button>
      </div>
    </div>
  );

  const CustomerManagement = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers ({customers.length})</h1>
        <button 
          onClick={() => setCurrentView('addCustomer')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusIcon />
          <span className="ml-2">Add Customer</span>
        </button>
      </div>
      
      {customers.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mx-auto mb-4">
            <UsersIcon />
          </div>
          <p className="text-gray-600">No customers yet</p>
          <button 
            onClick={() => setCurrentView('addCustomer')}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Add Your First Customer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {customers.map(customer => (
            <div key={customer.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <PhoneIcon />
                    <span className="ml-2">{customer.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPinIcon />
                    <span className="ml-2">{customer.address}</span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {customer.milkQuantity}L per day
                    </span>
                    <span className="font-semibold">₹{customer.milkQuantity * customer.rate}/day</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const AddCustomer = () => (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Customer</h1>
      
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
          <input
            type="text"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter customer name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter phone number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
          <textarea
            value={newCustomer.address}
            onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter complete delivery address"
            rows="3"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Milk Quantity (Liters per day) *</label>
          <input
            type="number"
            value={newCustomer.milkQuantity}
            onChange={(e) => setNewCustomer({...newCustomer, milkQuantity: parseInt(e.target.value) || 1})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            min="1"
          />
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Rate:</strong> ₹50 per liter<br/>
            <strong>Daily Cost:</strong> ₹{newCustomer.milkQuantity * 50}<br/>
            <strong>Monthly Revenue:</strong> ₹{newCustomer.milkQuantity * 50 * 30}
          </p>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button
            onClick={addCustomer}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold"
          >
            Save Customer
          </button>
          <button
            onClick={() => setCurrentView('customers')}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const Deliveries = () => (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Daily Deliveries</h1>
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-gray-400 mx-auto mb-4">
          <TruckIcon />
        </div>
        <p className="text-gray-600">Delivery tracking coming soon!</p>
        <p className="text-sm text-gray-500 mt-2">Track your milk deliveries in real-time</p>
      </div>
    </div>
  );

  const Billing = () => (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Billing & Payments</h1>
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-gray-400 mx-auto mb-4">
          <CreditCardIcon />
        </div>
        <p className="text-gray-600">Billing system coming soon!</p>
        <p className="text-sm text-gray-500 mt-2">Generate bills and send payment reminders</p>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'customers': return <CustomerManagement />;
      case 'addCustomer': return <AddCustomer />;
      case 'deliveries': return <Deliveries />;
      case 'billing': return <Billing />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center">
            <div className="text-blue-600 mr-2">
              <MilkIcon />
            </div>
            <h1 className="text-xl font-bold text-gray-900">MilkMan Pro</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16">
        {renderView()}
      </main>

      {/* Bottom Navigation - Mobile App Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center py-2 px-3 flex-1 ${
                  currentView === item.id ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <IconComponent />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default App;
