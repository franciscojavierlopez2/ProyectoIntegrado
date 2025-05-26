import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('asistentecompra', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize;
