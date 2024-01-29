import axios from 'axios';
import { productsFail,productsSuccess,productsRequest } from '../slices/productsSlice';
import { productFail, productRequest, productSuccess } from '../slices/productSlice';

export const getProducts = (keyword,price,category,rating,currentPage)=>async (dispath) =>{
    try {
        dispath(productsRequest())
        var link = `/api/v1/products?page=${currentPage}`;
        if(keyword) {
            link += `&keyword=${keyword}`
        }
        if(price) {
            link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`
        }
        if(category) {
            link += `&category=${category}`
        }
        if(rating) {
            link += `&ratings=${rating}`
        }
        const {data} = await axios.get(link)
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