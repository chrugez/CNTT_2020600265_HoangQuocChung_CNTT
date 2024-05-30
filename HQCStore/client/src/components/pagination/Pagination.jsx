import React, { memo } from 'react'
import usePagination from '../../hooks/usePagination'
import { PaginItem } from '..'
import { useSearchParams } from 'react-router-dom'

const Pagination = ({ totalCount, name }) => {
    const [params] = useSearchParams()
    const pagination = usePagination(totalCount, +params.get('page') || 1)

    const range = () => {
        const currentPage = +params.get('page')
        const pageSize = +import.meta.env.VITE_LIMIT || 10
        const start = Math.min(((currentPage - 1) * pageSize) + 1, totalCount)
        const end = Math.min(currentPage * pageSize, totalCount)

        return `${start} - ${end}`
    }
    return (
        <div className='flex w-full items-center justify-between'>
            {!params.get('page') ? <span className='text-sm italic'>{`Show ${name} ${Math.min(totalCount, 1)} - ${Math.min(+import.meta.env.VITE_LIMIT, totalCount)} of ${totalCount}`}</span> : ''}
            {params.get('page') ? <span className='text-sm italic'>{`Show ${name} ${range()} of ${totalCount}`}</span> : ''}
            <div className='flex items-center'>
                {pagination?.map(el => (
                    <PaginItem key={el}>
                        {el}
                    </PaginItem>
                ))}
            </div>
        </div>
    )
}

export default memo(Pagination)

