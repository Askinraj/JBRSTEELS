import axios from 'axios';
import { productsFail,productsSuccess,productsRequest } from '../slices/productsSlice';
import { productFail, productRequest, productSuccess } from '../slices/productSlice';

export const getProducts = (currentPage)=>async (dispath) =>{
    try {
        dispath(productsRequest())
        const {data} = await axios.get(`/api/v1/products?page=${currentPage}`)
        dispath(productsSuccess(data))

    } catch (error) {
        //handle Error
        dispath(productsFail(error.response.data.message))
        
    }
}

export const getProduct = id => async (dispath) =>{
    try {
        dispath(productRequest())
        const {data} = await axios.get(`/api/v1/product/${id}`);
        dispath(productSuccess(data))

    } catch (error) {
        //handle Error
        dispath(productFail(error.response.data.message))
        
    }
}