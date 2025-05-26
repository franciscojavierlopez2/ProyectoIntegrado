import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize/Sequelize.js';

const User = sequelize.define('User', {
    idUser: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    tableName: 'user',
    timestamps: false
});


export default User;
