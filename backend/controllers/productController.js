const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require("../utils/apiFeatures");

// getProducts              /api/v1/products
exports.getProducts = async(req,res,next)=>{
    const resPerPage = 2;
    const apiFeatures = new APIFeatures(Product.find(),req.query).search().filter().paginate(resPerPage);
    const products = await apiFeatures.query;
    
    res.status(200).json({
        success:true,
        count:products.length,
        products
    })
}

//Create Product         /api/v1//product/new
exports.newProduct = catchAsyncError(async(req,res,next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
            success:true,
            product
        })
});

//get Single Product       /api/v1/product/:id
exports.getSingleProduct =catchAsyncError( async(req,res,next)=>{
    const id = req.params.id;
    const product = await Product.findById(id);
    if(!product){
         return next(new ErrorHandler("the product not found",400));
    }
    res.status(200).json({
        success:true,
        product
    })
});


//Update Product      /api/v1/product/:id
exports.updateProduct = async(req,res,next)=>{
    const id = req.params.id;
    var product = await Product.findById(id);
    if(!product){
        res.status(404).json({
            success:false,
            message:"product not found"
        });
    }
    product = await Product.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        product
    })
}

//Delete Product      /api/v1/product/:id
exports.deleteProduct = async(req,res,next)=>{
    const id = req.params.id;
    var product = await Product.findById(id);
    if(!product){
        res.status(404).json({
            success:false,
            message:"product not found"
        });
    }
    await product.deleteOne();

    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
}