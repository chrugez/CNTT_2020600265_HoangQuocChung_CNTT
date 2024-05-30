import { Banner, Sidebar, BestSeller, DealDaily, FeatureProduct, CustomSlider } from '../../components'
import { useSelector } from 'react-redux'
import icons from '../../ultils/icons'
import withBase from '../../hocs/withBase'
import { createSearchParams } from 'react-router-dom'

const { MdOutlineKeyboardArrowRight } = icons
const Home = ({ navigate }) => {
    const { newProducts } = useSelector(state => state.products)
    const { categories } = useSelector(state => state.app)
    const { isLoggedIn, current } = useSelector(state => state.user)

    return (
        <div className='flex flex-col w-main'>
            <div className='w-main flex'>
                <div className='flex flex-col gap-5 w-[25%] flex-auto'>
                    <Sidebar />
                    <DealDaily />
                </div>
                <div className='flex flex-col gap-5 pl-5 w-[75%] flex-auto'>
                    <Banner />
                    <BestSeller />
                </div>
            </div>
            <div className='my-8'>
                <FeatureProduct />
            </div>
            <div className='my-8 w-full'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>NEW ARRIVALS</h3>
                <div className='w-full mt-4 mx-[-8px] pt-4'>
                    <CustomSlider products={newProducts} />
                </div>
            </div>
            <div className='my-8 w-full'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>HOT COLLECTIONS</h3>
                <div className='flex flex-wrap gap-4 mt-4 '>
                    {categories?.filter(el => el?.brand.length > 0)?.map(el => (
                        <div
                            key={el._id}
                            className='w-[396px]'
                        >
                            <div className='border flex p-4 gap-4 min-h-[202px]'>
                                <img src={el?.image} alt="image" className='w-[144px] h-[129px] object-cover flex-1' />
                                <div className='flex-1 text-gray-700'>
                                    <h4 className='font-semibold uppercase '>{el?.title}</h4>
                                    <ul className='text-sm'>
                                        {el?.brand.map(item => (
                                            <span
                                                key={item}
                                                className='flex gap-2 text-gray-500 cursor-pointer hover:underline'
                                                onClick={() => navigate({
                                                    pathname: `/${el?.title}`,
                                                    search: createSearchParams({ brand: item }).toString()
                                                })}
                                            >
                                                <MdOutlineKeyboardArrowRight size={14} />
                                                <li className='text-sm'>{item}</li>
                                            </span>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <div className='my-8 w-full'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>BLOG POSTS</h3>
            </div> */}
        </div>
    )
}

export default withBase(Home)