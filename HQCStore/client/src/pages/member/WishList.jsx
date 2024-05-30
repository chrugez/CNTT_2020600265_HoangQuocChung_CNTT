import React from 'react'
import { useSelector } from 'react-redux'
import { Product } from '../../components'

const WishList = () => {
    const { current } = useSelector(state => state.user)
    return (
        <div className='w-full px-4'>
            <header className='text-3xl font-semibold py-4 border-b-2 border-black'>
                WishList
            </header>
            <div className='p-4 w-full grid grid-cols-3 gap-4'>
                {current?.wishlist?.map(el => (
                    <div key={el._id} className='col-span-1'>
                        <Product
                            pid={el._id}
                            productData={el}
                            normal
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WishList