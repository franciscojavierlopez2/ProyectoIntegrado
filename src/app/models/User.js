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
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    resetToken: {
        type: DataTypes.STRING(64),
        allowNull: true,
    },
    tokenExpiration: {
        type: DataTypes.BIGINT,
        allowNull: true,
    }
}, {
    tableName: 'user',
    timestamps: false
});


export default User;
