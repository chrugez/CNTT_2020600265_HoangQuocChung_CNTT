import React, { memo, useState, useEffect, useCallback } from 'react'
import { formatMoney } from '../../ultils/helper'
import icons from '../../ultils/icons'
import { SelectQuantity } from '../'
import { apiRemoveProductInCart } from '../../apis'
import { toast } from 'react-toastify'
import { getCurrent } from '../../store/user/asyncActions'
import withBase from '../../hocs/withBase'
import { updateCart } from '../../store/user/userSlice'

const { ImBin } = icons

const CartItem = ({ product, dispatch, handleChangeQuantity, defaultQuantity = 1, navigate }) => {

    const [quantity, setQuantity] = useState(() => defaultQuantity)

    const handleQuantity = useCallback((number) => {
        if (!Number(number) || Number(number) < 1) {
            return
        } else {
            setQuantity(number)
        }
        setQuantity(number)
    }, [quantity])

    const handlePlus = useCallback(() => {
        setQuantity(prev => +prev + 1)
    }, [quantity])

    const handleMinus = useCallback(() => {
        if (quantity === 1) return
        setQuantity(prev => +prev - 1)
    }, [quantity])

    const removeProduct = async (pid, color) => {
        // console.log(pid)
        const response = await apiRemoveProductInCart(pid, color)
        if (response.success) {
            toast.success(response.mes)
            dispatch(getCurrent())
        } else toast.error(response.mes)
    }
    // console.log(product)

    useEffect(() => {
        dispatch(updateCart({ pid: product?.product?._id, quantity, color: product?.color }))
        handleChangeQuantity && handleChangeQuantity(product?.product?._id, quantity, product?.color)
    }, [quantity])
    return (
        <div className=' mx-auto grid font-bold grid-cols-10 py-3 border'>
            <div className='col-span-6 w-full'>
                <div className='flex gap-2 pl-2'>
                    <img src={product?.thumbnail || product?.product?.thumb} alt="thumb" className='w-28 h-28 object-cover' />
                    <div className='flex flex-col gap-1'>
                        <span className=''>{product?.product?.title}</span>
                        <span className='text-[14px]'>{product?.color}</span>
                    </div>
                </div>
            </div>
            <div className='col-span-1 w-full flex items-center justify-center'>
                <div className='flex items-center justify-center'>
                    <SelectQuantity quantity={quantity} handleQuantity={handleQuantity} handleMinus={handleMinus} handlePlus={handlePlus} />
                </div>
            </div>
            <div className='col-span-2 w-full text-center flex items-center justify-center'>{formatMoney(product?.price)}</div>
            <div className='col-span-1 w-full text-center flex items-center justify-center'>
                <span
                    onClick={() => removeProduct(product?.product?._id, product?.color)}
                    className='hover:text-main cursor-pointer'>
                    <ImBin />
                </span>
            </div>
        </div>
    )
}

export default withBase(memo(CartItem))