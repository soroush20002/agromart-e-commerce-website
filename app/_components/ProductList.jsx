import React from 'react'
import Producitem from './Producitem'

function ProductList({productList}) {
  return (
    <div className='mt-10' >
        <h2 className='font-bold text-green-600 text-2xl text-right '></h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-5 lg:gap-5 gap-1   ' >
            {productList.map((product,index)=>index<8&&(
                <Producitem key={index} product={product}/>
            ))}
        </div>
    </div>
  )
}

export default ProductList