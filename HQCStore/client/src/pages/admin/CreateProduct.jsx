import React from 'react'
import { FormCreateProduct } from '../../components'

const CreateProduct = () => {
    return (
        <div className='w-full'>
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b-2'>
                <span>Create New Product</span>
            </h1>
            <div className='p-4'>
                <FormCreateProduct />
            </div>
        </div>
    )
}

export default CreateProduct