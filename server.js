import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { sequelize, User, Table, MenuItem } from './models/index.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import bcrypt from 'bcryptjs';

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/menu', async (req, res) => {
  const items = await MenuItem.findAll({ order: [['name', 'ASC']] });
  res.json(items);
});

const PORT = process.env.PORT || 3000;

async function seed() {
  // Create 13 tables (if not exist)
  const existing = await Table.count();
  if (existing < 13) {
    await Table.destroy({ where: {} });
    const payload = [];
    for (let n = 1; n <= 13; n++) payload.push({ number: n, seats: 4 });
    await Table.bulkCreate(payload);
    console.log(' Seeded 13 tables');
  }

  // Create default admin
  const adminEmail = 'admin@gimmy.com';
  const admin = await User.findOne({ where: { email: adminEmail } });
  if (!admin) {
    const hash = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Gimmy Admin', email: adminEmail, password: hash, role: 'admin' });
    console.log(' Seeded admin -> admin@gimmy.com / admin123');
  }

  // Sample menu
  if ((await MenuItem.count()) === 0) {
    await MenuItem.bulkCreate([
      { name: 'Margherita Pizza', price: 299 },
      { name: 'Veg Burger', price: 199 },
      { name: 'Pasta Alfredo', price: 349 },
      { name: 'Masala Fries', price: 129 },
      { name: 'Iced Tea', price: 99 }
    ]);
    console.log(' Seeded sample menu');
  }
}

async function start() {
  await connectDB();
  await sequelize.sync(); 
  await seed();
  app.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));
}

start();
//http://localhost:3000/
