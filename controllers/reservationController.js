import { Op } from 'sequelize';
import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';

// Helpers
function isWithinServiceHours(date) {
  // Booking allowed 12:00 PM to 11:00 PM (inclusive start, inclusive end start)
  const h = date.getHours();
  const m = date.getMinutes();
  // 12:00 (12) to 23:00 (23). If minute not zero still allowed.
  return (h > 11 && h <= 23) || (h === 11 && m === 60); // safety
}

function slotRange(dt) {
  const start = new Date(dt);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1-hour slots
  return { start, end };
}

export const createReservation = async (req, res) => {
  try {
    const { tableId, members, startTime } = req.body;
    if (!tableId || !members || !startTime) {
      return res.status(400).json({ message: 'tableId, members, startTime required' });
    }
    if (members < 1 || members > 4) return res.status(400).json({ message: 'Max 4 members per table' });

    const table = await Table.findByPk(tableId);
    if (!table) return res.status(404).json({ message: 'Table not found' });

    const start = new Date(startTime);
    if (Number.isNaN(start.getTime())) return res.status(400).json({ message: 'Invalid startTime' });
    if (!isWithinServiceHours(start)) return res.status(400).json({ message: 'Booking allowed 12:00 PM to 11:00 PM only' });

    const { start: s, end: e } = slotRange(start);

    // Overlap check on same table: any reservation with startTime between [s-59m, e-1m] effectively same slot
    const clash = await Reservation.findOne({
      where: {
        tableId,
        status: { [Op.ne]: 'cancelled' },
        startTime: { [Op.between]: [s, new Date(e.getTime() - 1)] }
      }
    });
    if (clash) return res.status(409).json({ message: 'Table already reserved for this slot' });

    const reservation = await Reservation.create({
      userId: req.user.id,
      tableId,
      members,
      startTime: s,
      status: 'confirmed'
    });

    res.json(reservation);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const myReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.user.id },
      include: [Table],
      order: [['startTime', 'DESC']]
    });
    res.json(reservations);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await Reservation.findByPk(id);
    if (!r || r.userId !== req.user.id) return res.status(404).json({ message: 'Not found' });
    await r.update({ status: 'cancelled' });
    res.json({ message: 'Cancelled' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const availability = async (req, res) => {
  try {
    const when = new Date(req.query.when);
    if (Number.isNaN(when.getTime())) return res.status(400).json({ message: 'Invalid when' });
    const { start: s, end: e } = slotRange(when);

    const busy = await Reservation.findAll({
      where: {
        startTime: { [Op.between]: [s, new Date(e.getTime() - 1)] },
        status: { [Op.ne]:'cancelled' }
      }
    });
    const busySet = new Set(busy.map(b => b.tableId));
    const tables = await Table.findAll({ order: [['number', 'ASC']] });
    const free = tables
      .map(t => ({ id: t.id, number: t.number, seats: t.seats, available: !busySet.has(t.id) }));

    res.json({ slotStart: s, slotEnd: e, free });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
