import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize/Sequelize.js';

const Supermercado = sequelize.define('Supermercado', {
    idSuper: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    nombre: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(45), 
        allowNull: true
    }
}, {
    tableName: 'supermercado', 
    timestamps: false
});

export default Supermercado;
