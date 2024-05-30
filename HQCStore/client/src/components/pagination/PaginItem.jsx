import React, { memo, useEffect } from 'react'
import icons from '../../ultils/icons'
import clsx from 'clsx'
import { useSearchParams, useNavigate, createSearchParams, useLocation } from 'react-router-dom'

const { BsThreeDots } = icons

const PaginItem = ({ children }) => {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()

    const handlePagination = () => {
        const queries = Object.fromEntries([...params])
        if (Number(children)) queries.page = children
        navigate({
            pathname: location.pathname,
            search: createSearchParams(queries).toString()
        })
    }

    return (
        <button
            className={clsx('w-10 h-10 flex justify-center font-semibold text-base',
                !Number(children) && 'items-end pb-2',
                Number(children) && 'items-center hover:text-main',
                +params.get('page') === +children && 'text-main text-xl',
                !+params.get('page') && +children === 1 && 'text-main text-xl'
            )}
            onClick={handlePagination}
            type='button'
            disabled={!Number(children)}
        >
            {children}
        </button>
    )
}

export default memo(PaginItem)