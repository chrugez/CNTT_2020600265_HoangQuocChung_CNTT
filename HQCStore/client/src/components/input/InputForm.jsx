import React, { memo } from 'react'
import clsx from 'clsx'

const InputForm = ({ label, disable, register, errors, id, validate, type = 'text', placeholder, defaultValue, style, f1, readOnly }) => {
    return (
        <div className={clsx('flex flex-col ', style)}>
            {label && <label htmlFor={id} className={f1 ? 'capitalize text-black' : 'capitalize text-white'}>{label}</label>}
            <input
                id={id}
                {...register(id, validate)}
                type={type}
                disabled={disable}
                placeholder={placeholder}
                className={!readOnly ? 'px-4 py-2 rounded-sm border w-full mt-2 placeholder:text-sm placeholder:italic outline-none' : 'px-4 py-2 rounded-sm border w-full mt-2 placeholder:text-sm placeholder:italic outline-none bg-gray-300'}
                defaultValue={defaultValue}
                readOnly={readOnly}
            />
            {errors[id] && <span role="alert" className='text-red-500 text-xs'>{errors[id]?.message}</span>}
        </div>
    )
}

export default memo(InputForm)