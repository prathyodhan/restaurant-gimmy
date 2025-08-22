import { Op } from 'sequelize';
import MenuItem from '../models/MenuItem.js';
import Table from '../models/Table.js';
import Reservation from '../models/Reservation.js';
import Order from '../models/Order.js';


export const createMenuItem = async (req, res) => {
  try {
    const { name, price, available = true } = req.body;
    const item = await MenuItem.create({ name, price, available });
    res.json(item);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    const { name, price, available } = req.body;
    await item.update({ name, price, available });
    res.json(item);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const count = await MenuItem.destroy({ where: { id } });
    if (!count) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};


export const listReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({ 
      include: [Table], 
      order:[['startTime','ASC']] 
    });
    res.json(reservations);
  } catch (e) { res.status(500).json({ message: e.message }); }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' | 'ready' | 'cancelled'
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.update({ status });
    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
};


export const listOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Reservation, include: [Table] }, // show table + resv info
      ],
      order: [['createdAt','DESC']],
      limit: 100, // optional, avoid dumping huge dataset
    });
    res.json(orders);
  } catch (e) { res.status(500).json({ message: e.message }); }
};


export const occupancy = async (req, res) => {
  try {
    const now = new Date();
    const end = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    const reservations = await Reservation.findAll({
      where: { 
        startTime: { [Op.between]: [now, end] }, 
        status: { [Op.ne]:'cancelled' } 
      },
      include: [Table]
    });

    const snapshot = {};
    for (let i = 1; i <= 13; i++) snapshot[i] = { seats: 4, reservations: [] };

    for (const r of reservations) {
      snapshot[r.tableId].reservations.push({
        reservationId: r.id,
        startTime: r.startTime,
        members: r.members,
        status: r.status
      });
    }
    res.json(snapshot);
  } catch (e) { res.status(500).json({ message: e.message }); }
};
