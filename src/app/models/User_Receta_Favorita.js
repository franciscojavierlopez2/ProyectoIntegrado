import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize/Sequelize.js';
import User from './User.js';
import Receta from './Receta.js';

const UserRecetaFavorita = sequelize.define('UsuarioRecetaFavorita', {
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
    idReceta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Receta,
            key: 'idReceta'
        }
    }
}, {
    tableName: 'usuario_receta_favorita',
    timestamps: false
});

UserRecetaFavorita.belongsTo(User, { foreignKey: 'idUser' });
UserRecetaFavorita.belongsTo(Receta, { as: 'Receta', foreignKey: 'idReceta' });


export default UserRecetaFavorita;
