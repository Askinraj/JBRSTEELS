import React, { useEffect } from 'react'
import { Fragment } from "react";
import {useDispatch, useSelector} from 'react-redux';
import MetaData from './layouts/MetaData';
import { getProducts } from '../actions/productsAction';
import Loader from './layouts/Loader';
import Product from './product/Product';
import { toast } from 'react-toastify';

export default function Home (){

    const dispath = useDispatch();
    const {products,loading,error} = useSelector((state)=> state.productsState);


    useEffect(()=>{
        if(error)
        {
        return toast.error(error,{position:toast.POSITION.BOTTOM_CENTER})
        }
        dispath(getProducts)
    },[error])
    return(
        <Fragment>
            {
            loading?<Loader/>:
            <Fragment>
            <MetaData title={'Products Available'} />
            <h1 id="products_heading">Latest Products</h1>
            <section id="products" className="container mt-5">
                <div className="row">
                    { products && products.map(product => 
                            <Product product={product}/>
                    )}
                </div>
            </section>
            </Fragment>
            }
        </Fragment>
    )
}