import React, { useEffect } from 'react'
import payment from '../../assets/payment.svg'
import { useSelector } from 'react-redux'
import { formatMoney, formatPrice } from '../../ultils/helper'
import { InputForm, Paypal } from '../../components'
import withBase from '../../hocs/withBase'
import { apiCreateOrder } from '../../apis'
import { toast } from "react-toastify";
import path from "../../ultils/path";
import { clearCart } from "../../store/user/userSlice";

const Checkout = ({ navigate, dispatch }) => {
    const { currentCart, current } = useSelector(state => state.user)
    console.log(currentCart)
    const handlePayment = async () => {
        const response = await apiCreateOrder({
            products: currentCart,
            total: currentCart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0),
            address: current?.address,
            payment: 'Payment on delivery',
        })
        if (response.success) {
            dispatch(clearCart({ currentCart: [] }))
            toast.success('Order success! Your order is delivering!')
            navigate(`/${path.MEMBER}/${path.HISTORY}`)
        }
    }
    return (
        <div className='p-6 w-full grid grid-cols-10 h-full max-h-screen overflow-y-auto gap-6 '>
            <div className='w-full flex flex-col justify-center items-center col-span-4'>
                <div onClick={() => navigate('/')} >
                    <span className='text-[48px] text-main font-semibold cursor-pointer'>HQC</span>
                    <span className='text-[32px] cursor-pointer'>Store</span>
                </div>
                <img src={payment} alt="payment" className='h-[70%] object-contain' />
            </div>
            <div className='flex w-full flex-col justify-center gap-6 col-span-6'>
                <h2 className='text-2xl font-bold'>Checkout your order</h2>
                <div className='flex w-full gap-6 justify-between'>
                    <div className='flex-1'>
                        <table className='table-auto h-fit'>
                            <thead>
                                <tr className='border bg-gray-200'>
                                    <th className='text-left p-2 border-r border-white'>Product</th>
                                    <th className='text-center p-2 border-r border-white'>Color</th>
                                    <th className='text-center p-2 border-r border-white'>Quantity</th>
                                    <th className='text-center p-2 border-r'>Price(VND)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCart?.map(el => (
                                    <tr key={el._id} className='border'>
                                        <td className='text-left p-2 border-r'>{el?.product.title}</td>
                                        <td className='text-center p-2 border-r'>{el?.color}</td>
                                        <td className='text-center p-2 border-r'>{el?.quantity}</td>
                                        <td className='text-center p-2'>{`${formatMoney(el?.price)}`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='flex-1 flex flex-col justify-between gap-[45px]'>
                        <div className='flex flex-col gap-4'>
                            <span className='flex gap-4 text-sm items-end'>
                                <span>Total:</span>
                                <span className='text-main text-base font-bold'>{`${formatMoney(currentCart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0))} VND`}</span>
                            </span>
                            <span className='flex gap-4 text-sm items-end'>
                                <span>Address:</span>
                                <span className='text-main text-base font-bold'>{current?.address}</span>
                            </span>
                        </div>
                        <div className='w-full '>
                            <div
                                onClick={() => handlePayment()}
                                className='bg-blue-500 px-2 py-3 rounded-sm mb-3 text-center font-semibold text-white cursor-pointer'>
                                Payment on delivery
                            </div>
                            <Paypal
                                payload={{
                                    products: currentCart,
                                    total: currentCart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0),
                                    address: current?.address,
                                    payment: 'Completely payment',
                                }}
                                amount={Math.round(+currentCart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0) / 23500)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withBase(Checkout)