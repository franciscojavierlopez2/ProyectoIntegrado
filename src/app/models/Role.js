import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize/Sequelize.js';


const Role = sequelize.define('Role', {
    idRole: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'role',
    timestamps: false
});

export default Role;
