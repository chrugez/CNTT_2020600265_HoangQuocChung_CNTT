import React, { memo, useState, useEffect } from 'react'
import icons from '../../ultils/icons'

const { IoArrowUpSharp } = icons

const ScrollToTop = () => {
    const [scrollTop, setscrollTop] = useState(false)

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                setscrollTop(true)
            } else {
                setscrollTop(false)
            }
        })
    }, [])

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
    return (
        <div className='relative'>
            {scrollTop && <button onClick={scrollUp} className='p-2 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 fixed bottom-10 right-10'>
                <IoArrowUpSharp size={24} />
            </button>}
        </div>
    )
}

export default memo(ScrollToTop)