import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize/Sequelize.js';

const Producto = sequelize.define('Producto', {
    idPro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    tipo: {
        type: DataTypes.STRING(45),
        allowNull: true
    }
}, {
    tableName: 'producto',
    timestamps: false
});

export default Producto;
