import React, { useEffect, useState } from 'react'
import { apiGetUserOrders } from '../../apis'
import { CustomSelect, InputForm, Pagination } from '../../components'
import { useForm } from 'react-hook-form'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import { formatMoney } from '../../ultils/helper'
import moment from 'moment'
import { statusOrder } from '../../ultils/constants'
import withBase from '../../hocs/withBase'

const History = ({ navigate, location }) => {
    const { register, formState: { errors }, handleSubmit, reset, watch, setValue } = useForm()
    const [order, setOrder] = useState(null)
    const [counts, setCounts] = useState(0)
    const [params] = useSearchParams()
    const q = watch('q')
    const status = watch('status')
    const fetchOrders = async (params) => {
        const response = await apiGetUserOrders({
            ...params,
            limit: +import.meta.env.VITE_LIMIT,
        })
        if (response.success) {
            setCounts(response.counts)
            setOrder(response.orders)
        }
    }

    useEffect(() => {
        const pr = Object.fromEntries([...params])
        fetchOrders(pr)
    }, [params])

    const handleSearchStatus = ({ value }) => {
        navigate({
            pathname: location.pathname,
            search: createSearchParams({ status: value }).toString()
        })
    }

    return (
        <div className='w-full px-4'>
            <header className='text-3xl font-semibold py-4 border-b-2 border-black'>
                Purchase History
            </header>
            <div className='flex w-full justify-end items-center px-4 my-4'>
                <form className='w-[45%]  flex justify-end items-center gap-4'>
                    {/* <div className='col-span-1'>
                        <InputForm
                            id='q'
                            register={register}
                            errors={errors}
                            style={'w-full text-black'}
                            placeholder='Search orders by status, ...'
                        />
                    </div> */}
                    <div className=' flex items-center'>
                        <CustomSelect
                            options={statusOrder}
                            value={status}
                            onChange={val => handleSearchStatus(val)}
                            wrapClassname='w-full'
                        />
                    </div>
                </form>
            </div>
            <div className='px-2'>
                <table className='table-auto mb-6 text-center w-full'>
                    <thead className='font-bold bg-white text-black'>
                        <tr className='border border-white'>
                            <th className='px-4 py-2'>#</th>
                            <th className='px-4 py-2'>OrderId</th>
                            <th className='px-4 py-2'>Products</th>
                            <th className='px-4 py-2'>Total Price(VND)</th>
                            <th className='px-4 py-2'>Status</th>
                            <th className='px-4 py-2'>Address</th>
                            <th className='px-4 py-2'>Payment</th>
                            <th className='px-4 py-2'>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order?.reverse()?.map((el, index) => (
                            <tr key={el._id} className='border border-white'>
                                <td className='px-4 py-2 border-r'>{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * import.meta.env.VITE_LIMIT) + index + 1}</td>
                                <td className='px-4 py-2 border-r'>{el._id}</td>
                                <td className='px-4 py-2 border-r'>
                                    <ul className='list-disc'>
                                        {el?.products?.map((item, index) => (
                                            <li className='text-left' key={index}>{item?.title}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className='px-4 py-2 border-r'>{formatMoney(el.total)}</td>
                                <td className='px-4 py-2 border-r'>{el.status}</td>
                                <td className='px-4 py-2 border-r'>{el.address}</td>
                                <td className='px-4 py-2 border-r'>{el.payment}</td>
                                <td className='px-4 py-2 border-r'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                                {/* <td className='px-4 py-2 border-r'>
                                    <img src={el.thumb} alt="thumb" className='w-12 h-12 object-contain' />
                                </td>
                                <td className='px-4 py-2 border-r'>{el.brand}</td>
                                <td className='px-4 py-2 border-r'>{el.category}</td>
                                <td className='px-4 py-2 border-r'>{formatMoney(el.price)}</td>
                                <td className='px-4 py-2 border-r'>{el.quantity}</td>
                                <td className='px-4 py-2 border-r'>{el?.variant?.length || 0}</td>
                                <td className='px-4 py-2 border-r'>{el.color}</td>
                                <td className='px-4 py-2 border-r'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                                <td className='px-4 py-2 border-r'>
                                    <div className='flex items-center justify-center'>
                                        <span
                                            onClick={() => setEditProduct(el)}
                                            className='px-2 hover:text-blue-600 hover:underline cursor-pointer'>
                                            <FiEdit />
                                        </span>
                                        <span
                                            onClick={() => setCustomVariant(el)}
                                            className='px-2 hover:text-orange-500 hover:underline cursor-pointer'>
                                            <AiOutlineAppstoreAdd />
                                        </span>
                                        <span
                                            onClick={() => handleDelete(el._id)}
                                            className='px-2 hover:text-main hover:underline cursor-pointer'>
                                            <ImBin />
                                        </span>
                                    </div>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='w-full px-2 flex justify-end'>
                <Pagination
                    totalCount={counts}
                    name='orders'
                />
            </div>
        </div>
    )
}

export default withBase(History)