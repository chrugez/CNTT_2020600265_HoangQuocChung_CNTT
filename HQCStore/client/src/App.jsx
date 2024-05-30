import { Route, Routes } from 'react-router-dom'
import { Home, Login, Public, FAQ, Services, Blog, DetailProduct, Products, FinalRegister, ResetPassword, DetailCart } from './pages/public'
import { AdminLayout, CreateProduct, Dashboard, ManageOrder, ManageProduct, ManageUser } from './pages/admin'
import { MemberLayout, MyCart, Personal, History, WishList, Checkout } from './pages/member'
import path from './ultils/path'
import { getCategories } from './store/app/asyncActions'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cart, Modal } from './components'

function App() {
  const dispatch = useDispatch()
  const { isShowModal, modalChildren, isShowCart } = useSelector(state => state.app)
  useEffect(() => {
    dispatch(getCategories())
  }, [])
  return (
    <div className='min-h-screen font-main relative'>
      {/* {isShowCart && <div
        onClick={() => dispatch(showCart({ isShowCart: false }))}
        className='absolute inset-0 bg-overlay z-50 flex justify-end'>
        <Cart />
      </div>} */}
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blog />} />
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.DETAILCART} element={<DetailCart />} />
          <Route path={path.OUR_SERVICES} element={<Services />} />
          <Route path={path.PRODUCTS__CATEGORY} element={<Products />} />
          <Route path={path.ALL} element={<Home />} />
        </Route>
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
          <Route path={path.MANAGE_PRODUCT} element={<ManageProduct />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
        </Route>
        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
          <Route path={path.MYCART} element={<MyCart />} />
          <Route path={path.HISTORY} element={<History />} />
          <Route path={path.WISHLIST} element={<WishList />} />
        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.CHECKOUT} element={<Checkout />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      {/* Same as */}
      <ToastContainer />
    </div>
  )
}

export default App
