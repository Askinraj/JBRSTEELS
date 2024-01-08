const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

const router = express.Router();

//router.route('/products').get(isAuthenticatedUser,getProducts);
router.route('/products').get(getProducts);

router.route('/product/:id').get(getSingleProduct)
                            .put(updateProduct)
                            .delete(deleteProduct)

router.route('admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProduct);
                            
//Review
router.route('/review').put(isAuthenticatedUser,createReview)
                        .delete(deleteReview);
router.route('/reviews').get(getReviews);


module.exports = router