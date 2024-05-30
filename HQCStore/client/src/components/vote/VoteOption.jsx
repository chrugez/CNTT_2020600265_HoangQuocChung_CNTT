import React, { memo, useEffect, useRef, useState } from 'react'
import { Button } from '..'
import { voteOption, } from '../../ultils/constants'
import icons from '../../ultils/icons'

const { MdStar, MdStarOutline } = icons

const VoteOption = ({ nameProduct, handleSubmitVoteOption }) => {
    const modalRef = useRef()
    const [chosenScore, setChosenScore] = useState(null)
    const [comment, setComment] = useState('')

    useEffect(() => {
        modalRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, [])

    return (
        <div
            ref={modalRef}
            className='bg-white w-[700px] p-4 flex flex-col items-center justify-center gap-4'
            onClick={e => e.stopPropagation()}
        >
            <h2>
                <span className='font-bold text-[48px] text-main'>HQC</span>
                <span className='font-semibold text-[32px]'>Store</span>
            </h2>
            <h3 className='text-center text-lg font-medium'>{`Rating product ${nameProduct}`}</h3>
            <div className='flex items-center w-full gap-4 justify-center'>
                {voteOption.map(el => (
                    <div
                        key={el.id}
                        className='w-[100px] h-[100px] cursor-pointer bg-gray-200 hover:bg-gray-300 p-4 rounded-md flex items-center justify-center flex-col gap-2'
                        onClick={() => setChosenScore(el.id)}
                    >
                        {(Number(chosenScore) && chosenScore >= el.id) ? <MdStar color='orange' size={24} /> : <MdStar color='gray' size={24} />}
                        <span>{el.text}</span>
                    </div>
                ))}
            </div>
            <textarea
                className='border border-black w-full p-2 placeholder:text-gray-500 placeholder:italic'
                placeholder='Comment here!'
                value={comment}
                onChange={e => setComment(e.target.value)}
                cols="30"
                rows="2"
            />
            <Button name='Submit' fw handleOnClick={() => { handleSubmitVoteOption({ comment, score: chosenScore }) }} />
        </div>
    )
}

export default memo(VoteOption)