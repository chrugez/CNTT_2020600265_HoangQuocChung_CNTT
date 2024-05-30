import React, { memo, useState } from 'react'
import { adminSidebar } from '../../ultils/constants'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import icons from '../../ultils/icons'

const { FaCaretDown, FaCaretUp } = icons

const activedStyle = 'px-4 py-2 flex items-center gap-2 text-gray-200 bg-gray-500'
const notActiveStyle = 'px-4 py-2 flex items-center gap-2 text-gray-200 hover:bg-gray-600'

const AdminSidebar = () => {
    const [actived, setActived] = useState([])

    const handleShowTabs = (tabID) => {
        if (actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el !== tabID))
        else setActived(prev => [...prev, tabID])
    }
    return (
        <div className='py-4 bg-zinc-700 h-full'>
            <Link to={`/`} className='flex flex-col justify-center p-4 items-center'>
                <span>
                    <span className='text-[48px] text-main'>HQC</span>
                    <span className='text-[32px] '>Store</span>
                </span>
                <small>Admin Workspace</small>
            </Link>
            <div>
                {adminSidebar.map(el => (
                    <div key={el.id}>
                        {el.type === 'single' &&
                            <NavLink
                                to={el.path}
                                className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActiveStyle)}
                            >
                                <div className='flex items-center gap-2'>
                                    <span>{el.icon}</span>
                                    <span>{el.text}</span>
                                </div>
                            </NavLink>}
                        {el.type === 'parent' && <div onClick={() => handleShowTabs(el.id)} className='flex text-gray-200 flex-col'>
                            <div className='flex items-center justify-between cursor-pointer px-4 py-2 hover:bg-gray-600'>
                                <div className='flex items-center gap-2'>
                                    <span>{el.icon}</span>
                                    <span>{el.text}</span>
                                </div>
                                {!actived.some(id => id === el.id) ? <FaCaretDown size={24} /> : <FaCaretUp size={24} />}
                            </div>
                            {actived.some(id => id === el.id) && <div
                                className='flex flex-col pl-4 '
                            >
                                {el.submenu.map(item => (
                                    <NavLink
                                        key={item.text}
                                        to={item.path}
                                        className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActiveStyle)}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        {item.text}
                                    </NavLink>
                                ))}
                            </div>}
                        </div>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(AdminSidebar)