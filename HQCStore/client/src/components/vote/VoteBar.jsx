import React, { memo, useRef, useEffect } from 'react'
import icons from '../../ultils/icons'

const { MdStar, MdStarOutline } = icons

const VoteBar = ({ number, ratingCount, ratingTotal }) => {
    const percentRef = useRef()

    useEffect(() => {
        const percent = Math.round(ratingCount * 100 / ratingTotal) || 0
        percentRef.current.style.cssText = `right: ${100 - percent}%`
    }, [ratingCount, ratingTotal])
    return (
        <div className='flex items-center gap-2 text-sm text-gray-700'>
            <div className='flex flex-1 items-center justify-center gap-1 text-sm'>
                <span>{number}</span>
                <MdStar color='orange' />
            </div>
            <div className='flex-7'>
                <div className='w-full h-2 bg-gray-200 rounded-l-full rounded-r-full relative'>
                    <div ref={percentRef} className='absolute inset-0 bg-red-500 rounded-l-full rounded-r-full right-2'></div>
                </div>
            </div>
            <div className='flex-2 text-xs text-gray-500 flex justify-center'>{`${ratingCount || 0} reviewers`}</div>
        </div>
    )
}

export default memo(VoteBar)