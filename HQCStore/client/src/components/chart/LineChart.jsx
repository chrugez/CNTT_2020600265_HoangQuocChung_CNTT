import React, { useState, useEffect, memo } from 'react'
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, plugins } from "chart.js/auto";
import moment from 'moment';
import { apiGetOrders } from '../../apis';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
)

const LineChart = () => {

    const [orders, setOrders] = useState(null)

    const fetchOrders = async () => {
        const response = await apiGetOrders()
        // console.log(response)
        if (response.success) setOrders(response)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    console.log(orders)
    const option = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",

            },
            title: {
                display: true,
                text: "CHART OF TOTAL PRICE OF EACH ORDER",
            }
        }
    }
    const [orderData, setOrderData] = useState({
        labels: orders?.orders?.map((data) => moment(data?.createdAt).format("DD/MM/YYYY")),
        datasets: [
            {
                label: "Total",
                data: orders?.orders?.map((data) => data?.total),
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0",
                ],
                borderColor: "black",
                borderWidth: 2,
            },
        ],
    });

    useEffect(() => {
        setOrderData({
            labels: orders?.orders?.map((data) => moment(data?.createdAt).format("DD/MM/YYYY")),
            datasets: [
                {
                    label: "Total price(VND)",
                    data: orders?.orders?.map((data) => data?.total),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                },
            ],
        })
    }, [orders])
    console.log(orders?.orders?.map((data) => moment(data?.createdAt).format("DD/MM/YYYY")))
    return <Line options={option} data={orderData} />
}

export default memo(LineChart)