const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let estoque = {};

// Chat (esqueci de colcoar esse)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Adicionar produto
app.post('/produtos', (req, res) => {
  const { nome, quantidade } = req.body;
  if (estoque[nome]) {
    return res.status(400).json({ erro: `Produto ${nome} já existe.` });
  }
  estoque[nome] = quantidade;
  res.json({ mensagem: `Produto ${nome} adicionado com quantidade ${quantidade}.` });
});

// Remover produto
app.delete('/produtos/:nome', (req, res) => {
  const { nome } = req.params;
  if (estoque[nome]) {
    delete estoque[nome];
    res.json({ mensagem: `Produto ${nome} removido.` });
  } else {
    res.status(404).json({ erro: `Produto ${nome} não encontrado.` });
  }
});

// Atualizar produto
app.put('/produtos/:nome', (req, res) => {
  const { nome } = req.params;
  const { quantidade } = req.body;
  if (estoque[nome]) {
    estoque[nome] = quantidade;
    res.json({ mensagem: `Produto ${nome} atualizado para ${quantidade}.` });
  } else {
    res.status(404).json({ erro: `Produto ${nome} não encontrado.` });
  }
});

// Listar todos os produtos
app.get('/produtos', (req, res) => {
  res.json(estoque);
});

//chat
// Verificar produto específico
app.get('/produtos/:nome', (req, res) => {
  const { nome } = req.params;
  if (estoque[nome] !== undefined) {
    res.json({ nome, quantidade: estoque[nome] });
  } else {
    res.status(404).json({ erro: `Produto ${nome} não encontrado.` });
  }
});

// Verificar estoque baixo
app.get('/produtos/baixo', (req, res) => {
  if (!estoque || typeof estoque !== 'object') {
    return res.status(500).json({ error: 'Estoque não está definido corretamente' });
  }

  const baixoEstoque = {};
  
  for (const [nome, qtd] of Object.entries(estoque)) {
    // Converter para número caso seja string
    const quantidade = Number(qtd);
    
    // Verificar se a conversão foi bem sucedida e se é menor que 5
    if (!isNaN(quantidade) && quantidade < 5) {
      baixoEstoque[nome] = quantidade;
    }
  }
  
  res.json(baixoEstoque);
});

app.listen(3000, () => {
  console.log('Servidor rodando com Sucesso');
});
