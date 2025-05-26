import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize/Sequelize.js';
import User from './User.js';

const Receta = sequelize.define('Receta', {
    idReceta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    pasos: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    tiempo_elaboracion: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    dificultad: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'idUser'
        }
    }
}, {
    tableName: 'receta',
    timestamps: false
});

Receta.belongsTo(User, { foreignKey: 'idUser' });
User.hasMany(Receta, { foreignKey: 'idUser' });

export default Receta;
