import React, { memo } from 'react'
import icons from '../../ultils/icons'
import withBase from '../../hocs/withBase'
import { showCart } from '../../store/app/appSlice'
import { useSelector } from 'react-redux'

const { IoIosCloseCircle } = icons

const Cart = ({ dispatch }) => {
    const { current } = useSelector(state => state.user)
    console.log(current)
    return (
        <div
            onClick={e => e.stopPropagation()}
            className='w-[400px] h-screen bg-black overflow-y-auto grid grid-rows-10 text-white p-6'>
            <header className='py-4 border-b font-bold text-2xl flex justify-between row-span-1 h-full'>
                <span>My Cart</span>
                <span
                    onClick={() => dispatch(showCart({ isShowCart: false }))}
                    className='cursor-pointer'>
                    <IoIosCloseCircle />
                </span>
            </header>
            <section className='row-span-6 h-full max-h-full overflow-y-auto'>
                {!current?.cart && <span className='text-xs italic'>Cart is empty!</span>}
                {current?.cart && current?.cart?.map(el => (
                    <div div key={el._id} >
                        {el.product}
                    </div>
                ))}
            </section>
            <div className='row-span-3 h-full'>
                checkout
            </div>
        </div>
    )
}

export default withBase(memo(Cart))