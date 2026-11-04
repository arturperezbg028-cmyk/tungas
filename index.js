import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import Especie from './models/Especie.js';
import Dinossauro from './models/Dinossauro.js';
import Paleontologo from './models/Paleontologo.js';

const app = express();
const PORT = 3000;

// Configuração do caminho do diretório
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares e Configurações
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// ==========================================
// ROTAS PRINCIPAIS
// ==========================================

app.get('/', (req, res) => {
  res.render('index');
});

// ==========================================
// ROTAS DE DINOSSAURO
// ==========================================

// Listar todos
app.get('/dinossauro', async (req, res) => {
  const dinossauros = await Dinossauro.find();
  res.render('dinossauro/lst', { dinossauros });
});

// Formulário de adição
app.get('/dinossauro/add', (req, res) => {
  res.render('dinossauro/add');
});

// Processar adição
app.post('/dinossauro/add', async (req, res) => {
  const { nome, especie, peso, altura, anoDescoberta, dieta, descricao } = req.body;
  await Dinossauro.create({
    nome,
    especie,
    peso,
    altura,
    anoDescoberta,
    dieta,
    descricao
  });
  res.render('dinossauro/add');
});

// Formulário de edição
app.get('/dinossauro/upd/:id', async (req, res) => {
  const dinossauro = await Dinossauro.findById(req.params.id);
  res.render('dinossauro/upd', { dinossauro });
});

// Processar edição
app.post('/dinossauro/upd/:id', async (req, res) => {
  const { id, nome, especie, peso, altura, anoDescoberta, dieta, descricao } = req.body;
  await Dinossauro.findByIdAndUpdate(id, {
    nome,
    especie,
    peso,
    altura,
    anoDescoberta,
    dieta,
    descricao
  });
  const dinossauros = await Dinossauro.find();
  res.render('dinossauro/lst', { dinossauros });
});

// Deletar dinossauro
app.get('/dinossauro/del/:id', async (req, res) => {
  await Dinossauro.findByIdAndDelete(req.params.id);
  const dinossauros = await Dinossauro.find();
  res.render('dinossauro/lst', { dinossauros });
});

// ==========================================
// ROTAS DE ESPÉCIE
// ==========================================

// Listar todas
app.get('/especie', async (req, res) => {
  const especies = await Especie.find();
  res.render('especie/lst', { especies });
});

// Formulário de adição
app.get('/especie/add', (req, res) => {
  res.render('especie/add');
});

// Processar adição
app.post('/especie/add', async (req, res) => {
  const { nome, periodo } = req.body;
  await Especie.create({ nome, periodo });
  res.render('especie/add');
});

// Formulário de edição
app.get('/especie/upd/:id', async (req, res) => {
  const especie = await Especie.findById(req.params.id);
  res.render('especie/upd', { especie });
});

// Processar edição
app.post('/especie/upd/:id', async (req, res) => {
  const { id, nome, periodo } = req.body;
  await Especie.findByIdAndUpdate(id, { nome, periodo });
  const especies = await Especie.find();
  res.render('especie/lst', { especies });
});

// Deletar espécie
app.get('/especie/del/:id', async (req, res) => {
  await Especie.findByIdAndDelete(req.params.id);
  const especies = await Especie.find();
  res.render('especie/lst', { especies });
});

// ==========================================
// ROTAS DE PALEONTÓLOGO
// ==========================================

// Listar todos
app.get('/paleontologo', async (req, res) => {
  const paleontologos = await Paleontologo.find();
  res.render('paleontologo/lst', { paleontologos });
});

// Formulário de adição
app.get('/paleontologo/add', (req, res) => {
  res.render('paleontologo/add');
});

// Processar adição
app.post('/paleontologo/add', async (req, res) => {
  const { nome, nascimento, descoberta } = req.body;
  await Paleontologo.create({ nome, nascimento, descoberta });
  res.render('paleontologo/add');
});

// Formulário de edição
app.get('/paleontologo/upd/:id', async (req, res) => {
  const paleontologo = await Paleontologo.findById(req.params.id);
  res.render('paleontologo/upd', { paleontologo });
});

// Processar edição
app.post('/paleontologo/upd/:id', async (req, res) => {
  const { id, nome, nascimento, descoberta } = req.body;
  await Paleontologo.findByIdAndUpdate(id, { nome, nascimento, descoberta });
  const paleontologos = await Paleontologo.find();
  res.render('paleontologo/lst', { paleontologos });
});

// Deletar paleontólogo
app.get('/paleontologo/del/:id', async (req, res) => {
  await Paleontologo.findByIdAndDelete(req.params.id);
  const paleontologos = await Paleontologo.find();
  res.render('paleontologo/lst', { paleontologos });
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});