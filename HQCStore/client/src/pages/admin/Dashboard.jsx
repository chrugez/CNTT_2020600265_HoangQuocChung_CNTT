import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import path from '../../ultils/path'
import { apiGetProducts, apiGetUsers, apiGetOrders } from '../../apis'
import { formatMoney } from '../../ultils/helper'
import moment from 'moment'
import { LineChart } from '../../components'

const Dashboard = () => {

    const [users, setUsers] = useState(null)
    const [products, setProducts] = useState(null)
    const [orders, setOrders] = useState(null)
    const navigate = useNavigate()

    const fetchUsers = async () => {
        const response = await apiGetUsers()
        // console.log(response)
        if (response.success) setUsers(response)
    }

    const fetchProducts = async () => {
        const response = await apiGetProducts()
        // console.log(response)
        if (response.success) setProducts(response)
    }

    const fetchOrders = async () => {
        const response = await apiGetOrders()
        // console.log(response)
        if (response.success) setOrders(response)
    }

    useEffect(() => {
        fetchUsers()
        fetchProducts()
        fetchOrders()
    }, [])
    // console.log(orders)

    return (
        <div className='p-2'>
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b-2'>
                <span>Dashboard</span>
            </h1>
            <div className='grid grid-cols-3 h-[300px] mt-4 gap-6'>
                <div className='bg-gray-300 rounded-lg col-span-1 flex items-center justify-center cursor-pointer'
                    onClick={() => navigate(`/${path.ADMIN}/${path.MANAGE_USER}`)}
                >
                    <div className='flex flex-col text-black'>
                        <div className='text-2xl'>Number of users</div>
                        <div className='text-center mt-4 text-4xl'>{users?.counts}</div>
                    </div>
                </div>
                <div className='bg-gray-300 rounded-lg col-span-1 flex items-center justify-center cursor-pointer'
                    onClick={() => navigate(`/${path.ADMIN}/${path.MANAGE_PRODUCT}`)}
                >
                    <div className='flex flex-col text-black'>
                        <div className='text-2xl'>Number of products</div>
                        <div className='text-center mt-4 text-4xl'>{products?.counts}</div>
                    </div>
                </div>
                <div className='bg-gray-300 rounded-lg col-span-1 flex items-center justify-center cursor-pointer'
                    onClick={() => navigate(`/${path.ADMIN}/${path.MANAGE_ORDER}`)}
                >
                    <div className='flex flex-col text-black'>
                        <div className='text-2xl'>Number of orders</div>
                        <div className='text-center mt-4 text-4xl'>{orders?.counts}</div>
                    </div>
                </div>
            </div>
            <div className="mt-4 bg-white w-[99%]">
                <LineChart />
            </div>
        </div>
    )
}

export default Dashboard