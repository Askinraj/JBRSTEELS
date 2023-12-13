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


exports.logoutUser=(req,res,next)=>{
     res.cookie('token',null,{
          expires:new Date(Date.now()),
          httpOnly: true
     })
     .status(200)
     .json({
          success: true,
          message:"loggedout"
     })
}

exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
     const user = await User.findOne({email:req.body.email});

     if(!user)
     {
          return next(new errorHandler('User not found with this email',404));
     }

     const resetToken = user.getResetToken();
     await user.save({validateBeforesave: false})

     //create reset URL
     const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

     const message = `Your password reset URL is as follows \n\n ${resetUrl} \n\n If you have not requested this mail ,Please ignore it.`;

     try{
          sendEmail({
               email: user.email,
               subject: "JBR Steel Password recovery",
               message
          })

          res.status(200).json({
               success: true,
               message: `Email sent to ${user.email}`
          })
     }
     catch(error)
     {
          user.resetPasswordToken = undefined;
          user.resetPasswordTokenExpire = undefined;
          await user.save({validateBeforesave: false});
          return next(new errorHandler(error.message),500)
     }

})