import React, { memo } from 'react'

const CountDown = ({unit, number}) => {
  return (
    <div className='w-[30%] h-[60px] bg-gray-100 rounded-sm flex flex-col items-center justify-center'>
        <span className='text-[18px] text-gray-800'>{number}</span>
        <span className='text-xs text-gray-700'>{unit}</span>
    </div>
  )
}

export default memo(CountDown)