import React, { useState } from 'react'

function App() {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Raj Kumar', phone: '9876543210', address: 'Gachibowli', milkQuantity: 2 },
    { id: 2, name: 'Priya Singh', phone: '9876543211', address: 'Hitech City', milkQuantity: 1 }
  ])
  
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '', milkQuantity: 1 })
  const [currentView, setCurrentView] = useState('dashboard')

  const addCustomer = () => {
    if (newCustomer.name && newCustomer.phone && newCustomer.address) {
      const customer = { 
        ...newCustomer, 
        id: Date.now()
      }
      setCustomers([...customers, customer])
      setNewCustomer({ name: '', phone: '', address: '', milkQuantity: 1 })
      setCurrentView('customers')
    } else {
      alert('Please fill all fields')
    }
  }

  const calculateRevenue = () => {
    return customers.reduce((total, customer) => total + (customer.milkQuantity * 50 * 30), 0)
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center">
          <div className="text-2xl mr-2">🥛</div>
          <h1 className="text-xl font-bold">MilkMan Pro</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {currentView === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
                <div className="text-gray-600 text-sm">Customers</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-green-600">₹{calculateRevenue()}</div>
                <div className="text-gray-600 text-sm">Monthly</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="font-semibold mb-2">Quick Actions</h3>
              <button 
                onClick={() => setCurrentView('addCustomer')}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold mb-2"
              >
                Add New Customer
              </button>
              <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold">
                Generate Bills
              </button>
            </div>
          </div>
        )}

        {currentView === 'customers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Customers</h2>
              <button 
                onClick={() => setCurrentView('addCustomer')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                + Add
              </button>
            </div>
            
            <div className="space-y-3">
              {customers.map(customer => (
                <div key={customer.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  <p className="text-gray-600">📞 {customer.phone}</p>
                  <p className="text-gray-600">📍 {customer.address}</p>
                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {customer.milkQuantity}L per day
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'addCustomer' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Add New Customer</h2>
            
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter customer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter delivery address"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Milk Quantity (Liters per day)</label>
                <input
                  type="number"
                  value={newCustomer.milkQuantity}
                  onChange={(e) => setNewCustomer({...newCustomer, milkQuantity: parseInt(e.target.value) || 1})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  min="1"
                />
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
        )}
      </main>

      {/* Bottom Navigation - Mobile App Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center py-3 px-4 flex-1 ${
              currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <div className="text-xl">📊</div>
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView('customers')}
            className={`flex flex-col items-center py-3 px-4 flex-1 ${
              currentView === 'customers' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <div className="text-xl">👥</div>
            <span className="text-xs mt-1">Customers</span>
          </button>
          <button
            onClick={() => setCurrentView('addCustomer')}
            className={`flex flex-col items-center py-3 px-4 flex-1 ${
              currentView === 'addCustomer' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <div className="text-xl">➕</div>
            <span className="text-xs mt-1">Add New</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default App
