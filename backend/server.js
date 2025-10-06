import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Simple in-memory database (no MongoDB needed initially)
let database = {
  customers: [],
  deliveries: [],
  payments: [],
  agencies: [
    { id: '1', name: 'Hyderabad Milk Agency', upiId: '8317581308@ybl' }
  ]
};

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'MilkMan Pro API is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Get all customers
app.get('/api/customers', (req, res) => {
  res.json(database.customers);
});

// Add new customer
app.post('/api/customers', (req, res) => {
  const customer = {
    id: Date.now().toString(),
    ...req.body,
    joinDate: new Date().toISOString()
  };
  database.customers.push(customer);
  res.json(customer);
});

// Record delivery
app.post('/api/deliveries', (req, res) => {
  const delivery = {
    id: Date.now().toString(),
    ...req.body,
    date: new Date().toISOString(),
    amount: (req.body.packets || 0) * 30 // ₹30 per packet
  };
  database.deliveries.push(delivery);
  res.json(delivery);
});

// Get deliveries for customer
app.get('/api/deliveries/:customerId', (req, res) => {
  const deliveries = database.deliveries.filter(
    d => d.customerId === req.params.customerId
  );
  res.json(deliveries);
});

// Record payment
app.post('/api/payments', (req, res) => {
  const payment = {
    id: Date.now().toString(),
    ...req.body,
    paymentDate: new Date().toISOString(),
    status: 'paid'
  };
  database.payments.push(payment);
  res.json(payment);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📱 API: http://localhost:${PORT}`);
});
