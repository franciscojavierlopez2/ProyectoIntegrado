import sequelize from '../Sequelize/Sequelize.js';

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Has podido conectarte a la base de datos');
    } catch (error) {
        console.error('No te pudiste conectar a la base de datos:', error);
    } finally {
        await sequelize.close();
    }
})();
