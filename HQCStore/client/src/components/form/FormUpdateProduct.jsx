import React, { memo, useCallback, useEffect, useState } from 'react'
import { InputForm, Select, MarkdownEditor, Loading } from '../'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { getBase64, validate } from '../../ultils/helper'
import { toast } from 'react-toastify'
import { apiUpdateProduct } from '../../apis'
import { showModal } from '../../store/app/appSlice'

const FormUpdateProduct = ({ editProduct, render, setEditProduct }) => {
    const dispatch = useDispatch()
    const { categories } = useSelector(state => state.app)
    const [payload, setPayload] = useState({
        description: ''
    })
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })
    const [invalidField, setInvalidField] = useState([])
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()

    const changeValue = useCallback((e) => {
        setPayload(e)
    }, [payload])

    const handleUpdateProduct = async (data) => {
        const invalids = validate(payload, setInvalidField)
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el.title === data.category)?.title
            const finalPayload = { ...data, ...payload }
            finalPayload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0]
            const formData = new FormData()
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1])
            }
            finalPayload.images = data.images?.length === 0 ? preview.images : data.images
            for (let image of finalPayload.images) formData.append('images', image)
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiUpdateProduct(formData, editProduct._id)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            console.log(response)
            if (response.success) {
                toast.success(response.mes)
                render()
                setEditProduct(null)
            } else toast.error(response.mes)
        }
    }

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file)
        setPreview(prev => ({ ...prev, thumb: base64Thumb }))
    }

    const handlePreviewImages = async (files) => {
        const imagesPreview = []
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('File is not supported!')
                return
            }
            const base64 = await getBase64(file)
            imagesPreview.push(base64)
        }
        setPreview(prev => ({ ...prev, images: imagesPreview }))
    }

    useEffect(() => {
        reset({
            title: editProduct?.title || '',
            price: editProduct?.price || '',
            quantity: editProduct?.quantity || '',
            color: editProduct?.color || '',
            category: editProduct?.category || '',
            brand: editProduct?.brand?.toUpperCase() || '',
        })
        setPayload({ description: typeof editProduct?.description === 'object' ? editProduct?.description?.join(', ') : editProduct?.description })
        setPreview({
            thumb: editProduct?.thumb || '',
            images: editProduct?.images || []
        })
    }, [editProduct])

    useEffect(() => {
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0) handlePreviewThumb(watch('thumb')[0])
    }, [watch('thumb')])

    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images').length > 0)
            handlePreviewImages(watch('images'))
    }, [watch('images')])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    console.log(editProduct)
    return (
        <div className='w-full bg-zinc-900 flex flex-col'>
            <div className='p-4 border-b w-full flex justify-between items-center'>
                <h1 className='text-3xl font-bold tracking-tight'>Update Product</h1>
                <span
                    className='bg-blue-500 px-4 py-2 rounded-md text-white font-semibold my-2 cursor-pointer'
                    onClick={() => setEditProduct(null)}
                >
                    Back
                </span>
            </div>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleUpdateProduct)}>
                    <InputForm
                        label='Name product'
                        register={register}
                        errors={errors}
                        id='title'
                        validate={{
                            required: 'Required field'
                        }}
                        placeholder='Name of new product'
                        style='text-black'
                    />
                    <div className='w-full flex my-2 gap-4'>
                        <InputForm
                            label='Price (VND)'
                            register={register}
                            errors={errors}
                            id='price'
                            validate={{
                                required: 'Required field'
                            }}
                            placeholder='Price of new product'
                            type='number'
                            style='flex-auto text-black'
                        />
                        <InputForm
                            label='Quantity'
                            register={register}
                            errors={errors}
                            id='quantity'
                            validate={{
                                required: 'Required field'
                            }}
                            placeholder='Quantity of new product'
                            type='number'
                            style='flex-auto text-black'
                        />
                        <InputForm
                            label='Color'
                            register={register}
                            errors={errors}
                            id='color'
                            validate={{
                                required: 'Required field'
                            }}
                            placeholder='Color of new product'
                            style='flex-auto text-black '
                        />
                    </div>
                    <div className='flex my-2 gap-4'>
                        <Select
                            label='Category'
                            options={categories?.map(el => ({ code: el.title, value: el.title }))}
                            register={register}
                            errors={errors}
                            id='category'
                            validate={{
                                required: 'Required field'
                            }}
                            style='flex-auto text-black '
                        />
                        <Select
                            label='Brand (Optional)'
                            options={categories?.find(el => el.title === watch('category'))?.brand?.map(el => ({ code: el.toUpperCase(), value: el }))}
                            register={register}
                            errors={errors}
                            id='brand'
                            style='flex-auto text-black '
                        />
                    </div>
                    <MarkdownEditor
                        name='description'
                        changeValue={changeValue}
                        label='Description'
                        invalidField={invalidField}
                        setInvalidField={setInvalidField}
                        value={payload.description}
                    />
                    <div className='flex flex-col gap-2 mt-4'>
                        <label htmlFor="thumb">Upload thumb</label>
                        <input
                            type="file"
                            id='thumb'
                            {...register('thumb')}
                        />
                        {errors['thumb'] && <span role="alert" className='text-red-500 text-xs'>{errors['thumb']?.message}</span>}
                    </div>
                    {preview.thumb && <div className='my-4 '>
                        <img src={preview.thumb} alt="thumbnail" className='w-[200px] object-contain ' />
                    </div>}
                    <div className='flex flex-col gap-2 mt-4'>
                        <label htmlFor="images">Upload images of product</label>
                        <input
                            type="file"
                            id='images'
                            {...register('images')}
                            multiple
                        />
                        {errors['images'] && <span role="alert" className='text-red-500 text-xs'>{errors['images']?.message}</span>}
                    </div>
                    {preview.images.length > 0 && <div className='my-4 flex w-full gap-2 flex-wrap'>
                        {preview.images?.map((el, index) => (
                            <div
                                className='w-fit relative'
                                key={index}
                            >
                                <img src={el} alt="product" className='w-[200px] object-contain ' />
                            </div>
                        ))}
                    </div>}
                    <div className='mt-4'>
                        <button type="submit" className='bg-main px-4 py-2 rounded-md text-white font-semibold my-2'>Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default memo(FormUpdateProduct)