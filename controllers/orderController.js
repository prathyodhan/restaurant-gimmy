import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import Reservation from '../models/Reservation.js';

export const createOrder = async (req, res) => {
  try {
    const { reservationId, items } = req.body; // items: [{menuItemId, qty}]
    if (!reservationId || !Array.isArray(items) || !items.length)
      return res.status(400).json({ message: 'reservationId and items required' });

    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    if (reservation.userId !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not allowed' });

 
    const menuIds = items.map(i => i.menuItemId);
    const menuRows = await MenuItem.findAll({ where: { id: menuIds, available: true } });
    const menuMap = new Map(menuRows.map(m => [m.id, m]));

    const normalized = [];
    let total = 0;
    for (const it of items) {
      const menu = menuMap.get(it.menuItemId);
      if (!menu) return res.status(400).json({ message: `Menu item ${it.menuItemId} unavailable` });
      const qty = Math.max(1, parseInt(it.qty || 1, 10));
      const lineTotal = menu.price * qty;
      total += lineTotal;
      normalized.push({ menuItemId: menu.id, name: menu.name, price: menu.price, qty });
    }

    const order = await Order.create({
      reservationId,
      items: normalized,
      totalPrice: Math.round(total * 100) / 100,
      status: 'pending'
    });

    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const myOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: Reservation, where: { userId: req.user.id } }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (e) { res.status(500).json({ message: e.message }); }
};
