const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Produto = require ('./Produto');
const Fornecedor = require ('./Fornecedor');

class Historico_Compras extends Model {}

Historico_Compras.init({
    dataCompra: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {sequelize, modelName: 'historico_compras'})

// Relacionamentos

Produto.hasMany(Historico_Compras, {foreignKey: 'produtoId'});
Historico_Compras.belongsTo(Produto, {foreignKey: 'produtoId', as: 'produto'});


Fornecedor.hasMany(Historico_Compras, { foreignKey: 'fornecedorId' });
Historico_Compras.belongsTo(Fornecedor, { foreignKey: 'fornecedorId', as: 'fornecedor' });

module.exports = Historico_Compras;