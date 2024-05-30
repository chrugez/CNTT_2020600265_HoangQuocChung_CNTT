import React, { memo } from 'react'
import { useForm } from "react-hook-form";
import { InputForm, Select } from '..'
import { showModal } from '../../store/app/appSlice'
import { useDispatch } from 'react-redux';
import { apiUpdateStatus, apiUpdateUser } from '../../apis';
import { toast } from 'react-toastify'
import { option, statusOrder } from '../../ultils/constants'

const FormOrder = ({ editEl, reRender }) => {
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        status: ''
    });
    const onSubmit = async (data) => {
        const response = await apiUpdateStatus(data, editEl._id)
        console.log(response);
        // dispatch(showModal({ isShowModal: false, modalChildren: null }))
        if (response.success) {
            reRender()
            toast.success(response.mes)
        } else toast.error(response.mes)
    };
    return (
        <div
            onClick={e => e.stopPropagation()}
        >
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                {/* <InputForm
                    register={register}
                    errors={errors}
                    id={'email'}
                    label={'email'}
                    defaultValue={editEl?.email}
                    validate={{
                        required: 'Required',
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Invalid email!"
                        }
                    }}
                    f1
                />
                <InputForm
                    register={register}
                    errors={errors}
                    id={'firstName'}
                    label={'firstName'}
                    defaultValue={editEl?.firstName}
                    validate={{
                        required: 'Required',
                        // pattern: {
                        //     value: /\S+@\S+\.\S+/,
                        //     message: "Invalid email!"
                        // }
                    }}
                    f1
                />
                <InputForm
                    register={register}
                    errors={errors}
                    id={'lastName'}
                    label={'lastName'}
                    defaultValue={editEl?.lastName}
                    validate={{
                        required: 'Required',
                        // pattern: {
                        //     value: /\S+@\S+\.\S+/,
                        //     message: "Invalid email!"
                        // }
                    }}
                    f1
                />
                <InputForm
                    register={register}
                    errors={errors}
                    id={'mobile'}
                    label={'mobile'}
                    defaultValue={editEl?.mobile}
                    validate={{
                        required: 'Required',
                        pattern: {
                            value: /^(\+\d{1,3}[- ]?)?\d{10}$/,
                            message: "Invalid mobile number!"
                        }
                    }}
                    f1
                /> */}
                <Select
                    register={register}
                    errors={errors}
                    id={'status'}
                    label={'Status'}
                    defaultValue={editEl?.status}
                    options={statusOrder}
                    validate={{
                        required: 'Required',
                        // pattern: {
                        //     value: /\S+@\S+\.\S+/,
                        //     message: "Invalid email!"
                        // }
                    }}
                    f1
                />
                {/* <div className='flex items-center gap-2'>
                <label htmlFor="email">email</label>
                <input
                    id="email"
                    {...register("email", {
                        required: "required",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Entered value does not match email format"
                        }
                    })}
                    type="email"
                />
                {errors.email && <span role="alert">{errors.email.message}</span>}
            </div> */}
                <button type="submit" className='bg-main px-4 py-2 rounded-md text-white font-semibold my-2'>UPDATE</button>
            </form>
        </div>
    )
}

export default memo(FormOrder)