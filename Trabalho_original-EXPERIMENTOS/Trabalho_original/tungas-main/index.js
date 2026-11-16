import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import Ficha from './models/Ficha.js';
import Personagem from './models/Personagem.js';
import Campanha from './models/Campanha.js';

const app = express();
const PORT = 4321;

// Configuração do caminho do diretório
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares e Configurações
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// ==========================================
// ROTAS PRINCIPAL
// ==========================================

app.get('/', (req, res) => {
  res.render('index');
});

// ==========================================
// ROTAS DE FICHA
// ==========================================

app.get('/ficha', async (req, res) => {
  const fichas = await Ficha.find();
  res.render('ficha/lst', { fichas });
});

app.get('/ficha/add', (req, res) => {
  res.render('ficha/add');
});

app.post('/ficha/add', async (req, res) => {
  const { nome, classe, origem, lore } = req.body;
  await Ficha.create({ nome, classe, origem, lore });
  res.redirect('/ficha');
});

app.get('/ficha/upd/:id', async (req, res) => {
  const ficha = await Ficha.findById(req.params.id);
  res.render('ficha/upd', { ficha });
});

app.post('/ficha/upd/:id', async (req, res) => {
  const { nome, classe, origem, lore } = req.body;
  await Ficha.findByIdAndUpdate(req.params.id, { nome, classe, origem, lore });
  res.redirect('/ficha');
});

app.get('/ficha/del/:id', async (req, res) => {
  await Ficha.findByIdAndDelete(req.params.id);
  res.redirect('/ficha');
});

// ==========================================
// ROTAS DE PERSONAGEM
// ==========================================

app.get('/personagem', async (req, res) => {
  const personagens = await Personagem.find();
  res.render('personagem/lst', { personagens });
});

app.get('/personagem/add', (req, res) => {
  res.render('personagem/add');
});

app.post('/personagem/add', async (req, res) => {
  const { life, pe, san } = req.body;
  await Personagem.create({ life, pe, san });
  res.redirect('/personagem');
});

app.get('/personagem/upd/:id', async (req, res) => {
  const personagem = await Personagem.findById(req.params.id);
  res.render('personagem/upd', { personagem });
});

app.post('/personagem/upd/:id', async (req, res) => {
  const { life, pe, san } = req.body;
  await Personagem.findByIdAndUpdate(req.params.id, { life, pe, san });
  res.redirect('/personagem');
});

app.get('/personagem/del/:id', async (req, res) => {
  await Personagem.findByIdAndDelete(req.params.id);
  res.redirect('/personagem');
});

// ==========================================
// ROTAS DE CAMPANHA
// ==========================================

app.get('/campanha', async (req, res) => {
  const campanhas = await Campanha.find();
  res.render('campanha/lst', { campanhas });
});

app.get('/campanha/add', (req, res) => {
  res.render('campanha/add');
});

app.post('/campanha/add', async (req, res) => {
  const { Nome_da_campanha, Descrição_da_campanha } = req.body;
  await Campanha.create({ Nome_da_campanha, Descrição_da_campanha });
  res.redirect('/campanha');
});

app.get('/campanha/upd/:id', async (req, res) => {
  const campanha = await Campanha.findById(req.params.id);
  res.render('campanha/upd', { campanha });
});

app.post('/campanha/upd/:id', async (req, res) => {
  const { Nome_da_campanha, Descrição_da_campanha } = req.body;
  await Campanha.findByIdAndUpdate(req.params.id, { Nome_da_campanha, Descrição_da_campanha });
  res.redirect('/campanha');
});

app.get('/campanha/del/:id', async (req, res) => {
  await Campanha.findByIdAndDelete(req.params.id);
  res.redirect('/campanha');
});


// ==========================================
// ROTAS DE PERSONAGEM
// ==========================================

// 1. Listar Personagens trazendo os dados da Ficha (.populate)
app.get('/personagem', async (req, res) => {
  // O .populate('ficha') substitui o ID pelos dados reais da ficha (nome, classe, etc.)
  const personagens = await Personagem.find().populate('ficha');
  res.render('personagem/lst', { personagens });
});

// 2. Abrir formulário de adicionar Personagem enviando as Fichas disponíveis
app.get('/personagem/add', async (req, res) => {
  const fichas = await Ficha.find(); // Busca todas as fichas criadas
  res.render('personagem/add', { fichas }); // Envia para o EJS
});

// 3. Salvar o Personagem vinculado à Ficha escolhida
app.post('/personagem/add', async (req, res) => {
  const { fichaId, life, pe, san } = req.body;
  await Personagem.create({ 
    ficha: fichaId, // Salva o ID da ficha selecionada
    life, 
    pe, 
    san 
  });
  res.redirect('/personagem');
});





// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});