import React, { memo, useState, useCallback } from 'react'
import { productInfoTabs } from '../../ultils/constants'
import { VoteBar, Button, VoteOption, Comment } from '..'
import { renderStarFromNumber } from '../../ultils/helper'
import { apiRatings } from '../../apis'
import { useDispatch, useSelector } from 'react-redux'
import { showModal } from '../../store/app/appSlice'
import { createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import path from '../../ultils/path'

const ProductInformation = ({ totalRating, totalCount, nameProduct, pid, reRender }) => {
    const [activedTab, setActivedTab] = useState(1)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const { isLoggedIn } = useSelector(state => state.user)

    const handleSubmitVoteOption = async ({ comment, score }) => {
        if (!comment || !score || !pid) {
            alert('missing input')
            return
        }
        await apiRatings({ star: score, comment, pid, updatedAt: Date.now() })
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
        reRender()
    }

    const handleVoteNow = () => {
        if (!isLoggedIn) {
            Swal.fire({
                text: 'Login to vote',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Go Login',
                title: 'Oops!',
                icon: 'info'
            }).then((rs) => {
                if (rs.isConfirmed) {
                    navigate({
                        pathname: `/${path.LOGIN}`,
                        search: createSearchParams({ redirect: location.pathname }).toString()
                    })
                }
            })
        } else {
            dispatch(showModal({
                isShowModal: true,
                modalChildren: <VoteOption
                    nameProduct={nameProduct}
                    handleSubmitVoteOption={handleSubmitVoteOption}
                />
            }))
        }
    }

    return (
        <div>
            <div className='flex items-center gap-2 relative bottom-[-1px]'>
                {productInfoTabs?.map(el => (
                    <span
                        className={`py-2 px-4 cursor-pointer ${activedTab === el?.id ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                        key={el?.id}
                        onClick={() => setActivedTab(el?.id)}
                    >
                        {el?.name}
                    </span>
                ))}
            </div>
            <div className='w-full  border p-4'>
                {productInfoTabs?.some(el => el?.id === activedTab) && productInfoTabs[activedTab - 1]?.content}

            </div>
            <div>
                <div className='flex p-4 flex-col'>
                    <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>CUSTOMER REVIEW</h3>
                    <div className='flex px-4 py-2'>
                        <div className='flex-4 flex flex-col items-center justify-center gap-2 border-r-2 '>
                            <span className='font-semibold text-3xl '>{`${totalRating}/5`}</span>
                            <span className='flex items-center gap-1'>{renderStarFromNumber(totalRating)?.map((el, index) => (
                                <span key={index}>{el}</span>
                            ))}</span>
                            <span className='text-sm'>{`${totalCount?.length} reviewers`}</span>
                        </div>
                        <div className='flex-6 p-4 flex flex-col gap-1 '>
                            {Array.from(Array(5).keys()).reverse().map(el => (
                                <VoteBar
                                    key={el}
                                    number={el + 1}
                                    ratingTotal={totalCount?.length}
                                    ratingCount={totalCount?.filter(i => i.star === el + 1)?.length}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='py-2 flex items-center justify-center w-full border-b-2'>
                        <Button
                            name='Vote now!'
                            handleOnClick={handleVoteNow}
                            style='px-4 py-2 rounded-md text-white bg-main font-semibold w-[200px] my-2'
                        />
                    </div>
                    <div className='flex flex-col gap-4 mt-4'>
                        {totalCount?.reverse()?.map((el, index) => (
                            <Comment
                                key={index}
                                star={el?.star}
                                updatedAt={el?.updatedAt}
                                comment={el?.comment}
                                name={`${el?.postedBy?.lastName} ${el?.postedBy?.firstName}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(ProductInformation)