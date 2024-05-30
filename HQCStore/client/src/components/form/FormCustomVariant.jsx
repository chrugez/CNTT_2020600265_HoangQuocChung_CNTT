import React, { memo, useEffect, useState } from 'react'
import { InputForm, Select, MarkdownEditor, Loading } from '../'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { getBase64, validate } from '../../ultils/helper'
import { toast } from 'react-toastify'
import { apiAddVariant, apiUpdateProduct } from '../../apis'
import { showModal } from '../../store/app/appSlice'

const FormCustomVariant = ({ customVariant, render, setCustomVariant }) => {

    const dispatch = useDispatch()

    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm()
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })
    useEffect(() => {
        reset({
            title: customVariant?.title,
            color: customVariant?.color,
            price: customVariant?.price,
        })
    }, [customVariant])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleAddVariant = async (data) => {
        if (data?.color === customVariant?.color) Swal.fire('Oops!', 'Color not changed', 'info')
        else {
            const formData = new FormData()
            for (let i of Object.entries(data)) {
                formData.append(i[0], i[1])
            }
            if (data.thumb) formData.append('thumb', data.thumb[0])
            if (data.images) {
                for (let image of data.images) formData.append('images', image)
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiAddVariant(formData, customVariant._id)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            console.log(response)
            if (response.success) {
                toast.success(response.mes)
                render()
                setPreview({
                    thumb: null,
                    images: []
                })
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
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0) handlePreviewThumb(watch('thumb')[0])
    }, [watch('thumb')])

    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images').length > 0)
            handlePreviewImages(watch('images'))
    }, [watch('images')])

    return (
        <div className='w-full h-full bg-zinc-900 flex flex-col'>
            <div className='p-4 border-b w-full flex justify-between items-center'>
                <h1 className='text-3xl font-bold tracking-tight'>Custom Variant Product</h1>
                <span
                    className='bg-blue-500 px-4 py-2 rounded-md text-white font-semibold my-2 cursor-pointer'
                    onClick={() => setCustomVariant(null)}
                >
                    Back
                </span>
            </div>
            <div className='p-4 bg-zinc-900 '>
                <form onSubmit={handleSubmit(handleAddVariant)}>
                    <InputForm
                        label='Name product'
                        register={register}
                        errors={errors}
                        id='title'
                        style='text-black'
                        readOnly
                    />
                    <div className='w-full flex my-2 gap-4'>
                        <InputForm
                            label='Price Variant (VND)'
                            register={register}
                            errors={errors}
                            id='price'
                            validate={{
                                required: 'Required field'
                            }}
                            placeholder='Price of variant'
                            type='number'
                            style='flex-auto text-black'
                        />
                        <InputForm
                            label='Color Variant'
                            register={register}
                            errors={errors}
                            id='color'
                            validate={{
                                required: 'Required field'
                            }}
                            placeholder='Color of variant'
                            style='flex-auto text-black '
                        />
                    </div>
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
                        <button type="submit" className='bg-main px-4 py-2 rounded-md text-white font-semibold my-2'>Add Variant</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default memo(FormCustomVariant)