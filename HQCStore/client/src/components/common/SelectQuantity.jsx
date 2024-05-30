import React, { memo } from 'react'

const SelectQuantity = ({quantity, handleQuantity, handlePlus, handleMinus}) => {
  return (
    <div className='flex items-center bg-gray-200'>
        <span onClick={()=>handleMinus()} className='p-2 border-r border-black cursor-pointer hover:bg-black hover:text-white'>-</span>
        <input 
        className='py-2 outline-none w-[50px] bg-gray-200 text-black text-center hover:bg-black hover:text-white' 
        type="text" 
        value={quantity}
        onChange={e=>handleQuantity(e.target.value)}
        />
        <span onClick={()=>handlePlus()} className='p-2 border-l border-black cursor-pointer hover:bg-black hover:text-white'>+</span>
    </div>
  )
}

export default memo(SelectQuantity)