import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { BreadCrumbs, CartItem, Button } from '../../components'
import withBase from '../../hocs/withBase'
import { formatMoney } from '../../ultils/helper'
import icons from '../../ultils/icons'
import { updateCart } from '../../store/user/userSlice'
import path from '../../ultils/path'
import Swal from 'sweetalert2'
import { createSearchParams } from 'react-router-dom'

const { ImBin } = icons

const DetailCart = ({ location, dispatch, navigate }) => {
    // console.log(location.pathname)
    const { current, currentCart } = useSelector(state => state.user)

    const handleChangeQuantity = (pid, quantity, color) => {
        console.log({ pid, quantity, color })
        dispatch(updateCart({ pid, quantity, color }))
    }
    const handleOnClick = () => {
        if (!current?.address) {
            return Swal.fire({
                icon: 'info',
                title: 'Almost!',
                text: 'Please update your address before checkout',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Go Update',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate({
                        pathname: `/${path.MEMBER}/${path.PERSONAL}`,
                        search: createSearchParams({ redirect: location.pathname }).toString()
                    })
                }
            })
        } else {
            navigate(`/${path.CHECKOUT}`)
        }
    }

    console.log(currentCart)
    return (
        <div>
            <div className='flex flex-col justify-start w-main'>
                <h3 className='text-2xl font-bold tracking-tight my-2'>CART</h3>
                <BreadCrumbs category={location?.pathname?.replace('/', '')?.split('-')?.join(' ')} />
            </div>
            <div className='flex flex-col border w-main mx-auto my-8'>
                {currentCart.length > 0 && <div className='w-main mx-auto grid font-bold grid-cols-10 py-3 bg-gray-200 opacity-80 border'>
                    <div className='col-span-6 w-full text-center'>Product</div>
                    <div className='col-span-1 w-full text-center'>Quantity</div>
                    <div className='col-span-2 w-full text-center'>Price</div>
                    <div className='col-span-1 w-full text-center'>Action</div>
                </div>}
                {currentCart.length === 0 && <span className='flex items-center justify-center font-bold text-lg'>Cart is empty!</span>}
                {currentCart?.map(el => (
                    <div key={el._id}>
                        {/* <div className='col-span-6 w-full'>
                        <div className='flex gap-2 pl-2'>
                            <img src={el.product?.thumb} alt="thumb" className='w-28 h-28 object-cover' />
                            <div className='flex flex-col gap-1'>
                                <span className=''>{el.product?.title}</span>
                                <span className='text-[14px]'>{el.color}</span>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1 w-full flex items-center justify-center'>
                        <div className='flex items-center justify-center'>
                            <SelectQuantity quantity={quantity} handleQuantity={handleQuantity} handleMinus={handleMinus} handlePlus={handlePlus} />
                        </div>
                    </div>
                    <div className='col-span-2 w-full text-center flex items-center justify-center'>{formatMoney(el.product?.price)}</div>
                    <div className='col-span-1 w-full text-center flex items-center justify-center'>
                        <span className='hover:text-main cursor-pointer'>
                            <ImBin />
                        </span>
                    </div> */}
                        <CartItem
                            product={el}
                            handleChangeQuantity={handleChangeQuantity}
                            defaultQuantity={el.quantity} />
                    </div>
                ))}
            </div>
            {currentCart.length !== 0 && <div className='mx-auto flex flex-col mb-4 justify-center items-end gap-3'>
                <span className='flex items-center gap-4'>
                    <span>Total:</span>
                    <span className='text-main font-bold'>{`${formatMoney(currentCart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0))}`}</span>
                </span>
                <Button name='Check out' handleOnClick={handleOnClick} />
            </div>}
        </div>
    )
}

export default withBase(DetailCart)