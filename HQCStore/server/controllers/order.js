const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { products, total, address, payment } = req.body
    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] }, { new: true })
    }
    const rs = await Order.create({ products, total, orderBy: _id, address, payment })
    return res.json({
        success: rs ? true : false,
        rs: rs ? rs : 'Something went wrong!'
    })
})

const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body
    if (!status) throw new Error('Missing status!')
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'Something went wrong!'
    })
})

const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const queries = { ...req.query }
    //tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //format lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchEl => `$${matchEl}`)
    const formatedQueries = JSON.parse(queryString)
    let colorQueryObject = {}

    //filtering
    // if (queries?.status) formatedQueries.title = { $regex: queries.title, $options: 'i' }
    // if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i' }
    // if (queries?.color) {
    //     delete formatedQueries.color
    //     const colorArr = queries.color?.split(',')
    //     const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i' } }))
    //     colorQueryObject = { $or: colorQuery }
    // }
    // let queryObject = {}
    // if (queries.q) {
    //     delete formatedQueries.q
    //     queryObject = {
    //         $or: [
    //             { title: { $regex: queries.q, $options: 'i' } },
    //             { category: { $regex: queries.q, $options: 'i' } },
    //             { brand: { $regex: queries.q, $options: 'i' } },

    //         ]
    //     }
    // }

    const qr = { ...formatedQueries, orderBy: _id }
    let queryCommand = Order.find(qr)

    //sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    //fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    //pagination
    //limit: số object lấy về 1 lần gọi API
    //skip: Bỏ qua bao nhiêu object rồi lấy tiếp (tính từ object đầu tiên)
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)

    //execute query
    //số lượng sản phẩn thỏa mãn điều kiện !== số lượng sản phẩm trả về 1 lần gọi API
    //[Mongoose mới không hỗ trợ callback]
    // queryCommand.exec(async (err, response) => {
    //     if (err) throw new Error(err.message)
    //     const counts = await Product.find(formatedQueries).countDocuments()
    //     return res.status(200).json({
    //         success: response ? true : false,
    //         counts,
    //         products: response ? response : 'Cannot get products!',
    //     })
    // })
    queryCommand
        .exec()
        .then(async (response) => {
            const counts = await Order.find(qr).countDocuments()
            return res.status(200).json({
                success: response ? true : false,
                orders: response ? response : 'Cannot find any order!',
                counts,
            })
        }).catch((error) => {
            throw new Error(error.message)
        })
})

const getOrders = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    //tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //format lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchEl => `$${matchEl}`)
    const formatedQueries = JSON.parse(queryString)
    let colorQueryObject = {}

    // // filtering
    // if (queries?.status) formatedQueries.status = { $regex: queries.status, $options: 'i' }
    // // if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i' }
    // // if (queries?.color) {
    // //     delete formatedQueries.color
    // //     const colorArr = queries.color?.split(',')
    // //     const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i' } }))
    // //     colorQueryObject = { $or: colorQuery }
    // // }
    // let queryObject = {}
    // if (queries.q) {
    //     delete formatedQueries.q
    //     queryObject = {
    //         $or: [
    //             { status: { $regex: queries.q, $options: 'i' } },
    //             // { category: { $regex: queries.q, $options: 'i' } },
    //             // { brand: { $regex: queries.q, $options: 'i' } },

    //         ]
    //     }
    // }

    const qr = { ...formatedQueries }
    let queryCommand = Order.find(qr)

    //sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    //fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    //pagination
    //limit: số object lấy về 1 lần gọi API
    //skip: Bỏ qua bao nhiêu object rồi lấy tiếp (tính từ object đầu tiên)
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)

    //execute query
    //số lượng sản phẩn thỏa mãn điều kiện !== số lượng sản phẩm trả về 1 lần gọi API
    //[Mongoose mới không hỗ trợ callback]
    // queryCommand.exec(async (err, response) => {
    //     if (err) throw new Error(err.message)
    //     const counts = await Product.find(formatedQueries).countDocuments()
    //     return res.status(200).json({
    //         success: response ? true : false,
    //         counts,
    //         products: response ? response : 'Cannot get products!',
    //     })
    // })
    queryCommand
        .exec()
        .then(async (response) => {
            const counts = await Order.find(qr).countDocuments()
            return res.status(200).json({
                success: response ? true : false,
                orders: response ? response : 'Cannot find any order!',
                counts,
            })
        }).catch((error) => {
            throw new Error(error.message)
        })
})

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getOrders
}