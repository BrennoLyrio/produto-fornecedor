require('dotenv').config();
const {Sequelize} = require("sequelize")

const sequelize = new Sequelize(
    process.env.DB_NAME,   // Nome do banco
    process.env.DB_USER,   // Usuário do banco
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexão bem-sucedida!');
    })
    .catch((error) => {
        console.error('Não foi possível conectar ao banco de dados:', error);
    });


module.exports = sequelize;