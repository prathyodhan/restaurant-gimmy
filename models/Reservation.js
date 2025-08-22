import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Reservation extends Model {}

Reservation.init(
  {
    members: { type: DataTypes.INTEGER, allowNull: false },
    
    startTime: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      defaultValue: 'pending'
    }
  },
  { sequelize, modelName: 'Reservation' }
);

export default Reservation;
