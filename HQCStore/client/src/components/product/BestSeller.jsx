import { apiGetProducts } from '../../apis/product'
import { useState, useEffect, memo } from 'react'
import { Product, CustomSlider } from '..'
import { getNewProducts } from '../../store/product/asyncActions'
import { useDispatch, useSelector } from 'react-redux'
import banner2 from '../../assets/banner2.avif'
import banner3 from '../../assets/banner3.avif'
import { useNavigate } from 'react-router-dom'

const tabs = [
    { id: 1, name: 'best seller' },
    { id: 2, name: 'new arrivals' }
]

const bannerProduct1 = {
    category: 'laptop',
    id: '660a60864a6c9de580552658',
    title: 'DELL INSPIRON 7460'
}

const bannerProduct2 = {
    category: 'laptop',
    id: '660a60864a6c9de58055265a',
    title: 'APPLE MACBOOK PRO 13"'
}

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null)
    const [activedTab, setActivedTab] = useState(1)
    const [products, setProducts] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { newProducts } = useSelector(state => state.products)

    const fetchProducts = async () => {
        const response = await apiGetProducts({ sort: '-sold' })
        if (response?.success) {
            setBestSellers(response.products)
            setProducts(response.products)
        }


    }

    useEffect(() => {
        fetchProducts()
        dispatch(getNewProducts())
    }, [])

    useEffect(() => {
        if (activedTab === 1) setProducts(bestSellers)
        if (activedTab === 2) setProducts(newProducts)
    }, [activedTab])
    return (
        <div>
            <div className='flex uppercase text-xl border-b-4 pb-2 border-main'>
                {tabs.map(el => (
                    <span
                        key={el.id}
                        className={`font-bold border-r px-3 text-gray-400 cursor-pointer ${activedTab === el.id ? 'text-gray-900' : ''}`}
                        onClick={() => setActivedTab(el.id)}
                    >
                        {el.name}
                    </span>
                ))}
            </div>
            <div className='mt-4 mx-[-8px]'>
                <CustomSlider products={products} activedTab={activedTab} />
            </div>
            <div className='w-full flex mt-4 gap-4'>
                <img
                    src={banner2}
                    alt="banner"
                    className='flex-1 object-contain cursor-pointer'
                    onClick={() => navigate(`/${bannerProduct1.category}/${bannerProduct1.id}/${bannerProduct1.title}`)}
                />
                <img
                    src={banner3}
                    alt="banner"
                    className='flex-1 object-contain cursor-pointer'
                    onClick={() => navigate(`/${bannerProduct2.category}/${bannerProduct2.id}/${bannerProduct2.title}`)} />
            </div>
        </div>
    )
}

export default memo(BestSeller)