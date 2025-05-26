import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize/Sequelize.js';
import Producto from './Producto.js';
import Receta from './Receta.js';

const ProductoReceta = sequelize.define('ProductoReceta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idPro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'idPro'
        }
    },
    idReceta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Receta,
            key: 'idReceta'
        }
    },
    cantidad: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    tableName: 'producto_receta',
    timestamps: false
});

ProductoReceta.belongsTo(Producto, { foreignKey: 'idPro' });
ProductoReceta.belongsTo(Receta, { foreignKey: 'idReceta' });

export default ProductoReceta;
