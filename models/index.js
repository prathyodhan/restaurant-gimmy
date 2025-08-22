import { sequelize } from '../config/db.js';
import User from './User.js';
import Table from './Table.js';
import Reservation from './Reservation.js';
import MenuItem from './MenuItem.js';
import Order from './Order.js';

User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Table.hasMany(Reservation, { foreignKey: 'tableId' });
Reservation.belongsTo(Table, { foreignKey: 'tableId' });

Reservation.hasOne(Order, { foreignKey: 'reservationId' });
Order.belongsTo(Reservation, { foreignKey: 'reservationId' });

export {
  sequelize,
  User,
  Table,
  Reservation,
  MenuItem,
  Order
};
