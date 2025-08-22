import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class MenuItem extends Model {}

MenuItem.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    available: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  { sequelize, modelName: 'MenuItem' }
);

export default MenuItem;
