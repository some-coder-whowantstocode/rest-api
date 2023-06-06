const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter name .'],
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:[true,'please provid email'],
        match:[/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'please provide password'],
        minlength:6
    }

   
})
userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id,name:this.name},process.env.jwt_secret,{expiresIn:process.env.jwt_lifetime})
}

userSchema.methods.comparepassword = async function(canditatepassword){
    const ismatch = await bcrypt.compare(canditatepassword,this.password)
    return ismatch
}

module.exports = mongoose.model('user',userSchema)