const express = require('express');
const Fornecedor = require('../models/Fornecedor');
const Produto = require('../models/Produto');
const Historico_Compras = require('../models/historico_compras');
const { Sequelize } = require('sequelize');

const router = express.Router();

// CRUD para Fornecedor


// Rota para formulário de adicionar fornecedor
router.get('/fornecedores/novo', (req, res) => {
  res.render('formFornecedor');
});

// Rota para formulário de editar fornecedor
router.get('/fornecedores/editar/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    if (!fornecedor) {
      return res.status(404).send('Fornecedor não encontrado');
    }
    res.render('editFornecedor', { fornecedor });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/fornecedores', async (req, res) => {
  try {
    const { nome, contato } = req.body;

    // Verificando se já existe um fornecedor com o mesmo nome ou contato
    const fornecedorExistente = await Fornecedor.findOne({
      where: {
        [Sequelize.Op.or]: [
          { nome: nome },
          { contato: contato }
        ]
      }
    });

    if (fornecedorExistente) {
      // return res.status(400).json({ error: 'Fornecedor com este nome ou contato já existe' });
      return res.render('formFornecedor', {
        error: 'Fornecedor com este nome ou contato já existe', fornecedor: req.body
      });
    }

    // const fornecedor = await Fornecedor.create(req.body);
    await Fornecedor.create(req.body);
    // res.status(201).json(fornecedor);
    res.redirect('/fornecedores');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/fornecedores', async (req, res) => {
  try {
    const fornecedores = await Fornecedor.findAll(); // Busca todos os fornecedores do banco de dados
    res.render('fornecedores', { fornecedores }); // Renderiza 'fornecedores.ejs' e passa os dados
    // res.json(fornecedores);
  } catch (error) {
    res.status(500).json({ error: error.message }); // Trata erros, se houver
  }
});

