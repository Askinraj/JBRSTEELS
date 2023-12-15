module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500;
    if(process.env.NODE_ENV == 'development')
    {
        
        res.status(err.statusCode).json({
            success:false,
            message: err.message,
            stack: err.stack
           
        })
    }
    if(process.env.NODE_ENV == 'production')
    {
        var message = err.message;
        var error = new Error(message)

        if(err.name == 'ValidationError')
        {
            message = Object.values(err.errors).map(value => value.message)   //in JVL code he used all message fields as seperate variable ex: var message
            error = new Error(message)
        }
        if(err.name == 'CastError')
        {
            message = `The Resource not Found : ${err.path}`
            error = new Error(message)
        }
        if(err.code == 11000)
        {
             message = `Duplicate ${Object.keys(err.keyValue)} error`
            error = new Error(message)
        }

        if(err.name == 'JSONWebTokenError')
        {
            message = `JSON web token is invalid.Try again`
            error = new Error(message)
        }

        if(err.name == 'TokenExpiredError')
        {
            message = `JSON web token is expired.Try again`
            error = new Error(message)
        }

        res.status(err.statusCode).json({
            success:false,
            message: error.message || 'Internal Server Error'
           
        })
    }
}