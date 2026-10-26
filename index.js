import express from 'express'
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

//Liberar acesso a pasta public
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname + '/public'))



import Especie from './models/Especie.js'
import Dinossauro from './models/Dinossauro.js'

app.get('/', (req, res) => {
    //envio de informação para o EJS
    res.render("index");
})

app.get('/dinossauro/add', (req, res) => {
    res.render("dinossauro/add");
})

app.get('/dinossauro', async (req, res) => {
    const dinossauros = await Dinossauro.find()
    res.render("dinossauro/lst", {dinossauros});
})

//Rota POST pra gravar no Banco de Dados
app.post('/dinossauro/add',  async (req, res) => {
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

  res.render("dinossauro/add");
});

app.get('/especie',  async (req, res) => {
 //listar espécies
 const especies = await Especie.find()
 res.render("especie/lst", {especies});

})

//apagar e listar
app.get('/especie/del/:id',  async (req, res) => {
  
  await Especie.findByIdAndDelete(req.params.id)
  //listar espécies
 const especies = await Especie.find()
 res.render("especie/lst", {especies});

})


app.get('/especie/upd/:id', async  (req, res) => {
  //buscar o registro que quero alterar
  const especie = await Especie.findById(req.params.id)
  res.render("especie/upd", {especie});
})

app.get('/especie/add',  (req, res) => {
  res.render("especie/add");
})
//Rota POST pra gravar no Banco de Dados
app.post('/especie/add',  async (req, res) => {
  const {nome,periodo} = req.body
  await Especie.create({nome,periodo})
  res.render("especie/add");
})



app.post('/especie/upd/:id',  async (req, res) => {
  const {id,nome,periodo} = req.body
  await Especie.findByIdAndUpdate(id, {nome,periodo})
//listar espécies
 const especies = await Especie.find()
 res.render("especie/lst", {especies});

})

app.listen(PORT, () => {
    console.log(`servidor rodando em http://localhost:${PORT}`);
});