import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock data for demo
const customers = [
  { id: 1, name: 'Raj Kumar', phone: '9876543210', address: 'Gachibowli', milkQuantity: 2, rate: 50 },
  { id: 2, name: 'Priya Singh', phone: '9876543211', address: 'Hitech City', milkQuantity: 1, rate: 50 }
];

// Routes
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

app.get('/', (req, res) => {
  res.json({ message: 'MilkMan Pro API Running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
