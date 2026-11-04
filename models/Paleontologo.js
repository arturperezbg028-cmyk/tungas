import mongoose from 'mongoose';
const PaleontologoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
},
  nascimento: {
    type: String,
    required: true
  },
  descoberta: {
    type: String
  }
});

const Paleontologo = mongoose.model('Paleontologo', PaleontologoSchema);

export default Paleontologo;