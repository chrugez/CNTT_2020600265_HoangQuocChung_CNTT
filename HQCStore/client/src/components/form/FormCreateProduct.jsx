import React, { memo, useCallback, useEffect, useState } from 'react'
import { InputForm, Select, MarkdownEditor, Loading } from '../'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { getBase64, validate } from '../../ultils/helper'
import { toast } from 'react-toastify'
import { apiCreateProduct } from '../../apis'
import { showModal } from '../../store/app/appSlice'

const FormCreateProduct = () => {
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

    const handleCreateProduct = async (data) => {
        const invalids = validate(payload, setInvalidField)
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el._id === data.category)?.title
            const finalPayload = { ...data, ...payload }
            const formData = new FormData()
            for (let i of Object.entries(finalPayload)) {
                formData.append(i[0], i[1])
            }
            if (finalPayload.thumb) formData.append('thumb', finalPayload.thumb[0])
            if (finalPayload.images) {
                for (let image of finalPayload.images) formData.append('images', image)
            }
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiCreateProduct(formData)
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            if (response.success) {
                toast.success(response.mes)
                reset()
                setPreview({
                    thumb: '',
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
            imagesPreview.push({ name: file.name, path: base64 })
        }
        setPreview(prev => ({ ...prev, images: imagesPreview }))
    }

    useEffect(() => {
        handlePreviewThumb(watch('thumb')[0])
    }, [watch('thumb')])

    useEffect(() => {
        handlePreviewImages(watch('images'))
    }, [watch('images')])

    return (
        <div>
            <form onSubmit={handleSubmit(handleCreateProduct)}>
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
                        options={categories?.map(el => ({ code: el._id, value: el.title }))}
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
                        options={categories?.find(el => el._id === watch('category'))?.brand?.map(el => ({ code: el, value: el }))}
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
                />
                <div className='flex flex-col gap-2 mt-4'>
                    <label htmlFor="thumb">Upload thumb</label>
                    <input
                        type="file"
                        id='thumb'
                        {...register('thumb', { required: 'Required field' })}
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
                        {...register('images', { required: 'Required field' })}
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
                            <img src={el.path} alt="product" className='w-[200px] object-contain ' />
                        </div>
                    ))}
                </div>}
                <div className='mt-4'>
                    <button type="submit" className='bg-main px-4 py-2 rounded-md text-white font-semibold my-2'>CREATE</button>
                </div>
            </form>
        </div>
    )
}

export default memo(FormCreateProduct)