const { Sequelize } = require('sequelize');

// Criação da instância Sequelize com a URL de conexão
const dataBase = new Sequelize('cinema', 'admin', '1234567', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql', // Funciona para MariaDB também
  logging: false,   // Altere para true para ver os SQLs no console
});

// Verificar a conexão
dataBase.authenticate()
  .then(() => {
    console.log("✅ Conexão com o banco de dados realizada com sucesso!");
  })
  .catch((error) => {
    console.error("❌ Erro: Conexão com o banco de dados não realizada!", error);
  });

// Exportar a instância de conexão com o banco de dados
module.exports = dataBase;

//Intalar MySQL Server e WorkBench
//https://dev.mysql.com/downloads/installer/
