import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Simple in-memory database (replace with MongoDB later)
let database = {
  customers: [],
  deliveries: [],
  bills: [],
  admins: [{ id: '1', email: 'admin@milkman.com', name: 'Admin' }]
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'MilkMan Pro API is running!' });
});

app.get('/api/customers', (req, res) => {
  res.json(database.customers);
});

app.post('/api/customers', (req, res) => {
  const customer = {
    id: Date.now().toString(),
    ...req.body,
    joinDate: new Date().toISOString()
  };
  database.customers.push(customer);
  res.json(customer);
});

app.post('/api/bills', (req, res) => {
  const bill = {
    id: Date.now().toString(),
    ...req.body,
    status: 'pending',
    generatedDate: new Date().toISOString()
  };
  database.bills.push(bill);
  res.json(bill);
});

app.get('/api/customer/:id/bills', (req, res) => {
  const bills = database.bills.filter(bill => bill.customerId === req.params.id);
  res.json(bills);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
