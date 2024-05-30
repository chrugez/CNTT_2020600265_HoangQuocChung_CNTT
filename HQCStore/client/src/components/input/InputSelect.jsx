import React, { memo } from 'react'

const InputSelect = ({ value, changeValue, options }) => {
    return (
        <select
            className='p-3 text-gray-500 border gap-2 border-gray-800 flex justify-between items-center text-xs cursor-pointer'
            value={value}
            onChange={e => changeValue(e.target.value)}
        >
            <option value="">Featured</option>
            {options?.map(el => (
                <option key={el.id} value={el.value}>{el.text}</option>
            ))}
        </select>
    )
}

export default memo(InputSelect)