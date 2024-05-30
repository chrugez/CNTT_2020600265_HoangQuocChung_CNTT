import { memo, useState } from 'react'
import label1 from '../../assets/trending.png'
import label2 from '../../assets/new.png'
import { renderStarFromNumber, formatMoney } from "../../ultils/helper"
import { SelectOption } from '..'
import icons from '../../ultils/icons'
import withBase from '../../hocs/withBase'
import Swal from 'sweetalert2'
import path from '../../ultils/path'
import { apiUpdateCart, apiUpdateWishlist } from '../../apis'
import { toast } from 'react-toastify'
import { getCurrent } from '../../store/user/asyncActions'
import { useSelector } from 'react-redux'
import clsx from 'clsx'

const { FaEye, FiMenu, FaHeart, FaShoppingCart, BsCartCheckFill } = icons

const Product = ({ productData, isNew, normal, navigate, dispatch, pid, style }) => {

    const [isShowOption, setIsShowOption] = useState(false)
    const { current } = useSelector(state => state.user)

    const handleClickOptions = async (e, option) => {
        e.stopPropagation()
        if (option === 'DETAIL') navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)
        if (option === 'WISHLIST') {
            const response = await apiUpdateWishlist(pid)
            if (response.success) {
                toast.success(response.mes)
                dispatch(getCurrent())
            } else {
                toast.error(response.mes)
            }
        }
        if (option === 'ADDCART') {
            // console.log(productData)
            if (!current) return Swal.fire({
                title: "Oops!",
                text: "You must login first!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Go Login"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/${path.LOGIN}`)
                }
            })
            const response = await apiUpdateCart({
                pid: productData._id,
                color: productData.color,
                price: productData.price,
                thumbnail: productData.thumb,
                quantity: 1,
                title: productData.title
            })
            if (response.success) {
                toast.success(response.mes)
                dispatch(getCurrent())
            }
            else toast.error(response.mes)
        }
    }

    return (
        <div className={clsx("w-full text-base px-2", style)}>
            <div
                onClick={() => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
                className="w-full border p-[15px] flex flex-col items-center"
                onMouseEnter={e => {
                    e.stopPropagation()
                    setIsShowOption(true)
                }}
                onMouseLeave={e => {
                    e.stopPropagation()
                    setIsShowOption(false)
                }}
            >
                <div className="w-full flex items-center justify-center relative">
                    {isShowOption && <div className='absolute bottom-0 left-0 right-0 flex justify-center gap-2 animate-slide-top'>
                        {current?.cart?.some(el => el.product === productData._id.toString())
                            ? <span title='Add Cart'>
                                <SelectOption icon={<BsCartCheckFill color='green' />} />
                            </span>
                            : <span title='Add Cart' onClick={(e) => handleClickOptions(e, 'ADDCART')}>
                                <SelectOption icon={<FaShoppingCart />} />
                            </span>}
                        <span title='Detail' onClick={(e) => handleClickOptions(e, 'DETAIL')}>
                            <SelectOption icon={<FiMenu />} />
                        </span>
                        <span title='Add Wishlist' onClick={(e) => handleClickOptions(e, 'WISHLIST')}>
                            <SelectOption icon={<FaHeart color={current?.wishlist?.some((i) => i._id === pid) ? 'red' : 'black'} />} />
                        </span>
                    </div>}
                    <img
                        src={productData?.thumb || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'}
                        alt="thumb_product"
                        className="w-[243px] h-[243px] object-contain"
                    />
                    {!normal && <img src={isNew ? label2 : label1} alt="label" className="absolute w-[70px] h-[25px] top-[-15px] right-[-18px] object-cover" />}
                </div>
                <div className="flex flex-col gap-1 items-start w-full mt-[15px]">
                    <span className='flex h-4'>{renderStarFromNumber(productData?.totalRating)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span className="line-clamp-1">{productData?.title}</span>
                    <span>{`${formatMoney(productData?.price)} VND`}</span>
                </div>
            </div>
        </div>
    )
}

export default withBase(memo(Product))