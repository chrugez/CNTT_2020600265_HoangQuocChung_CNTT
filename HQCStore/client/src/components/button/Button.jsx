import React, { memo } from 'react'

const Button = ({name, handleOnClick, style, iconBefore, iconAfter, fw}) => {
  return (
    <button
    type='button'
    className={style ? style : `px-4 py-2 rounded-md text-white bg-main font-semibold ${fw ? 'w-full' : 'w-fit'} my-2`}
    onClick={()=>{handleOnClick && handleOnClick()}}
    >
        {iconBefore && iconBefore}
        <span>{name}</span>
        {iconAfter && iconAfter}
    </button>
  )
}

export default memo(Button)