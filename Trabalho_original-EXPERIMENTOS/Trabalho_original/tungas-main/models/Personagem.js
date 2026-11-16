import conexao from '../config/conexao.js';

const PersonagemSchema = new conexao.Schema({
  // Cria a ligação com o modelo Ficha
  ficha: { 
    type: conexao.Schema.Types.ObjectId, 
    ref: 'Ficha', 
    required: true 
  },
  life: { type: String, required: true },
  pe: { type: String, required: true },
  san: { type: String, required: true }
});

const Personagem = conexao.model('Personagem', PersonagemSchema);

export default Personagem;