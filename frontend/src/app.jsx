import React, { useState, useEffect } from 'react'
import { Milk, Users, Truck, CreditCard, Plus, Phone, MapPin } from 'lucide-react'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [customers, setCustomers] = useState([])
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '', milkQuantity: 1 })

  // Mock data for demo
  useEffect(() => {
    setCustomers([
      { id: 1, name: 'Raj Kumar', phone: '9876543210', address: 'Gachibowli', milkQuantity: 2, rate: 50 },
      { id: 2, name: 'Priya Singh', phone: '9876543211', address: 'Hitech City', milkQuantity: 1, rate: 50 }
    ])
  }, [])

  const addCustomer = () => {
    const customer = { ...newCustomer, id: Date.now(), rate: 50 }
    setCustomers([...customers, customer])
    setNewCustomer({ name: '', phone: '', address: '', milkQuantity: 1 })
    alert('Customer added successfully!')
  }

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Milk },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'deliveries', name: 'Deliveries', icon: Truck },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ]

  const Dashboard = () => (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
          <div className="text-gray-600">Total Customers</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">₹{customers.length * 1500}</div>
          <div className="text-gray-600">Monthly Revenue</div>
        </div>
      </div>
    </div>
  )

  const CustomerManagement = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button 
          onClick={() => setCurrentView('addCustomer')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </button>
      </div>
      
      <div className="space-y-4">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{customer.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Phone className="h-4 w-4 mr-2" />
                  {customer.phone}
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  {customer.address}
                </div>
                <div className="mt-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {customer.milkQuantity}L per day
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const AddCustomer = () => (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Customer</h1>
      
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
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
            onChange={(e) => setNewCustomer({...newCustomer, milkQuantity: parseInt(e.target.value)})}
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
  )

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />
      case 'customers': return <CustomerManagement />
      case 'addCustomer': return <AddCustomer />
      default: return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center">
            <Milk className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">MilkMan Pro</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16"> {/* Padding for bottom navigation */}
        {renderView()}
      </main>

      {/* Bottom Navigation - Mobile App Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center py-2 px-3 flex-1 ${
                  currentView === item.id ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default App
