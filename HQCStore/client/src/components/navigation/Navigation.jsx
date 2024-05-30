import { memo } from 'react'
import { navigation } from '../../ultils/constants'
import { NavLink } from 'react-router-dom'

const Navigation = () => {
  return (
    <div className="w-main text-sm flex items-center h-[48px] py-2 border-y mb-4">
      {navigation.map(el => (
        <NavLink
          to={el.path}
          key={el.id}
          className={({ isActive }) => isActive ? 'pr-12 hover:text-main text-main' : 'pr-12 hover:text-main'}
        >
          {el.value}
        </NavLink>
      ))}
    </div>
  )
}

export default memo(Navigation)