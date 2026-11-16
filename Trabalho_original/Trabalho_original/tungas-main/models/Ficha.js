import conexao from "../config/conexao.js";
const FichaSchema = new conexao.Schema({
  nome: { type: String,required: true},
  classe: {type: String,required: true},
  lore:{type:String, required:false},
  origem:{type:String, required:false}

});
const Ficha = 
conexao.model("Ficha", FichaSchema);
export default Ficha;