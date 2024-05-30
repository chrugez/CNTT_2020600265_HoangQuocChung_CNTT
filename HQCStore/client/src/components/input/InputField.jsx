import React, { memo } from 'react'
import clsx from 'clsx'

const InputField = ({ value, setValue, nameKey, type, placeholder, invalidFields, setInvalidFields, style, isHideLabel }) => {
  return (
    <div className={clsx('relative flex flex-col mb-2', style)}>
      {!isHideLabel && value.trim() !== '' && <label
        className='text-sm absolute top-0 left-[12px] block bg-white px-1'
        htmlFor={nameKey}>
        {nameKey.slice(0, 1).toUpperCase() + nameKey.slice(1)}
      </label>}
      <input
        type={type || 'text'}
        className='px-4 py-2 rounded-sm border w-full mt-2 placeholder:text-sm placeholder:italic outline-none'
        placeholder={placeholder || nameKey.slice(0, 1).toUpperCase() + nameKey.slice(1)}
        value={value}
        onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
        onFocus={() => setInvalidFields && setInvalidFields([])}
      />
      {invalidFields?.some(el => el.name === nameKey) &&
        <span className='text-[10px] text-main italic'>{invalidFields.find(el => el.name === nameKey)?.mes}</span>}
    </div>
  )
}

export default memo(InputField)