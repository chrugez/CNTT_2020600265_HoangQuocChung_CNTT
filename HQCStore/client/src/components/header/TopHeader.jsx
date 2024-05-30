import React, { memo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import path from '../../ultils/path'
import { getCurrent } from '../../store/user/asyncActions'
import { useDispatch, useSelector } from 'react-redux'
import icons from '../../ultils/icons'
import { logout, clearMessage } from '../../store/user/userSlice'
import Swal from 'sweetalert2'

const { FiLogOut } = icons

const TopHeader = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoggedIn, current, mes } = useSelector(state => state.user)

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent())
    }, 300)

    return () => {
      clearTimeout(setTimeoutId)
    }
  }, [dispatch, isLoggedIn])

  useEffect(() => {
    if (mes) Swal.fire('Oops!', mes, 'info').then(() => {
      dispatch(clearMessage())
      navigate(`/${path.LOGIN}`)
    })
  }, [mes])
  return (
    <div className='h-[38px] bg-main w-full flex justify-center items-center'>
      <div className='w-main flex items-center justify-between text-xs text-white'>
        <span>ORDER ONLINE OR CALL US (+84) 365892986</span>
        {isLoggedIn && current
          ? <div className='flex items-center gap-2'>
            <span>Welcome</span>
            <span className='font-semibold text-[14px]'>{current?.lastName} {current?.firstName}</span>
            <span
              className='hover:bg-white hover:text-main hover:rounded-md cursor-pointer p-2'
              onClick={() => {
                dispatch(logout())
                navigate(`/`)
              }}
            >
              <FiLogOut size={18} />
            </span>
          </div>
          : <Link to={`/${path.LOGIN}`} className='hover:text-black'>Login or Register</Link>}
      </div>
    </div>
  )
}

export default memo(TopHeader)