import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class User extends Model {}

User.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' }
  },
  { sequelize, modelName: 'User' }
);

export default User;
