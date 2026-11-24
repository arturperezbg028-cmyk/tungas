import conexao from '../config/conexao.js';

const PersonagemSchema = new conexao.Schema({
  life: { type: String, required: true },
  pe: { type: String, required: true },
  san: { type: String, required: true }
});

const Personagem = conexao.model('Personagem', PersonagemSchema);

export default Personagem;