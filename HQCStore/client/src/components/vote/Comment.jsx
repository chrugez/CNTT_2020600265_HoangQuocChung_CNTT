import React, { memo } from 'react'
import avatar from '../../assets/no-avatar.png'
import moment from 'moment'
import { renderStarFromNumber } from '../../ultils/helper'

const Comment = ({ image, name, updatedAt, comment, star }) => {
    return (
        <div className='flex gap-4'>
            <div className='flex-none'>
                <img
                    src={image || avatar}
                    alt="avatar"
                    className='w-[25px] h-[25px] object-contain rounded-full'
                />
            </div>
            <div className='flex flex-col flex-auto text-sm'>
                <div className='flex justify-between items-center'>
                    <h3 className='font-semibold'>{name || 'Anonymous'}</h3>
                    <span className='text-xs italic'>{moment(updatedAt).fromNow()}</span>
                </div>
                <div className='flex flex-col gap-2 pl-4 mt-2 border border-gray-300 py-2 bg-gray-100'>
                    <span className='flex items-center gap-1'>
                        <span className='font-semibold'>Rating:</span>
                        <span className='flex items-center gap-1'>{renderStarFromNumber(star)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}</span>
                    </span>
                    <span className='flex gap-1'>
                        <span className='font-semibold'>Comment:</span>
                        <span className='flex items-center gap-1'>{comment}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default memo(Comment)