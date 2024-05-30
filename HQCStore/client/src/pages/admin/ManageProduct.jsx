import React, { useCallback, useEffect, useState } from 'react'
import { InputForm, Pagination, FormUpdateProduct, FormCustomVariant } from '../../components'
import { useForm } from 'react-hook-form'
import { apiGetProducts, apiDeleteProduct } from '../../apis'
import { formatMoney } from '../../ultils/helper'
import { useSearchParams, useNavigate, createSearchParams, useLocation } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'
import moment from 'moment'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import icons from '../../ultils/icons'

const { AiOutlineAppstoreAdd, ImBin, FiEdit } = icons

const ManageProduct = () => {

    const { register, formState: { errors }, handleSubmit, reset, watch } = useForm()
    const [products, setProducts] = useState(null)
    const [counts, setCounts] = useState(0)
    const [editProduct, setEditProduct] = useState(null)
    const [customVariant, setCustomVariant] = useState(null)
    const [update, setUpdate] = useState(false)
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()
    const queryDebounce = useDebounce(watch('q'), 1000)

    const render = useCallback(() => {
        setUpdate(!update)
    }, [update])

    const fetchProducts = async (params) => {
        const response = await apiGetProducts({ ...params, limit: +import.meta.env.VITE_LIMIT })
        if (response.success) {
            setCounts(response.counts)
            setProducts(response.products)
        }
    }

    const handleDelete = async (pid) => {
        Swal.fire({
            title: "Do you want to delete this product?",
            showCancelButton: true,
            confirmButtonText: "Delete",
            icon: 'question'
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const response = await apiDeleteProduct(pid)
                render()
                toast.success(response.mes)
            }
        })
    }

    useEffect(() => {
        if (queryDebounce) {
            navigate({
                path: location.pathname,
                search: createSearchParams({ q: queryDebounce }).toString()
            })
        } else navigate({ path: location.pathname })
    }, [queryDebounce])

    useEffect(() => {
        const searchParams = Object.fromEntries([...params])
        fetchProducts(searchParams)
    }, [params, update])

    return (
        <div className='w-full flex flex-col relative'>
            {editProduct && <div className='w-full absolute inset-0 z-10'>
                <FormUpdateProduct editProduct={editProduct} render={render} setEditProduct={setEditProduct} />
            </div>}
            {customVariant && <div className='w-full absolute inset-0 z-10'>
                <FormCustomVariant customVariant={customVariant} render={render} setCustomVariant={setCustomVariant} />
            </div>}
            <div className='p-4 border-b w-full flex justify-between items-center'>
                <h1 className='text-3xl font-bold tracking-tight'>Manage Product</h1>
            </div>
            <div className='flex w-full justify-end px-4 my-4'>
                <form className='w-[45%]'>
                    <InputForm
                        id='q'
                        register={register}
                        errors={errors}
                        style={'w-full text-black'}
                        placeholder='Search products by title, brand or category'
                    />
                </form>
            </div>
            <div className='px-2'>
                <table className='table-auto mb-6 text-center w-full'>
                    <thead className='font-bold bg-white text-black'>
                        <tr className='border border-white'>
                            <th className='px-4 py-2'>#</th>
                            <th className='px-4 py-2'>Title</th>
                            <th className='px-4 py-2'>Thumb</th>
                            <th className='px-4 py-2'>Brand</th>
                            <th className='px-4 py-2'>Category</th>
                            <th className='px-4 py-2'>Price(VND)</th>
                            <th className='px-4 py-2'>Quantity</th>
                            <th className='px-4 py-2'>Variants</th>
                            <th className='px-4 py-2'>Default Color</th>
                            <th className='px-4 py-2'>Created At</th>
                            <th className='px-4 py-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map((el, index) => (
                            <tr key={el._id} className='border border-white bg-gray-500'>
                                <td className='px-4 py-2 border-r'>{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * import.meta.env.VITE_LIMIT) + index + 1}</td>
                                <td className='px-4 py-2 border-r'>{el.title}</td>
                                <td className='px-4 py-2 border-r'>
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* {counts >= import.meta.env.VITE_LIMIT && <div className='w-full px-2 flex justify-end'>
                <Pagination
                    totalCount={counts}
                />
            </div>} */}
            <div className='w-full px-2 flex justify-end'>
                <Pagination
                    totalCount={counts}
                    name='products'
                />
            </div>
        </div>
    )
}

export default ManageProduct