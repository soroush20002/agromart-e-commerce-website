'use client'
import React, { useEffect, useRef } from 'react'
import Producitem from './Producitem'
import gsap from 'gsap'

function ProductList({ productList, slicenum }) {
  const sliderRef = useRef(null)

  const sortedProducts = [...productList].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  )
  const productListo = sortedProducts.slice(0, slicenum)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = sliderRef.current
      const totalWidth = container.scrollWidth / 2 


      gsap.to(container, {
        x: `-${totalWidth}px`,
        duration: 20,
        ease: 'linear',
        repeat: -1,
      })

   
      const pause = () => gsap.globalTimeline.pause()
      const play = () => gsap.globalTimeline.play()

      container.addEventListener('mouseenter', pause)
      container.addEventListener('mouseleave', play)

      return () => {
        container.removeEventListener('mouseenter', pause)
        container.removeEventListener('mouseleave', play)
      }
    }, sliderRef)

    return () => ctx.revert()
  }, [productList])

  const duplicatedList = [...productListo, ...productListo] 

  return (
    <div className="relative w-full overflow-hidden h-[340px] mt-0">
      <div
        ref={sliderRef}
        className="absolute flex flex-row gap-5 left-0 top-0 product-scroll-horizontal"
      >
        {duplicatedList.map((product, index) => (
          <div key={index} className="product-gsap-card w-[200px]">
            <Producitem product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList
