import React, { useState, useEffect } from 'react';

// Use your actual Render backend URL
const API_BASE = 'https://your-backend-url.onrender.com/api';

function App() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '', phone: '', address: '', milkQuantity: 1, rate: 50
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE}/customers`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.log('Using demo data');
      // Demo data if backend fails
      setCustomers([
        { id: '1', name: 'Demo Customer', phone: '9876543210', address: 'Hyderabad', milkQuantity: 2, rate: 50 }
      ]);
    }
  };

  const addCustomer = async () => {
    try {
      const response = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });
      const customer = await response.json();
      setCustomers([...customers, customer]);
      setNewCustomer({ name: '', phone: '', address: '', milkQuantity: 1, rate: 50 });
      alert('Customer added!');
    } catch (error) {
      alert('Customer added locally!');
      const customer = { ...newCustomer, id: Date.now().toString() };
      setCustomers([...customers, customer]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">MilkMan Pro Admin</h1>
          <p className="text-gray-600">Manage your milk delivery business</p>
        </header>

        {/* Add Customer Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              className="p-3 border rounded-lg"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
              className="p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Address"
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
              className="p-3 border rounded-lg md:col-span-2"
            />
            <input
              type="number"
              placeholder="Milk Quantity (L)"
              value={newCustomer.milkQuantity}
              onChange={(e) => setNewCustomer({...newCustomer, milkQuantity: parseInt(e.target.value)})}
              className="p-3 border rounded-lg"
            />
            <button
              onClick={addCustomer}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            >
              Add Customer
            </button>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Customers ({customers.length})
          </h2>
          <div className="space-y-4">
            {customers.map(customer => (
              <div key={customer.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">{customer.name}</h3>
                <p className="text-gray-600">📞 {customer.phone}</p>
                <p className="text-gray-600">📍 {customer.address}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {customer.milkQuantity}L/day
                  </span>
                  <span className="font-semibold">
                    ₹{customer.milkQuantity * customer.rate}/day
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
