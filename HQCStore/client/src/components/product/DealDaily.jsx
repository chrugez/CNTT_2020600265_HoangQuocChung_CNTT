import { memo, useState, useEffect } from "react"
import icons from "../../ultils/icons"
import { apiGetProducts } from "../../apis"
import { renderStarFromNumber, formatMoney, secondToHms } from "../../ultils/helper"
import { CountDown } from '..'
import moment from 'moment'
import { useSelector, useDispatch } from "react-redux"
import { getDealDaily } from "../../store/product/productSlice"
import { useNavigate } from "react-router-dom"

const { MdStar, FiMenu } = icons
let idInterval

const DealDaily = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)
    const [expireTime, setExpireTime] = useState(false)
    const { dealDaily } = useSelector(state => state.products)

    const fetchDealDaily = async () => {
        const response = await apiGetProducts({ sort: '-totalRating', limit: 20 })
        if (response.success) {
            const pr = response.products[Math.round(Math.random() * 20)]
            dispatch(getDealDaily({ data: pr, time: Date.now() + 24 * 60 * 60 * 1000 }))
            // const h = 23 - new Date().getHours()
            // const m = 60 - new Date().getMinutes()
            // const s = 60 - new Date().getSeconds()
            // setHour(h)
            // setMinute(m)
            // setSecond(s)
            // const today = `${moment().format('MM/DD/YYYY')} 00:00:00`
            // const second = new Date(today).getTime() - new Date().getTime() + 24 * 60 * 60 * 1000
            // const number = secondToHms(second)
            // setHour(number.h)
            // setMinute(number.m)
            // setSecond(number.s)
        } else {
            setHour(0)
            setMinute(9)
            setSecond(59)
        }
    }

    useEffect(() => {
        if (dealDaily?.time) {
            const deltaTime = dealDaily.time - Date.now()
            const number = secondToHms(deltaTime)
            setHour(number.h)
            setMinute(number.m)
            setSecond(number.s)
        }
    }, [])

    useEffect(() => {
        idInterval && clearInterval(idInterval)
        if (moment(moment(dealDaily?.time).format(`MM/DD/YYYY`)).isBefore(moment())) fetchDealDaily()
    }, [expireTime])

    useEffect(() => {
        idInterval = setInterval(() => {
            if (second > 0) setSecond(prev => prev - 1)
            else {
                if (minute > 0) {
                    setMinute(prev => prev - 1)
                    setSecond(59)
                } else {
                    if (hour > 0) {
                        setHour(prev => prev - 1)
                        setMinute(59)
                        setSecond(59)
                    } else {
                        setExpireTime(!expireTime)
                    }
                }
            }
        }, 1000)
        return () => {
            clearInterval(idInterval)
        }
    }, [hour, minute, second, expireTime])
    // console.log(dealDaily)
    return (
        <div className="w-full border flex-auto">
            <div className="flex items-center justify-between p-4 w-full">
                <span className="flex-2 flex justify-center"><MdStar size={20} color="#DD1111" /></span>
                <span className="flex-6 text-[20px] font-semibold text-center text-gray-700">DAILY DEAL</span>
                <span className="flex-2"></span>
            </div>
            <div className="w-full flex flex-col items-center pt-8 px-4 gap-2">
                <img
                    src={dealDaily?.data?.thumb || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'}
                    alt="thumb_product"
                    className="w-full object-contain"
                />
            </div>
            <div className="flex flex-col gap-1 items-center w-full mt-[15px] text-xl">
                <span className="line-clamp-1">{dealDaily?.data?.title}</span>
                <span className='flex h-4'>{renderStarFromNumber(dealDaily?.data?.totalRating)?.map((el, index) => (
                    <span key={index}>{el}</span>
                ))}</span>
                <span>{`${formatMoney(dealDaily?.data?.price)} VND`}</span>
            </div>
            <div className="px-4 mt-4">
                <div className="flex justify-center items-center gap-2 mb-8">
                    <CountDown unit={'Hours'} number={hour} />
                    <CountDown unit={'Minutes'} number={minute} />
                    <CountDown unit={'Seconds'} number={second} />
                </div>
                <button
                    type="button"
                    className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 text-white py-2 font-medium"
                >
                    <FiMenu />
                    <span onClick={() => navigate(`/${dealDaily?.data?.category}/${dealDaily?.data?._id}/${dealDaily?.data?.title}`)}>Options</span>
                </button>
            </div>
        </div>
    )
}

export default memo(DealDaily)