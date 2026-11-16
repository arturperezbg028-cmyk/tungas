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

// Dicionário atualizado com status iniciais e ganhos por nível
const statusPorClasse = {
  'Combatente': { 
    inicial: { life: 20, pe: 2, san: 12 }, 
    porNivel: { life: 4, pe: 2, san: 3 } 
  },
  'Especialista': { 
    inicial: { life: 16, pe: 3, san: 16 }, 
    porNivel: { life: 3, pe: 3, san: 4 } 
  },
  'Ocultista': { 
    inicial: { life: 12, pe: 4, san: 20 }, 
    porNivel: { life: 2, pe: 4, san: 5 } 
  }
};

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
  
  // 1. Cria a Ficha e guarda ela na variável 'novaFicha'
  const novaFicha = await Ficha.create({ nome, classe, origem, lore });

  // 2. Busca os valores padrão da classe (se não achar, usa 10 como padrão)
  const statusIniciais = statusPorClasse[classe] || { life: '10', pe: '10', san: '10' };

  // 3. Cria o Personagem automaticamente vinculado a essa Ficha
  await Personagem.create({
    ficha: novaFicha._id,
    life: statusIniciais.life,
    pe: statusIniciais.pe,
    san: statusIniciais.san
  });

  res.redirect('/personagem');
});

app.get('/ficha/upd/:id', async (req, res) => {
  const ficha = await Ficha.findById(req.params.id);
  res.render('ficha/upd', { ficha });
});

app.get('/ficha/del/:id', async (req, res) => {
  await Ficha.findByIdAndDelete(req.params.id);
  res.redirect('/ficha');
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
  const personagens = await Personagem.find().populate('ficha');
  res.render('personagem/lst', { personagens });
});

// 2. Abrir formulário de adicionar Personagem enviando as Fichas disponíveis
app.get('/personagem/add', async (req, res) => {
  const fichas = await Ficha.find();
  res.render('personagem/add', { fichas });
});

// 3. Salvar o Personagem com valores padrão da classe
app.post('/personagem/add', async (req, res) => {
  const { fichaId } = req.body;

  // Busca a ficha selecionada para descobrir a classe dela
  const fichaSelecionada = await Ficha.findById(fichaId);

  // Pega os status da classe (ou usa '10' como padrão caso a classe tenha outro nome)
  const statusIniciais = statusPorClasse[fichaSelecionada.classe] || { life: '10', pe: '10', san: '10' };

  // Cria o personagem já com a vida, PE e sanidade preenchidos
  await Personagem.create({ 
    ficha: fichaId,
    life: statusIniciais.life, 
    pe: statusIniciais.pe, 
    san: statusIniciais.san 
  });
  
  res.redirect('/personagem');
});

// 4. Abrir formulário de edição trazendo o personagem e as fichas
app.get('/personagem/upd/:id', async (req, res) => {
  const personagem = await Personagem.findById(req.params.id).populate('ficha');
  const fichas = await Ficha.find();
  res.render('personagem/upd', { personagem, fichas });
});

// 5. Atualizar o Personagem
app.post('/personagem/upd/:id', async (req, res) => {
  const { fichaId, life, pe, san } = req.body;
  await Personagem.findByIdAndUpdate(req.params.id, { 
    ficha: fichaId, 
    life, 
    pe, 
    san 
  });
  res.redirect('/personagem');
});

// 6. Deletar o Personagem
app.get('/personagem/del/:id', async (req, res) => {
  await Personagem.findByIdAndDelete(req.params.id);
  res.redirect('/personagem');
});

// 7. Subir de Nível (Level Up)
app.get('/personagem/levelup/:id', async (req, res) => {
  // Busca o personagem trazendo os dados da ficha para saber a classe
  const personagem = await Personagem.findById(req.params.id).populate('ficha');
  
  if (personagem && personagem.ficha) {
    const classe = personagem.ficha.classe;
    const configClasse = statusPorClasse[classe];

    // Se a classe existir no dicionário, soma os pontos correspondentes
    if (configClasse) {
      personagem.nivel += 1;
      personagem.life += configClasse.porNivel.life;
      personagem.pe += configClasse.porNivel.pe;
      personagem.san += configClasse.porNivel.san;
      
      await personagem.save();
    }
  }

  res.redirect('/personagem');
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
