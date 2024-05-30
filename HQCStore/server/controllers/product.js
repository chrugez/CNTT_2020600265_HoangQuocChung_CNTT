const { response, request } = require('express')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const makeSku = require('uniqid')

const createProduct = asyncHandler(async (req, res) => {
    const { title, price, description, brand, category, color } = req.body
    const thumb = req?.files?.thumb[0]?.path
    const images = req.files?.images?.map(el => el.path)
    if (!(title && price && description && brand && category && color)) throw new Error('Missing inputs!')
    req.body.slug = slugify(req.body.title)
    if (thumb) req.body.thumb = thumb
    if (images) req.body.images = images
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        mes: newProduct ? 'Created' : 'Cannot create new product!'
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid).populate({
        path: 'rating',
        populate: {
            path: 'postedBy',
            select: 'firstName lastName avatar'
        }
    })
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product!'
    })
})
//Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
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
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
    if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i' }
    if (queries?.brand) formatedQueries.brand = { $regex: queries.brand, $options: 'i' }
    if (queries?.color) {
        delete formatedQueries.color
        const colorArr = queries.color?.split(',')
        const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i' } }))
        colorQueryObject = { $or: colorQuery }
    }
    let queryObject = {}
    if (queries.q) {
        delete formatedQueries.q
        queryObject = {
            $or: [
                { title: { $regex: queries.q, $options: 'i' } },
                { category: { $regex: queries.q, $options: 'i' } },
                { brand: { $regex: queries.q, $options: 'i' } },

            ]
        }
    }

    const qr = { ...colorQueryObject, ...formatedQueries, ...queryObject }
    let queryCommand = Product.find(qr)

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
            const counts = await Product.find(qr).countDocuments()
            return res.status(200).json({
                success: response ? true : false,
                products: response ? response : 'Cannot find any product!',
                counts,
            })
        }).catch((error) => {
            throw new Error(error.message)
        })
})

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const files = req?.files
    if (files?.thumb) req.body.thumb = files?.thumb[0].path
    if (files?.images) req.body.images = files?.images?.map(el => el.path)
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updatedProduct ? true : false,
        mes: updatedProduct ? 'Updated' : 'Cannot update product!'
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        mes: deletedProduct ? 'Deleted' : 'Cannot delete product!'
    })
})

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, pid, updatedAt } = req.body
    if (!star || !pid) throw new Error('Missing inputs!')
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.rating?.find(el => el.postedBy.toString() === _id)
    if (alreadyRating) {
        await Product.updateOne({
            rating: { $elemMatch: alreadyRating }
        }, {
            $set: { "rating.$.star": star, "rating.$.comment": comment, "rating.$.updatedAt": updatedAt }
        }, { new: true })
    } else {
        await Product.findByIdAndUpdate(pid, {
            $push: { rating: { star, comment, postedBy: _id, updatedAt } }
        }, { new: true })
    }

    //sum rating
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.rating.length
    const sumRating = updatedProduct.rating.reduce((sum, el) => sum + +el.star, 0)
    updatedProduct.totalRating = Math.round(sumRating * 10 / ratingCount) / 10
    await updatedProduct.save()

    return res.status(200).json({
        status: true,
        updatedProduct
    })
})

const uploadImagesProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (!req.files) throw new Error('Missing inputs!')
    const response = await Product.findByIdAndUpdate(pid, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
    return res.status(200).json({
        status: response ? true : false,
        updatedProduct: response ? response : 'Cannot upload images product'
    })
})

const addVariant = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const { title, price, color } = req.body
    const thumb = req?.files?.thumb[0]?.path
    const images = req.files?.images?.map(el => el.path)
    if (!(title && price && color)) throw new Error('Missing inputs!')
    const response = await Product.findByIdAndUpdate(pid, { $push: { variant: { color, price, title, thumb, images, sku: makeSku().toUpperCase() } } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Added new variant!' : 'Cannot add variant product'
    })
})

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct,
    addVariant
}