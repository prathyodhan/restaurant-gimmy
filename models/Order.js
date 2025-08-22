import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Order extends Model {}

Order.init(
  {
    items: { // [{menuItemId, name, price, qty}]
      type: DataTypes.JSON,
      allowNull: false
    },
    totalPrice: { type: DataTypes.FLOAT, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'ready', 'cancelled'),
      defaultValue: 'pending'
    }
  },
  { sequelize, modelName: 'Order' }
);

export default Order;
