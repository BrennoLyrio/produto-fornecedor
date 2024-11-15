// const express = require('express')
// const bodyParser = require('body-parser');
// const sequelize = require('./config/database');
// const routes = require('./routes/index');

// const app = express();
// app.use(bodyParser.json());
// app.use('/api', routes);

// sequelize.sync().then(() => {
//   app.listen(3000, () => {
//     console.log(`Servidor rodando na porta 3000`);
//   });
// }).catch(err => console.log(err));

const methodOverride = require('method-override');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
const routes = require('./routes/index');

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servindo arquivos estáticos, como CSS
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Configurando method-override

// Rotas da API
app.use('/', routes);

// Rotas de Páginas (Front-End com EJS)
app.get('/', (req, res) => res.render('index'));

// Inicializando o Servidor
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });
}).catch(err => console.log(err));

