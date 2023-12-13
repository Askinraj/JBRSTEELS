const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name:{
        type : String,
        required : [true,'Please enter product name'],
        trim: true,
        maxLength: [100,'Product name cannot exceed 100 charecters']
    },
    price:{
        type: Number,
        default: 0.0
    },
    description:{
        type: String,
        required: [true,'Enter the product description']
    },
    ratings:{
        type: String,
        default: 0
    },
    images:[
        {
            image:
            {
            type:String,
            required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please enter product category"],
        enum:{
            values:[
                'wardrobe',
                'steel cot',
                'electric panel board',
                'shelf wardrobe',
                'tables',
                'school desk bench',
                'home'
            ],
            message: "Please select correct category"
        }
    },
    seller: {
        type: String,
        required: [true,"Please enter product seller"]
    },
    stock: {
        type:String,
        required: [true,"Please enter product stock"],
        maxLength: [20, "Product stock cannot exceed 20"]
    },
    numOfReviews:{
        type:String,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required: true
            },
            rating:{
                type:String,
                required: true
            },
            comment:{
                type:String,
                required: true
            }
        }
    ],
    user:{
        type: mongoose.Schema.Types.ObjectId
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

let schema = mongoose.model('Product', productSchema)

module.exports = schema