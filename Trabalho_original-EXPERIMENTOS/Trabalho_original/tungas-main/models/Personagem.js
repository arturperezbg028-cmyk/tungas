import conexao from '../config/conexao.js';

const PersonagemSchema = new conexao.Schema({
  ficha: { 
    type: conexao.Schema.Types.ObjectId, 
    ref: 'Ficha', 
    required: true 
  },
  nivel: { type: Number, default: 1, required: true },
  life: { type: Number, required: true },
  pe: { type: Number, required: true },
  san: { type: Number, required: true }
});

const Personagem = conexao.model('Personagem', PersonagemSchema);

export default Personagem;
