import axios from 'axios';
import { productsFail,productsSuccess,productsRequest } from '../slices/productsSlice';

export const getProducts = async (dispath) =>{
    try {
        dispath(productsRequest())
        const {data} = await axios.get('/api/v1/products')
        dispath(productsSuccess(data))

    } catch (error) {
        //handle Error
        dispath(productsFail(error.response.data.message))
        
    }
}