import conexao from "../config/conexao.js";
const CampanhaSchema = new conexao.Schema({
  Nome_da_campanha: { type: String,required: true},
  Descricao_da_campanha: {type: String,required: true},
  foto:{type:Buffer}
});
const Campanha = 
conexao.model("Campanha", CampanhaSchema);
export default Campanha;