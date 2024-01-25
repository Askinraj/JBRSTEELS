import React, { useEffect, useState } from 'react'
import { Fragment } from "react";
import {useDispatch, useSelector} from 'react-redux';
import MetaData from '.././layouts/MetaData';
import { getProducts } from '../../actions/productsAction';
import Loader from '.././layouts/Loader';
import Product from '.././product/Product';
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';
import { useParams } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css'

export default function Home (){

    const dispath = useDispatch();
    const {products,loading,error,productsCount,resPerPage} = useSelector((state)=> state.productsState);
    const [currentPage,setCurrentPage] = useState(1);
    const[price,SetPrice] = useState([1,30000]);
    const[priceChanged,setPriceChanged] = useState(price);
    const {keyword} = useParams();
    const setCurrentPageNo = (pageNo)=>{
        setCurrentPage(pageNo)
    }
    const categories = [
        'wardrobe',
        'steel cot',
        'electric panel board',
        'shelf wardrobe',
        'tables',
        'school desk bench',
        'home'
    ]
    const  [category,setCategory] = useState("");
    const [rating,setRating] = useState(0);

    useEffect(()=>{
        if(error)
        {
        return toast.error(error,{position:toast.POSITION.BOTTOM_CENTER})
        }
        dispath(getProducts(keyword,price,category,rating,currentPage))
    },[error,dispath,keyword,currentPage,priceChanged,category,rating])

    return(
        <Fragment>
            {
            loading?<Loader/>:
            <Fragment>
            <MetaData title={'Products Available'} />
            <h1 id="products_heading">Search Products</h1>
            <section id="products" className="container mt-5">
                <div className="row">
                    <div className='col-6 col-md-3 mb-5 mt-5'>
                        {/*Price Filter*/ }
                        <div className='px-5' onMouseUp={()=>{setPriceChanged(price)}}>

                            <Slider 
                            range={true}
                            marks={
                                    {
                                     1:"1rs.",
                                     30000:"30000rs"
                                    }
                                }
                                min={1}
                                max={30000}
                                defaultValue={price}
                                onChange={(price)=>{
                                    SetPrice(price)
                                }}
                                handleRender={
                                    renderProps =>{
                                        return(
                                            <Tooltip overlay={`Rs.${renderProps.props['aria-valuenow']}`}>
                                                <div {...renderProps.props}></div>
                                            </Tooltip>
                                        )
                                    }
                                }
                    
                            />
                        </div>
                        <hr className='mt-5'/>
                        {/*Catogary Filter*/}
                        <div className='mt-5'>
                                <h3 className='mb-3'>Categories</h3>
                                    <ul className='pl-0'>
                                        {categories.map(category =>
                                            <li
                                            style={{
                                                cursor:"pointer",
                                                listStyleType:"none"
                                            }}
                                            key={category}
                                            onClick={()=>setCategory(category)}
                                            >
                                                {category}
                                            </li>
                                        )}
                                    </ul>
                        </div>
                        <hr className='mt-5'/>
                        {/*Rating Filterr*/}
                        <div className='mt-5'>
                                <h4 className='mb-3'>Ratings</h4>
                                    <ul className='pl-0'>
                                        {[5,4,3,2,1].map(star =>
                                            <li
                                            style={{
                                                cursor:"pointer",
                                                listStyleType:"none"
                                            }}
                                            key={star}
                                            onClick={()=>setRating(star)}
                                            >
                                               <div className='rating-outer'>
                                                    <div 
                                                    className='rating-inner'
                                                    style={{
                                                        width:`${star * 20}%`
                                                    }}
                                                    >
                                                    </div>
                                               </div>
                                            </li>
                                        )}
                                    </ul>
                        </div>
                    </div>
                    <div className='col-6 col-md-9'>
                        <div className='row'>
                            { products && products.map(product => 
                                 <Product col={4} product={product}/>
                            )}                   
                        </div>
                    </div>
                    
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