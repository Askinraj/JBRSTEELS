const catchAsyncError = require("../middlewares/catchAsyncError")
const User = require('../models/userModel')
const errorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwt')

exports.registerUser = catchAsyncError(async (req,res,next)=>{
    const {name,email,password,avatar} = req.body;
   const user = await User.create({
        name,
        email,
        password,
        avatar
   });
   /*const token = user.getJwtToken();
   res.status(201).json({
    success:true,
    user,
    token
   })*/
   sendToken(user,201,res);
});

exports.loginUser = catchAsyncError(async(req,res,next)=>{
     const {email,password} = req.body;

     if(!email || !password)
     {
          return next(new errorHandler('Please enter email and Password',400));
     }

     //finding the user data
     const user = await User.findOne({ email }).select('+password');


     if(!user)
     {
          return next(new errorHandler('please enter valid email or password',400))
     }

     if(!await user.isValidPassword(password))
     {
          return next(new errorHandler('please enter valid email or password',400))
     }
     sendToken(user,201,res)
})
