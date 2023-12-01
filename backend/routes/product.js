const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();

router.route('/products').get(getProducts);

router.route('/product/:id').get(getSingleProduct)
                            .put(updateProduct)
                            .delete(deleteProduct)

router.route('/product/new').post(newProduct);
                            

module.exports = router