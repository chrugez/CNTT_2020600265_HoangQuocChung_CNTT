import React, { useState, useEffect, useCallback } from 'react'
import { createSearchParams, useParams } from 'react-router-dom'
import { apiGetProduct, apiGetProducts, apiUpdateCart } from '../../apis'
import { BreadCrumbs, Button, SelectQuantity, ProductInformation, CustomSlider } from '../../components'
import Slider from "react-slick"
import ReactImageMagnify from 'react-image-magnify'
import { formatMoney, formatPrice, renderStarFromNumber } from '../../ultils/helper'
import DOMPurify from 'dompurify'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import withBase from '../../hocs/withBase'
import { toast } from 'react-toastify'
import { getCurrent } from '../../store/user/asyncActions'
import Swal from 'sweetalert2'
import path from '../../ultils/path'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1
}

const DetailProduct = ({ location, navigate, dispatch }) => {
  const { pid, title, category } = useParams()
  const { current } = useSelector(state => state.user)
  const [product, setProduct] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [currentProduct, setCurrentProduct] = useState({
    thumb: '',
    images: [],
    price: '',
    color: '',
  })
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState(null)
  const [update, setUpdate] = useState(false)
  const [variant, setVariant] = useState(null)
  const fetchProductData = async () => {
    const response = await apiGetProduct(pid)
    if (response.success) {
      setProduct(response?.productData)
      setCurrentImage(response?.productData?.thumb)
    }
  }
  const fetchProducts = async () => {
    const rs = await apiGetProducts({ category })
    if (rs.success) setRelatedProducts(rs?.products)
  }
  useEffect(() => {
    if (variant) {
      setCurrentProduct({
        color: product?.variant?.find(el => el.sku === variant)?.color,
        images: product?.variant?.find(el => el.sku === variant)?.images,
        price: product?.variant?.find(el => el.sku === variant)?.price,
        thumb: product?.variant?.find(el => el.sku === variant)?.thumb,
      })
    } else {
      setCurrentProduct({
        color: product?.color,
        images: product?.images || [],
        price: product?.price,
        thumb: product?.thumb,
      })
    }
  }, [variant])
  useEffect(() => {
    if (pid) {
      fetchProductData()
      fetchProducts()
    }
    window.scrollTo(0, 0)
  }, [pid])

  useEffect(() => {
    if (pid) fetchProductData()
  }, [update])

  const reRender = useCallback(() => {
    setUpdate(!update)
  }, [update])

  const handleQuantity = useCallback((number) => {
    if (!Number(number) || Number(number) < 1 || Number(number) > product?.quantity) {
      return
    } else {
      setQuantity(number)
    }
    setQuantity(number)
  }, [quantity])

  const handlePlus = useCallback(() => {
    if (quantity === product?.quantity) return
    setQuantity(prev => +prev + 1)
  }, [quantity])

  const handleMinus = useCallback(() => {
    if (quantity === 1) return
    setQuantity(prev => +prev - 1)
  }, [quantity])

  const handleClickImage = (e, el) => {
    e.stopPropagation()
    setCurrentImage(el)
  }

  const handleAddToCart = async () => {
    if (!current) return Swal.fire({
      title: "Oops!",
      text: "You must login first!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Go Login"
    }).then(async (result) => {
      if (result.isConfirmed) {
        navigate({
          pathname: `/${path.LOGIN}`,
          search: createSearchParams({ redirect: location.pathname }).toString()
        })
      }
    })
    const response = await apiUpdateCart({
      pid,
      color: currentProduct.color || product.color,
      quantity,
      price: currentProduct.price || product.price,
      thumbnail: currentProduct.thumb || product.thumb,
      title: currentProduct.title || product.title,
    })
    if (response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
    }
    else toast.error(response.mes)
  }
  console.log(product)
  return (
    <div>
      <div className='h-[80px] '>
        <h3 className='font-semibold text-[20px] mb-2'>{title}</h3>
        <BreadCrumbs title={title} category={category} />
      </div>
      <div className='w-main m-auto flex '>
        <div className='w-3/5 flex flex-col gap-4 justify-center items-center'>
          <div className='w-[500px] h-[458px] border'>
            {/* <ReactImageMagnify {...{
              smallImage: {
                alt: '',
                isFluidWidth: true,
                src: product?.thumb
              },
              largeImage: {
                src: product?.thumb,
                width: 1200,
                height: 1200
              }
            }} /> */}
            <img src={currentImage || currentProduct?.thumb} alt="thumb" className='w-[500px] h-[458px] border overflow-hidden' />
          </div>
          <div className='w-[550px]'>
            <Slider className='image-slider' {...settings}>
              {product?.images?.map(el => (
                <div key={el} className='px-2'>
                  <img
                    src={el}
                    alt='sub-product'
                    className='w-[200px] h-[143px] border rounded-md object-contain cursor-pointer'
                    onClick={e => handleClickImage(e, el)}
                  />
                </div>
              ))}
              {/* {currentProduct?.images?.length > 0 && currentProduct?.images?.map(el => (
                <div key={el} className='px-2'>
                  <img
                    src={el}
                    alt='sub-product'
                    className='w-[200px] h-[143px] border rounded-md object-contain cursor-pointer'
                    onClick={e => handleClickImage(e, el)}
                  />
                </div>
              ))} */}
            </Slider>
          </div>
        </div>
        <div className='w-2/5 flex flex-col gap-4 pl-4 '>
          <div className='flex justify-between items-center'>
            <h2 className='text-[30px] font-semibold'>{`${formatMoney(variant ? +currentProduct?.price : +product?.price)} VND`}</h2>
            <span className='pr-10 text-gray-500 text-sm'>{`Sold: ${product?.sold}`}</span>
          </div>
          <div className='flex items-center'>
            {renderStarFromNumber(product?.totalRating)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </div>
          <ul className='text-gray-600 list-disc text-sm pl-4'>
            {product?.description?.length > 1 && product?.description?.map((el, index) => (
              <li key={index} className='leading-6'>{el}</li>
            ))}
            {product?.description?.length === 1 && <div className='text-sm' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}></div>}
          </ul>
          <div className='flex gap-4'>
            <span className='font-semibold'>Color:</span>
            <div className='flex flex-wrap gap-4 items-center w-full'>
              <div
                onClick={() => setVariant(null)}
                className={clsx('flex items-center border rounded-md border-gray-300 gap-2 cursor-pointer', !variant && 'bg-gray-300')}>
                <img src={product?.thumb} alt="thumb" className='w-10 h-10 rounded-md object-cover' />
                <span className='flex flex-col'>
                  <span className=''>{product?.color}</span>
                  <span className='text-sm'>{formatMoney(+product?.price)}</span>
                </span>
              </div>
              {product?.variant?.map(el => (
                <div
                  key={el.sku}
                  onClick={() => setVariant(el.sku)}
                  className={clsx('flex items-center border rounded-md border-gray-300 gap-2 cursor-pointer', variant === el.sku && 'bg-gray-300')}>
                  <img src={el?.thumb} alt="thumb" className='w-10 h-10 rounded-md object-cover' />
                  <span className='flex flex-col'>
                    <span className=''>{el?.color}</span>
                    <span className='text-sm'>{formatMoney(+el?.price)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <span className='font-semibold'>Remain:</span>
            <span>{product?.quantity}</span>
          </div>
          <div className='flex gap-2 items-center'>
            <span className='font-semibold'>Quantity</span>
            <SelectQuantity quantity={quantity} handleQuantity={handleQuantity} handleMinus={handleMinus} handlePlus={handlePlus} />
          </div>
          <Button
            name='Add To Cart'
            style='w-[200px] px-4 py-2 rounded-md text-white bg-main font-semibold my-2'
            handleOnClick={handleAddToCart}
          />
        </div>
        {/* <div className='w-1/5'>bonus</div> */}
      </div>
      <div className='w-main m-auto mt-8'>
        <ProductInformation
          totalRating={product?.totalRating}
          totalCount={product?.rating}
          nameProduct={product?.title}
          pid={product?._id}
          reRender={reRender}
        />
      </div>
      <div className='w-main m-auto mt-8'>
        <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>OTHER CUSTOMERS ALSO BUY</h3>
        <div className='w-full mt-4 mx-[-8px] pt-4'>
          <CustomSlider products={relatedProducts} normal={true} />
        </div>
      </div>
      <div className='h-[100px]'></div>
    </div>
  )
}

export default withBase(DetailProduct)