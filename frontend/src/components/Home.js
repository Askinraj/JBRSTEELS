import React, { useEffect, useState } from 'react'
import { Fragment } from "react";
import {useDispatch, useSelector} from 'react-redux';
import MetaData from './layouts/MetaData';
import { getProducts } from '../actions/productAction';
import Loader from './layouts/Loader';
import Product from './product/Product';
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';
export default function Home (){

    const dispath = useDispatch();
    const {products,loading,error,productsCount,resPerPage} = useSelector((state)=> state.productsState);
    const [currentPage,setCurrentPage] = useState(1);

    const setCurrentPageNo = (pageNo)=>{
        setCurrentPage(pageNo)
    }

    useEffect(()=>{
        if(error)
        {
        return toast.error(error,{position:toast.POSITION.BOTTOM_CENTER})
        }
        dispath(getProducts(null,null,null,null,    ))
    },[error,dispath,currentPage])
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
                            <Product col={3} product={product}/>
                    )}
                </div>
            </section>
            {productsCount>0 && productsCount>resPerPage?
            <div className="d-flex justify-content-center mt-5">
                <Pagination 
                activePage={currentPage}
                onChange={setCurrentPageNo}
                totalItemsCount={productsCount}
                itemsCountPerPage={resPerPage}
                nextPageText={'Next'}
                firstPageText={'First'}
                lastPageText={'Last'}
                prevPageText={'Prev'}
                itemClass={'page-item'}
                linkClass={'page-link'}                
                /> 
            </div>
            :null}
            </Fragment>
            }
        </Fragment>
    )
}