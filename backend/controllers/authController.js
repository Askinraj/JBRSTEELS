const catchAsyncError = require("../middlewares/catchAsyncError")
const User = require('../models/userModel')
const sendEmail = require("../utils/email")
const ErrorHandler = require("../utils/errorHandler")
const errorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwt')
const crypto = require('crypto');

//register   /api/v1/register
exports.registerUser = catchAsyncError(async (req,res,next)=>{
    const {name,email,password} = req.body
     var avatar;
     if(req.file){
          avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`
     }
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

//login  /api/v1/login
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

//logout /api/v1/logout
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

//forgotPassword    /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    
     const user = await User.findOne({email: req.body.email});

     if(!user)
     {
          return next(new errorHandler('User not found with this email',404));
     }

     const resetToken = user.getResetToken();
     await user.save({validateBeforesave: false})

     //create reset URL
     const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

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

//resetPassword   /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async(req,res,next)=>{
     //console.log('Request body:', req.body);
     const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

     const user =await User.findOne({
          resetPasswordToken,
          resetPasswordTokenExpire:{
               $gt :Date.now()
          }
     })

     if(!user)
     {
          return next(new errorHandler('Password token is invalid or expired'));
     }

     if(req.body.password !== req.body.confirmPassword)
     {
          return next(new errorHandler('The entered Password does not match'));
     }
     user.password = req.body.password;
     user.resetPasswordToken = undefined;
     user.resetPasswordTokenExpire = undefined;
     await user.save({validateBeforesave: false})

     sendToken(user, 201, res)
})

//Get User Profile  -/api/v1/myprofile

exports.getUserProfile = catchAsyncError(async(req,res,next)=>{
     const user = await User.findById(req.user.id)
     res.status(200).json({
          success: true,
          user
     })
})


//Change Password      -/api/v1/login

exports.changePassword = catchAsyncError(async(req,res,next)=>{
     const user = await User.findById(req.user.id).select('+password');

     //Check Old Password
     if(!await user.isValidPassword(req.body.oldPassword))
     {
          return next(new ErrorHandler('The Old password is incorrect',404));
     }

     //assigning new Password
     user.password = req.body.password;
     await user.save();
     res.status(200).json({
          success: true,
          user
     })
})


//Update Profile

exports.updateProfile = catchAsyncError(async(req,res,next)=>{
     var newUserData ={
          name: req.body.name,
          email:req.body.email
     }
     var avatar;
     if(req.file)
     {
          avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`
          newUserData ={...newUserData,avatar} 
     }
     const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
          new:true,
          runValidators:true
     })

     res.status(200).json({
          success:true,
          user
     })


})

//Admin: Get All Users  --/api/v1/admin/users
 exports.getAllUsers = catchAsyncError(async(req,res,next)=>{
     const users = await User.find();
     res.status(200).json({
          success: true,
          users
     })
 })


 //Admin: Get Spesific User  -/api/v1/admin/user/:id

 exports.getUser = catchAsyncError(async(req,res,next)=>{
     const user = await User.findById(req.params.id);
     if(!user)
     {
         return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
     }
     res.status(200).json({
          success: true,
          user
     })
 });

 //Admin: Update User          -/api/v1/admin/user/:id

 exports.updateUser = catchAsyncError(async(req,res,next)=>{
     const newUserData ={
          name: req.body.name,
          email:req.body.email,
          role: req.body.role
     }
     const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
          new:true,
          runValidators:true
     })

     res.status(200).json({
          success:true,
          user
     })
 });

  //Admin: Delete User        -/api/v1/admin/user/:id    

  exports.deleteUser = catchAsyncError(async(req,res,next)=>{
     const user = await User.findById(req.params.id);
     if(!user)
     {
         return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
     }

     //await user.remove();   --not working 
     await user.deleteOne();
     res.status(200).json({
          success: true         
     })
 });


 