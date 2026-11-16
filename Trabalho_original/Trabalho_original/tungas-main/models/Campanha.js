import conexao from "../config/conexao.js";
const CampanhaSchema = new conexao.Schema({
  Nome_da_campanha: { type: String,required: true},
  Descrição_da_campanha: {type: String,required: true}
});
const Campanha = 
conexao.model("Campanha", CampanhaSchema);
export default Campanha;