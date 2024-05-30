import icons from '../../ultils/icons'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import path from '../../ultils/path'
import { memo, useEffect, useState } from 'react'
import withBase from '../../hocs/withBase'
import { logout, clearMessage } from '../../store/user/userSlice'
import { showCart } from '../../store/app/appSlice'

const { FaPhoneAlt, MdEmail, FaShoppingCart, FaUserCircle } = icons

const Header = ({ dispatch, navigate }) => {
  const { current } = useSelector(state => state.user)
  // const dispatch = useDispatch()
  const [option, setOption] = useState(false)

  useEffect(() => {
    const handleClickOut = (e) => {
      const profile = document.getElementById('profile')
      if (!profile?.contains(e.target)) setOption(false)
    }
    document.addEventListener('click', handleClickOut)
    return () => {
      document.removeEventListener('click', handleClickOut)
    }
  }, [])
  return (
    <div className="w-main flex justify-between h-[110px] py-[35px]">
      <Link to={`${path.HOME}`}>
        {/* <img src={logo} alt="logo" className='w-[234px] object-contain' /> */}
        <span className='font-bold text-main text-[32px]'>HQC</span>
        <span className='font-semibold text-gray-800 text-[24px]'>STORE</span>
      </Link>
      <div className='flex text-[13px]'>
        <div className='flex flex-col items-center px-4 border-r'>
          <span className='flex items-center gap-2'>
            <FaPhoneAlt color='red' />
            <span className='font-semibold'>(+84) 365892986</span>
          </span>
          <span>
            Mon-Sat: 9:00Am - 8:00PM
          </span>
        </div>
        <div className='flex flex-col items-center px-4 border-r'>
          <span className='flex items-center gap-2'>
            <MdEmail color='red' />
            <span className='font-semibold'>HOANGCHUNG.WORK@GMAIL.COM</span>
          </span>
          <span>
            Online Support 24/7
          </span>
        </div>
        {current && <>
          <div
            onClick={() => {
              // dispatch(showCart({ isShowCart: true }))
              navigate(path.DETAILCART)
            }}
            className='flex items-center gap-2 px-4 border-r cursor-pointer'>
            <FaShoppingCart color='red' />
            <span className=''>{`${current?.cart?.length || 0} ${current?.cart?.length > 1 ? 'items' : 'item'}`}</span>
          </div>
          <div
            className='flex justify-center items-center px-4 gap-2 cursor-pointer relative'
            onClick={() => setOption(pre => !pre)
            }
            id='profile'
          >
            <FaUserCircle size={24} color='red' />
            <span className=''>Profile</span>
            {option && <div onClick={e => e.stopPropagation()} className='absolute top-full flex flex-col left-0 border py-2 min-w-[200px] bg-gray-100 z-50'>
              <Link className='p-2 w-full hover:bg-red-100' to={`/${path.MEMBER}/${path.PERSONAL}`}>Personal</Link>
              {+current.role === 0 &&
                <Link className='p-2 w-full hover:bg-red-100' to={`/${path.ADMIN}/${path.DASHBOARD}`}>Dashboard</Link>}
              <span onClick={() => dispatch(logout())} className='p-2 w-full hover:bg-red-100'>Logout</span>
            </div>}
          </div>
        </>}
      </div>
    </div>
  )
}

export default withBase(memo(Header))

