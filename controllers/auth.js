const { BadRequestError ,UnauthenticatedError} = require('../errors')
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

 

const register = async(req,res)=>{
   const {name,email,password} = req.body

    if(!name || !email || !password){
        throw new BadRequestError('please provide name,emailand password')
    }
    const user = await User.create(req.body)
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}
const login = async(req,res)=>{
    const {email,password} = req.body

    if(!email || !password){
        throw new BadRequestError('please provide email and password')
    }

    const user = await User.findOne({email})

    if(!user){
        throw new UnauthenticatedError('Invalid credentials')
    }

    const ispasswordcorrect = await user.comparepassword(password)

    if(!ispasswordcorrect){
        throw new UnauthenticatedError('Invalid credentials')
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name},token})
}


module.exports ={
    register,
    login
}