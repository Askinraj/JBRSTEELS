const mongoose =  require ('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter the name']
    },
    email:{
        type:String,
        required:[true,'Please enter the email address'],
        unique:true,
        validate:[validator.isEmail,'Please enter valid email address']
    },
    password:{
        type:String,
        required:[true,'Enter the Password'],
        maxlength:[6,'Password cannot exceed 6 charecters'],
        select: false
    },
    avatar:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'user'
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt:{
        type:Date,
        default:Date.now()

    }
});

userSchema.pre('save',async function (next){
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.getJwtToken =  function(){
return jwt.sign({id:this.id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_TIME_EXPIRES})
}

userSchema.methods.isValidPassword = async function(enteredPassword){
   return await bcrypt.compare(enteredPassword,this.password)
}

const model = mongoose.model('User',userSchema);
module.exports = model;