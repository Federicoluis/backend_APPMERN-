import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    email: { 
        type: String, 
        required: true,
        trim: true,
        unique: true,
    },
    token: {
        type: String,
    },   
    confirmado: {
        type: Boolean,
        default: false,        
    },
},
{
    timestamps: true,
}
);

usuarioSchema.pre('save', async function(next){
    if (!this.isModified("password")){//revisa que el hash del password no sea cambiado cuando modifiquen datos y los usuarios no pierdan el ingreso
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;