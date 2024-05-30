import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { InputForm } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import avatar from '../../assets/no-avatar.png'
import { apiUpdateCurrent } from '../../apis'
import { getCurrent } from '../../store/user/asyncActions'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Personal = () => {
    const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { current } = useSelector(state => state.user)
    useEffect(() => {
        reset({
            firstName: current?.firstName,
            lastName: current?.lastName,
            mobile: current?.mobile,
            email: current?.email,
            avatar: current?.avatar,
            address: current?.address,
        })
    }, [current])

    const handleUpdateInfor = async (data) => {
        const formData = new FormData()
        if (data.avatar.length > 0) {
            formData.append('avatar', data.avatar[0])
        }
        delete data.avatar

        for (let i of Object.entries(data)) formData.append(i[0], i[1])
        const response = await apiUpdateCurrent(formData)
        if (response.success) {
            dispatch(getCurrent())
            toast.success(response.mes)
            if (searchParams.get('redirect')) navigate(searchParams.get('redirect'))
        } else toast.error(response.mes)
        // console.log([...formData])
    }
    return (
        <div className='w-full relative px-4'>
            <header className='text-3xl font-semibold py-4 border-b-2 border-black'>
                Personal Information
            </header>
            <form onSubmit={handleSubmit(handleUpdateInfor)} className='w-3/5 flex flex-col gap-2 mx-auto py-4'>
                <InputForm
                    label='Email'
                    register={register}
                    errors={errors}
                    id='email'
                    validate={{
                        required: 'Required field'
                    }}
                    f1
                    readOnly
                    style='flex-auto text-black '
                />
                <div className='flex gap-4'>
                    <InputForm
                        label='FirstName'
                        register={register}
                        errors={errors}
                        id='firstName'
                        validate={{
                            required: 'Required field'
                        }}
                        f1
                        style='flex-auto text-black '
                    />
                    <InputForm
                        label='LastName'
                        register={register}
                        errors={errors}
                        id='lastName'
                        validate={{
                            required: 'Required field'
                        }}
                        f1
                        style='flex-auto text-black '
                    />
                </div>
                <InputForm
                    label='Mobile'
                    register={register}
                    errors={errors}
                    id='mobile'
                    validate={{
                        required: 'Required field',
                        pattern: {
                            value: /^(\+\d{1,3}[- ]?)?\d{10}$/,
                            message: "Invalid mobile number!"
                        }
                    }}
                    f1
                    style='flex-auto text-black '
                />
                <InputForm
                    label='Address'
                    register={register}
                    errors={errors}
                    id='address'
                    validate={{
                        required: 'Required field'
                    }}
                    f1
                    style='flex-auto text-black '
                />
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Account status:</span>
                    <span>{current?.isBlocked ? 'Blocked' : 'Active'}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Role:</span>
                    <span>{+current?.role === 0 ? 'Admin' : 'User'}</span>
                </div>
                <div className='flex gap-2'>
                    <span className='font-medium'>Profile image:</span>
                    <label htmlFor="file" className='cursor-pointer'>
                        <img src={current?.avatar || avatar} alt="avatar" className='h-20 w-20 rounded-full object-cover' />
                    </label>
                    <input type="file" id='file' {...register('avatar')} hidden />
                </div>
                <div className='flex justify-end'>
                    <button type="submit" className='bg-main px-4 py-2 rounded-md text-white font-semibold my-2'>Update Information</button>
                </div>
            </form>
        </div>
    )
}

export default Personal