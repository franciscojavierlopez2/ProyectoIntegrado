import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize/Sequelize.js';
import User from './User.js';
import Role from './Role.js';

const UserRole = sequelize.define('UserRole', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'idUser'
        }
    },
    idRole: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'idRole'
        }
    }
}, {
    tableName: 'user_role',
    timestamps: false
});

UserRole.belongsTo(User, { foreignKey: 'idUser' });
UserRole.belongsTo(Role, { foreignKey: 'idRole' });

export default UserRole;
