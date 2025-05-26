import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize/Sequelize.js';
import Producto from './Producto.js';
import Supermercado from './Supermercado.js';

const ProductoSupermercado = sequelize.define('ProductoSupermercado', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idPro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto, 
            key: 'idPro', 
        },
    },
    idSuper: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        references: {
            model: Supermercado, 
            key: 'idSuper',      
        },
    },
    precio: {
        type: DataTypes.STRING(45), 
        allowNull: false, 
    },
    valoracion: {
        type: DataTypes.INTEGER,
        allowNull: true, 
    },
}, {
    tableName: 'producto_supermercado', 
    timestamps: false, 
});

ProductoSupermercado.belongsTo(Producto, { foreignKey: 'idPro' });
ProductoSupermercado.belongsTo(Supermercado, { foreignKey: 'idSuper' });

export default ProductoSupermercado;
