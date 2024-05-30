import React, { memo, useState } from 'react'
import { memberSidebar } from '../../ultils/constants'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import icons from '../../ultils/icons'
import { useSelector } from 'react-redux'
import avatar from '../../assets/no-avatar.png'


const { FaCaretDown, FaCaretUp } = icons

const activedStyle = 'px-4 py-2 flex items-center gap-2 bg-gray-100'
const notActiveStyle = 'px-4 py-2 flex items-center gap-2 hover:bg-gray-200'

const MemberSidebar = () => {
    const [actived, setActived] = useState([])
    const { current } = useSelector(state => state.user)
    const navigate = useNavigate()

    const handleShowTabs = (tabID) => {
        if (actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el !== tabID))
        else setActived(prev => [...prev, tabID])
    }
    return (
        <div className='py-4 bg-orange-400 w-[300px] h-full'>
            <div className='w-full flex flex-col justify-center p-4 items-center'>
                <img src={current?.avatar || avatar} alt="avatar" className='w-20 h-20 object-cover rounded-full' />
                <small className='mt-4'>{`${current?.lastName} ${current?.firstName}`}</small>
            </div>
            <div>
                {memberSidebar.map(el => (
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
                        {el.type === 'parent' && <div onClick={() => handleShowTabs(el.id)} className='flex flex-col'>
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

export default memo(MemberSidebar)