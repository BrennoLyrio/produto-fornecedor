const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Fornecedor = require('./Fornecedor');

class Produto extends Model {}

Produto.init({
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    preco: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    }
}, {sequelize, modelName: 'produto'});

Fornecedor.hasMany(Produto, {foreignKey: 'fornecedorId'}); //Um cliente tem muitos produtos
Produto.belongsTo(Fornecedor, {foreignKey: 'fornecedorId'}); // Um produto pertence a um cliente

module.exports = Produto