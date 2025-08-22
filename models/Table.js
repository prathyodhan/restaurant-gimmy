import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Table extends Model {}

Table.init(
  {
    number: { type: DataTypes.INTEGER, allowNull: false, unique: true }, // 1..13
    seats: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 4 }
  },
  { sequelize, modelName: 'Table' }
);

export default Table;
