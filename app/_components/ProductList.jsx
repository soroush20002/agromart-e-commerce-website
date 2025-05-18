"use client"
import React, { useEffect, useRef } from 'react'
import Producitem from './Producitem'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function ProductList({productList}) {
  const cardsRef = useRef([])

  useEffect(() => {
    if (cardsRef.current.length) {
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.8, y: 60 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      })
    }
    // Cleanup triggers on unmount
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [productList])

  const sortedProducts = [...productList].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const productListo = sortedProducts.slice(0, 8);

  return (
    <div className='mt-10' >
        <h2 className='font-bold text-green-600 text-2xl text-right '></h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-5 lg:gap-5 gap-1   ' >
            {productListo.map((product,index)=>(
                <div
                  key={index}
                  ref={el => cardsRef.current[index] = el}
                  className="product-gsap-card"
                >
                  <Producitem product={product}/>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ProductList