import React, { memo, useState, useEffect } from 'react'
import icons from '../../ultils/icons'
import { colors } from '../../ultils/constants'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { apiGetProducts } from '../../apis'
import { formatMoney } from '../../ultils/helper'
import useDebounce from '../../hooks/useDebounce'
import Swal from 'sweetalert2'

const { AiOutlineDown } = icons

const SearchItem = ({ name, activeClick, changeActiveFilter, type = 'checkbox' }) => {
    const navigate = useNavigate()
    const { category } = useParams()
    const [params] = useSearchParams()
    const [selected, setSelected] = useState([])
    const [highestPrice, setHighestPrice] = useState(null)
    const [price, setPrice] = useState({
        from: '',
        to: ''
    })
    const debouncePriceFrom = useDebounce(price.from, 2000)
    const debouncePriceTo = useDebounce(price.to, 2000)
    const fetchHighestPriceProduct = async () => {
        const response = await apiGetProducts({ sort: '-price', limit: 1 })
        if (response.success) setHighestPrice(response.products[0]?.price)
    }
    const handleSelect = (e) => {
        const alreadyEl = selected.find(el => el === e.target.value)
        if (alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
        else setSelected(prev => [...prev, e.target.value])
        changeActiveFilter(null)
    }
    useEffect(() => {
        let param = []
        for (let i of params.entries()) param.push(i)
        const queries = {}
        for (let i of param) queries[i[0]] = [1]
        if (selected.length > 0) {
            queries.color = selected.join(`,`)
            queries.page = 1
        } else {
            delete queries.color
        }
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        })
    }, [selected])
    useEffect(() => {
        if (type === 'input') fetchHighestPriceProduct()
    }, [type])

    useEffect(() => {
        if (debouncePriceFrom && debouncePriceTo && (+debouncePriceFrom > +debouncePriceTo)) Swal.fire('Oops!', 'The From price must be less than the To price')
    }, [debouncePriceFrom, debouncePriceTo])

    useEffect(() => {
        let param = []
        for (let i of params.entries()) param.push(i)
        const queries = {}
        for (let i of param) queries[i[0]] = [1]
        if (Number(price.from) > 0) queries.from = price.from
        else delete queries.from
        if (Number(price.to) > 0) queries.to = price.to
        else delete queries.to
        queries.page = 1
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        })
    }, [debouncePriceFrom, debouncePriceTo])

    return (
        <div
            className='p-3 text-gray-500 border gap-2 border-gray-800 flex justify-between items-center relative text-xs cursor-pointer'
            onClick={() => changeActiveFilter(name)}
        >
            <span className='capitalize'>{name}</span>
            <AiOutlineDown />
            {activeClick === name && <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]'>
                {type === 'checkbox' && <div className=''>
                    <div className='p-4 flex items-center justify-between gap-8 border-b'>
                        <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
                        <span
                            className='underline hover:text-main cursor-pointer'
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelected([])

                            }}
                        >
                            Reset
                        </span>
                    </div>
                    <div className='flex flex-col gap-2 mt-4' onClick={e => e.stopPropagation()}>
                        {colors?.map((el, index) => (
                            <div key={index} className='flex items-center gap-2'>
                                <input
                                    type="checkbox"
                                    name={el}
                                    value={el}
                                    onChange={handleSelect}
                                    id={el}
                                    className='cursor-pointer'
                                    checked={selected.some(selectedItem => selectedItem === el)}
                                />
                                <label htmlFor={el} className='capitalize text-gray-700'>{el}</label>
                            </div>
                        ))}
                    </div>
                </div>}
                {type === 'input' && <div>
                    <div
                        className='p-4 flex items-center justify-between gap-8 border-b'
                        onClick={e => e.stopPropagation()}
                    >
                        <span className='whitespace-nowrap'>{`The highest price is ${formatMoney(highestPrice)} VND`}</span>
                        <span
                            className='underline hover:text-main cursor-pointer'
                            onClick={(e) => {
                                e.stopPropagation()
                                setPrice({ from: '', to: '' })
                                changeActiveFilter(null)
                            }}
                        >
                            Reset
                        </span>
                    </div>
                    <div
                        className='flex items-center p-2 gap-2'
                        onClick={e => e.stopPropagation()}
                    >
                        <div className='flex items-center gap-2'>
                            <label htmlFor="from">From</label>
                            <input
                                className='border outline-none w-[150px] h-[30px] text-sm p-2'
                                type="number"
                                id='from'
                                value={price.from}
                                onChange={e => setPrice(prev => ({ ...prev, from: e.target.value }))}
                            />
                        </div>
                        <div className='flex items-center gap-2'>
                            <label htmlFor="to">To</label>
                            <input
                                className='border outline-none w-[150px] h-[30px] text-sm p-2'
                                type="number"
                                id='to'
                                value={price.to}
                                onChange={e => setPrice(prev => ({ ...prev, to: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>}
            </div>}
        </div>
    )
}

export default memo(SearchItem)