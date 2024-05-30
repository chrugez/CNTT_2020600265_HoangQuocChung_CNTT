import React, { useEffect, useState, useCallback } from 'react'
import { apiGetUsers, apiDeleteUser } from '../../apis/user'
import moment from 'moment'
import { InputField, Pagination, InputForm, FormUser } from '../../components'
import useDebounce from '../../hooks/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { showModal } from '../../store/app/appSlice'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import icons from '../../ultils/icons'

const { FiEdit, ImBin } = icons

const ManageUser = () => {
    const [data, setData] = useState(null)
    const [queries, setQueries] = useState({
        q: ''
    })
    const [isEdit, setIsEdit] = useState(false)
    const [render, setRender] = useState(false)
    const [editEl, setEditEl] = useState(null)
    const dispatch = useDispatch()
    const [params] = useSearchParams()
    const queriesDebounce = useDebounce(queries.q, 1000)

    const fetchData = async (params) => {
        const response = await apiGetUsers({ ...params, limit: +import.meta.env.VITE_LIMIT })
        if (response.success) setData(response)
    }

    useEffect(() => {
        const query = Object.fromEntries([...params])
        if (queriesDebounce) query.q = queriesDebounce
        fetchData(query)
    }, [queriesDebounce, params, isEdit, render])

    const handleDelete = async (el) => {
        if (el.role === 0) {
            toast.warning('You cannot delete Admin!')
        } else {
            Swal.fire({
                title: "Do you want to delete this user?",
                showCancelButton: true,
                confirmButtonText: "Delete",
                icon: 'question'
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    const response = await apiDeleteUser(el._id)
                    setRender(!render)
                    toast.success(response.mes)
                }
            })
        }
    }

    const reRender = useCallback(() => {
        setIsEdit(!isEdit)
    }, [isEdit])


    return (
        <div className='w-full'>
            {isEdit && <div
                onClick={(e) => setIsEdit(false)}
                className="absolute top-0 bottom-0 left-0 right-0 z-50 bg-overlay flex flex-col items-center justify-center">
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white text-black w-[500px] rounded-md p-8">
                    <FormUser editEl={editEl} reRender={reRender} />
                </div>
            </div>}
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b-2'>
                <span>Manage User</span>
            </h1>
            <div className='w-full p-4 '>
                <div className='flex justify-end'>
                    <InputField
                        nameKey={'q'}
                        value={queries.q}
                        setValue={setQueries}
                        style='w-[500px] text-black'
                        placeholder='Search name or email user'
                        isHideLabel
                    />
                </div>
                <table className='table-auto mb-6 text-center w-full'>
                    <thead className='font-bold bg-white text-black'>
                        <tr className='border border-white'>
                            <th className='px-4 py-2'>#</th>
                            <th className='px-4 py-2'>Email</th>
                            <th className='px-4 py-2'>Fullname</th>
                            <th className='px-4 py-2'>Mobile</th>
                            <th className='px-4 py-2'>Role</th>
                            <th className='px-4 py-2'>Status</th>
                            <th className='px-4 py-2'>Created At</th>
                            <th className='px-4 py-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.users?.map((el, index) => (
                            <tr key={el._id} className='border border-white bg-gray-500'>
                                <td className='px-4 py-2 border-r'>{index + 1}</td>
                                <td className='px-4 py-2 border-r'>{el.email}</td>
                                <td className='px-4 py-2 border-r'>{`${el.lastName} ${el.firstName}`}</td>
                                <td className='px-4 py-2 border-r'>{el.mobile}</td>
                                <td className='px-4 py-2 border-r'>{(el.role === 0) ? 'Admin' : 'User'}</td>
                                <td className='px-4 py-2 border-r'>{el.isBlocked ? 'Blocked' : 'Active'}</td>
                                <td className='px-4 py-2 border-r'>{moment(el.createdAt).format("DD/MM/YYYY")}</td>
                                <td className='px-4 py-2'>
                                    <div className='flex items-center justify-center'>
                                        <span onClick={() => {
                                            setIsEdit(true)
                                            setEditEl(el)

                                            // dispatch(showModal({
                                            //     isShowModal: true,
                                            //     modalChildren: <FormUser
                                            //         editEl={editEl}
                                            //         reRender={reRender}
                                            //     />
                                            // }))
                                        }} className='px-2 hover:text-blue-600 hover:underline cursor-pointer'>
                                            <FiEdit />
                                        </span>
                                        <span
                                            onClick={() => handleDelete(el)}
                                            className='px-2 hover:text-main hover:underline cursor-pointer'>
                                            <ImBin />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data?.counts >= import.meta.env.VITE_LIMIT && <div className='w-full flex justify-end'>
                    <Pagination
                        totalCount={data?.counts}
                        name='users'
                    />
                </div>}
            </div>
        </div>
    )
}

export default ManageUser