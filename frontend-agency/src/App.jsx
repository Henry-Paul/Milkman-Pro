import React, { useState } from 'react';

function App() {
  const [customers, setCustomers] = useState([
    { id: '1', name: 'Raj Kumar', phone: '9876543210', address: 'Gachibowli', packets: 2 },
    { id: '2', name: 'Priya Singh', phone: '9876543211', address: 'Hitech City', packets: 1 }
  ]);

  const [deliveries, setDeliveries] = useState([
    { date: '2024-01-15', customer: 'Raj Kumar', packets: 2, status: '✓ Delivered' },
    { date: '2024-01-14', customer: 'Priya Singh', packets: 1, status: '✓ Delivered' }
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg mr-3"></div>
              <h1 className="text-2xl font-bold text-gray-900">MilkMan Pro - Agency</h1>
            </div>
            <span className="text-gray-600">Hyderabad Milk Agency</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Agency Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customers Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Customers ({customers.length})</h2>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                + Add Customer
              </button>
            </div>
            
            <div className="space-y-4">
              {customers.map(customer => (
                <div key={customer.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  <p className="text-gray-600">📞 {customer.phone}</p>
                  <p className="text-gray-600">📍 {customer.address}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {customer.packets} packets/day
                    </span>
                    <span className="font-semibold">₹{customer.packets * 30}/day</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Deliveries */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Deliveries</h2>
            <div className="space-y-4">
              {deliveries.map((delivery, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{delivery.customer}</p>
                    <p className="text-sm text-gray-600">{delivery.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{delivery.packets} packets</p>
                    <p className={`text-sm ${
                      delivery.status.includes('✓') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {delivery.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
