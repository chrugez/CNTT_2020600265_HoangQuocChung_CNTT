import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import path from '../../ultils/path'
import { useSelector } from 'react-redux'
import { MemberSidebar } from '../../components'

const MemberLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user)
    if (!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true} />
    return (
        <div className='flex w-full min-h-screen relative text-black'>
            <div className='flex w-[300px] flex-none fixed top-0 bottom-0'>
                <MemberSidebar />
            </div>
            <div className='w-[300px] flex-none'></div>
            <div className='flex-auto bg-gray-100'>
                <Outlet />
            </div>
        </div>
    )
}

export default MemberLayout