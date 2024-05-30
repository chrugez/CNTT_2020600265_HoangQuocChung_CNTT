import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, createSearchParams, useNavigate } from 'react-router-dom'
import { BreadCrumbs, Product, SearchItem, InputSelect, Pagination } from '../../components'
import { apiGetProducts } from '../../apis'
import Masonry from 'react-masonry-css'
import { sorts } from '../../ultils/constants'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
}

const Products = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState(null)
  const [activeClick, setActiveClick] = useState(null)
  const [sort, setSort] = useState('')
  const { category } = useParams()
  const [params] = useSearchParams()
  const fetchProductsByCategory = async (queries) => {
    if (category && category !== 'products') queries.category = category
    const response = await apiGetProducts(queries)
    if (response.success) setProducts(response)
  }
  useEffect(() => {
    const queries = Object.fromEntries([...params])
    let priceQuery = {}
    if (queries.from && queries.to) {
      priceQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } }
        ]
      }
      delete queries.price
    } else {
      if (queries.from) queries.price = { gte: queries.from }
      if (queries.to) queries.price = { lte: queries.to }
    }

    delete queries.from
    delete queries.to
    const q = { ...priceQuery, ...queries }
    fetchProductsByCategory(q)
    window.scrollTo(0, 0)
  }, [params])

  const changeActiveFilter = useCallback((name) => {
    if (activeClick === name) setActiveClick(null)
    else setActiveClick(name)
  }, [activeClick])
  const changeValue = useCallback((value) => {
    setSort(value)
  }, [sort])
  useEffect(() => {
    if (sort) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({ sort }).toString()
      })
    }
  }, [sort])
  return (
    <div>
      <div className='h-[80px] text-lg flex justify-center items-center'>
        <div className='w-main'>
          <h3 className='font-semibold uppercase pt-[-4px] mb-2'>{category}</h3>
          <BreadCrumbs category={category} />
        </div>
      </div>
      <div className='w-main border p-4 flex justify-between '>
        <div className='w-4/5 flex-auto flex flex-col gap-2'>
          <span className='font-semibold text-sm'>Filter by</span>
          <span className='flex items-center gap-4'>
            <SearchItem name='Price' activeClick={activeClick} changeActiveFilter={changeActiveFilter} type='input' />
            <SearchItem name='Color' activeClick={activeClick} changeActiveFilter={changeActiveFilter} />
          </span>
        </div>
        <div className='w-1/5 flex flex-col gap-2'>
          <span className='font-semibold text-sm'>Sort by</span>
          <div className='w-full'>
            <InputSelect value={sort} options={sorts} changeValue={changeValue} />
          </div>
        </div>
      </div>
      <div className='w-main mt-8 m-auto'>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid flex mx-[-10px]"
          columnClassName="my-masonry-grid_column">
          {products?.products?.map(el => (
            <Product
              key={el._id}
              pid={el._id}
              productData={el}
              normal={true}
            />
          ))}
        </Masonry>
      </div>
      <div className=' my-4 flex justify-center'>
        <Pagination totalCount={products?.counts} name='products' />
      </div>
      {/* <div className='h-[500px] '></div> */}
    </div>
  )
}

export default Products