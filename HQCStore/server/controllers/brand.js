const Brand = require('../models/brand')
const asyncHandler = require('express-async-handler')

const createNewBrand = asyncHandler(async (req, res) => {
    const response = await Brand.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        createdBrand: response ? response : 'Cannot create new Brand!'
    })
})

const getBrands = asyncHandler(async (req, res) => {
    const response = await Brand.find()
    return res.status(200).json({
        success: response ? true : false,
        blogCategories: response ? response : 'Cannot get all brands!'
    })
})

const updateBrand = asyncHandler(async (req, res) => {
    const { brid } = req.params
    const response = await Brand.findByIdAndUpdate(brid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedBrand: response ? response : 'Cannot update Brand!'
    })
})

const deleteBrand = asyncHandler(async (req, res) => {
    const { brid } = req.params
    const response = await Brand.findByIdAndDelete(brid)
    return res.status(200).json({
        success: response ? true : false,
        deletedBrand: response ? response : 'Cannot delete Brand!'
    })
})

module.exports = {
    createNewBrand,
    getBrands,
    updateBrand,
    deleteBrand
}