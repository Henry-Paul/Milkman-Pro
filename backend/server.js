import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory database (replace with real DB later)
let database = {
  agencies: [],
  customers: [],
  deliveries: [],
  bills: [],
  admins: [
    {
      id: '1',
      email: 'admin@milkman.com',
      password: '$2a$10$8K1p/a0dRTlB0.Z6sY0nK.E6Q.6Y9Qc8VpJkU6XgL9X9XjXrXrXrX', // password: admin123
      name: 'Milk Delivery Owner'
    }
  ]
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

// Admin Auth
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  
  const admin = database.admins.find(a => a.email === email);
  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const validPassword = await bcrypt.compare(password, admin.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { id: admin.id, email: admin.email, type: 'admin' },
    'your-secret-key',
    { expiresIn: '24h' }
  );
  
  res.json({ 
    token, 
    admin: { id: admin.id, email: admin.email, name: admin.name } 
  });
});

// Customers API
app.get('/api/customers', authenticateToken, (req, res) => {
  res.json(database.customers);
});

app.post('/api/customers', authenticateToken, (req, res) => {
  const customer = {
    id: uuidv4(),
    ...req.body,
    joinDate: new Date().toISOString(),
    balance: 0,
    isActive: true
  };
  database.customers.push(customer);
  res.status(201).json(customer);
});

app.put('/api/customers/:id', authenticateToken, (req, res) => {
  const index = database.customers.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Customer not found' });
  
  database.customers[index] = { ...database.customers[index], ...req.body };
  res.json(database.customers[index]);
});

// Deliveries API
app.post('/api/deliveries', authenticateToken, (req, res) => {
  const delivery = {
    id: uuidv4(),
    ...req.body,
    date: new Date().toISOString(),
    status: 'delivered'
  };
  database.deliveries.push(delivery);
  res.status(201).json(delivery);
});

app.get('/api/deliveries/:customerId', authenticateToken, (req, res) => {
  const deliveries = database.deliveries.filter(
    d => d.customerId === req.params.customerId
  );
  res.json(deliveries);
});

// Bills API
app.post('/api/bills/generate', authenticateToken, (req, res) => {
  const { month, customerId } = req.body;
  
  // Calculate bill based on deliveries
  const customerDeliveries = database.deliveries.filter(
    d => d.customerId === customerId && 
    d.date.startsWith(month)
  );
  
  const totalAmount = customerDeliveries.reduce(
    (sum, delivery) => sum + delivery.amount, 0
  );
  
  const bill = {
    id: uuidv4(),
    customerId,
    month,
    totalAmount,
    status: 'pending',
    generatedDate: new Date().toISOString()
  };
  
  database.bills.push(bill);
  res.status(201).json(bill);
});

app.get('/api/bills/customer/:customerId', authenticateToken, (req, res) => {
  const bills = database.bills.filter(b => b.customerId === req.params.customerId);
  res.json(bills);
});

// Customer Portal API
app.get('/api/customer/:customerId/profile', (req, res) => {
  const customer = database.customers.find(c => c.id === req.params.customerId);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  
  // Remove sensitive data
  const { password, ...customerProfile } = customer;
  res.json(customerProfile);
});

app.get('/api/customer/:customerId/bills', (req, res) => {
  const bills = database.bills.filter(b => b.customerId === req.params.customerId);
  res.json(bills);
});

app.post('/api/customer/:customerId/bills/:billId/pay', (req, res) => {
  const bill = database.bills.find(b => b.id === req.params.billId);
  if (!bill) return res.status(404).json({ error: 'Bill not found' });
  
  bill.status = 'paid';
  bill.paymentDate = new Date().toISOString();
  bill.paymentMethod = req.body.paymentMethod;
  
  res.json(bill);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