router.get('/fornecedores/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    if (!fornecedor) {
      return res.status(404).send('Fornecedor não encontrado');
    }
    res.json(fornecedor);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put('/fornecedores/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    if (!fornecedor) {
      return res.status(404).send('Fornecedor não encontrado');
    }
    await Fornecedor.update(req.body, { where: { id: req.params.id } });
    res.redirect('/fornecedores'); // Redireciona para a lista de fornecedores
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/fornecedores/:id', async (req, res) => {
  try {
    await Fornecedor.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD para Produtos


// Rota para formulário de adicionar produto
router.get('/produtos/novo', (req, res) => {
  res.render('formProduto');
});

// Rota para formulário de editar produto
router.get('/produtos/editar/:id', async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) {
      return res.status(404).send('Produto não encontrado');
    }
    res.render('formProduto', { produto });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.post('/produtos', async (req, res) => {
  try {
    const { nome } = req.body;

    // Verificando se já existe um produto com o mesmo nome
    const produtoExistente = await Produto.findOne({ where: { nome } });
    if (produtoExistente) {
      // return res.status(400).json({ error: 'Produto com este nome já existe'});
      return res.render('formProduto', {
        error: 'Produto com este nome já existe', produto: req.body
      })
    }

    // const produto = await Produto.create(req.body);
    await Produto.create(req.body);
    // res.status(201).json(produto);
    res.redirect('/produtos')
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.findAll(); // Busca todos os produtos do banco de dados
    res.render('produtos', { produtos }); // Renderiza 'produtos.ejs' e passa os dados
    // res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message }); // Trata erros, se houver
  }
});

router.get('/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) {
      return res.status(404).send('Produto não encontrado');
    }
    res.json(produto);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put('/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) {
      return res.status(404).send('Produto não encontrado');
    }
    await Produto.update(req.body, { where: { id: req.params.id } });
    res.redirect('/produtos'); // Redireciona para a lista de produtos
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/produtos/:id', async (req, res) => {
  try {
    await Produto.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Relacionamento: Consultar Produtos de um Fornecedor
router.get('/fornecedores/:id/produtos', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id, {
      include: Produto
    });
    if (!fornecedor) {
      return res.status(404).send('Fornecedor não encontrado');
    }
    res.json(fornecedor.produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para criar um registro no histórico de compras
router.post('/historico_compras', async (req, res) => {
  try {
    const { fornecedorId, produtoId, quantidade } = req.body;

    // Verificando se o fornecedor e o produto existem
    const fornecedor = await Fornecedor.findByPk(fornecedorId);
    const produto = await Produto.findByPk(produtoId, {
      attributes: ['id', 'nome', 'preco']
    });

    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // const historico = await Historico_Compras.create({ fornecedorId, produtoId, quantidade });
    await Historico_Compras.create({ fornecedorId, produtoId, quantidade });
    // res.status(201).json(historico);
    res.render('historicoCompras');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Rota para a página de Compras
router.get('/compras', async (req, res) => {
  try {
    const fornecedores = await Fornecedor.findAll(); // Carrega todos os fornecedores
    const produtos = await Produto.findAll(); // Carrega todos os produtos
    res.render('compras', { fornecedores, produtos }); // Renderiza 'compras.ejs' e passa os dados
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter um registro específico do histórico de compras
router.get('/historico_compras', async (req, res) => {
  try {
    // Buscar todos os registros do histórico de compras, incluindo os dados relacionados
    const historicos = await Historico_Compras.findAll({
      include: [
        {
          model: Produto,
          as: 'produto',
          attributes: ['nome', 'preco']
        },
        {
          model: Fornecedor,
          as: 'fornecedor',
          attributes: ['nome']
        }
      ]
    });

    // Remover duplicações (se houver) manualmente
    const historicosUnicos = Array.from(
      new Set(historicos.map(h => h.id))
    ).map(id => historicos.find(h => h.id === id));

    res.render('historicoCompras', { historicos: historicosUnicos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter um registro específico do histórico de compras
// Rota para obter o histórico detalhado de compras de um fornecedor específico
//NO FRONTEND
router.get('/historico_compras/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const historicos = await Historico_Compras.findAll({
      where: { fornecedorId: id },
      include: [
        {
          model: Produto,
          as: 'produto',
          attributes: ['nome', 'preco']
        },
        {
          model: Fornecedor,
          as: 'fornecedor',
          attributes: ['nome']
        },
      ],
    });

    if (historicos.length === 0) {
      return res.status(404).send('Nenhum histórico encontrado para este fornecedor');
    }

    // Renderiza a página de detalhes do histórico
    res.render('historicoCompraDetalhe', { historicos });
  } catch (error) {
    res.status(500).send(error.message);
  }
});





//historico Específico no Back

// router.get('/historico_compras/:id', async (req, res) => {
//   try {
//     const historico = await Historico_Compras.findByPk(req.params.id, {
//       include: [
//         {
//           model: Produto,
//           as: 'produto',
//           attributes: ['nome', 'preco']
//         },
//         {
//           model: Fornecedor,
//           as: 'fornecedor',
//           attributes: ['nome']
//         },
//       ],
//     });

//     if (!historico) {
//       return res.status(404).json({ error: 'Registro do histórico não encontrado' });
//     }

//     const nomeProduto = historico.produto.nome;
//     const precoProduto = parseFloat(historico.produto.preco);
//     const nomeFornecedor = historico.fornecedor.nome;
//     const quantidade = historico.quantidade;
//     const valorTotal = quantidade * precoProduto;

//     const respostaSimplificada = {
//       fornecedor: nomeFornecedor,
//       produto: nomeProduto,
//       quantidade: quantidade,
//       valorTotal: valorTotal.toFixed(2),
//     };

//     res.json(respostaSimplificada);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// Rota para buscar o histórico de compras com base no nome do fornecedor
router.get('/buscar_historico', async (req, res) => {
  try {
    const { fornecedor } = req.query;

    // Busca o fornecedor pelo nome exato
    const fornecedorEncontrado = await Fornecedor.findOne({
      where: { nome: fornecedor }
    });

    if (!fornecedorEncontrado) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }

    // Retorna o fornecedor em formato JSON
    res.json(fornecedorEncontrado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});








module.exports = router;
