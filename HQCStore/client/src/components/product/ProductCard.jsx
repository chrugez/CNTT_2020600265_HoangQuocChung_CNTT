import React, { memo } from 'react'
import { renderStarFromNumber, formatMoney } from "../../ultils/helper"
import withBase from '../../hocs/withBase'

const ProductCard = ({ product, navigate }) => {
    return (
        <div
            onClick={() => navigate(`/${product?.category?.toLowerCase()}/${product?._id}/${product?.title}`)}
            className='w-1/3 flex-auto flex px-[10px] mb-[20px] cursor-pointer'>
            <div className='border w-full flex'>
                <img src={product?.thumb} alt="thumb" className='w-[120px] object-contain p-4' />
                <div className="flex flex-col gap-1 items-start w-full mt-[15px] text-xs">
                    <span className="line-clamp-1 text-sm capitalize">{product?.title?.toLowerCase()}</span>
                    <span className='flex h-4'>{renderStarFromNumber(product?.totalRating)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span>{`${formatMoney(product?.price)} VND`}</span>
                </div>
            </div>
        </div>
    )
}

export default withBase(memo(ProductCard))