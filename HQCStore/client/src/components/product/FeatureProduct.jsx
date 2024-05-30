import React, { memo, useState, useEffect } from 'react'
import { ProductCard } from '..'
import { apiGetProducts } from '../../apis'
import Pbanner1 from '../../assets/Pbanner1.webp'
import Pbanner2 from '../../assets/Pbanner2.avif'
import Pbanner3 from '../../assets/Pbanner3.avif'
import Pbanner4 from '../../assets/Pbanner4.webp'

const FeatureProduct = () => {

    const [products, setProducts] = useState(null)

    const fetchProducts = async () => {
        const response = await apiGetProducts({ limit: 9, sort: '-totalRating' })
        if (response.success) setProducts(response.products)
    }

    useEffect(() => {
        fetchProducts()
    }, [])
    return (
        <div className='w-full'>
            <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>FEATURED PRODUCTS</h3>
            <div className='flex flex-wrap mt-[15px] mx-[-10px]'>
                {products?.map(el => (
                    <ProductCard
                        key={el._id}
                        product={el}
                    />
                ))}
            </div>
            <div className='grid grid-cols-4 grid-rows-2 gap-4'>
                <img src={Pbanner1} alt="banner1" className='w-full h-full object-cover col-span-2 row-span-2' />
                <img src={Pbanner2} alt="banner2" className='w-full h-full object-cover col-span-1 row-span-1' />
                <img src={Pbanner4} alt="banner4" className='w-full h-full object-cover col-span-1 row-span-2' />
                <img src={Pbanner3} alt="banner3" className='w-full h-full object-cover col-span-1 row-span-1' />

            </div>
        </div>
    )
}

export default memo(FeatureProduct)