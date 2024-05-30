const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')
const makeToken = require('uniqid')

// const register = asyncHandler(async (req, res) => {
//     const { email, password, firstName, lastName } = req.body
//     if (!email || !password || !firstName || !lastName)
//         return res.status(400).json({
//             success: false,
//             mes: 'Missing inputs',
//         })
//     const user = await User.findOne({ email })
//     if (user) throw new Error('User has existed!')
//     else {
//         const newUser = await User.create(req.body)
//         return res.status(200).json({
//             success: newUser ? true : false,
//             mes: newUser ? 'Register is successfull!' : 'Something went wrong!'
//         })
//     }
// })

const register = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, mobile } = req.body
    if (!email || !password || !firstName || !lastName || !mobile)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs',
        })
    const user = await User.findOne({ email })
    if (user) throw new Error('User has existed!')
    else {
        const token = makeToken()
        const emailEdited = btoa(email) + '@' + token
        const newUser = await User.create({
            email: emailEdited, password, firstName, lastName, mobile
        })
        if (newUser) {
            const html = `<h2>Register code:</h2><br/><spa>This code will expire in 5 minutes</span><br/><blockquote>${token}</blockquote>`
            await sendMail({ email, html, subject: 'Confirm register account in HQC Store!' })
        }
        setTimeout(async () => {
            await User.deleteOne({ email: emailEdited })
        }, [5 * 60 * 1000])
        return res.json({
            success: newUser ? true : false,
            mes: newUser ? 'Please check your email to active account!' : 'Something went wrong, please try later!'
        })
    }
})

// const register = asyncHandler(async (req, res) => {
//     const { email, password, firstName, lastName, mobile } = req.body
//     if (!email || !password || !firstName || !lastName || !mobile)
//         return res.status(400).json({
//             success: false,
//             mes: 'Missing inputs',
//         })
//     const user = await User.findOne({ email })
//     if (user) throw new Error('User has existed!')
//     else {
//         const token = makeToken()
//         res.cookie('dataregister', { ...req.body, token }, { httpOnly: true, maxAge: 15 * 60 * 1000 })
//         const html = `Please click to the link below to finish register your account! This link will expire in 15 minutes
//     <a href=${process.env.URL_SERVER}/api/user/finalregister/${token}>Click here!</a>`
//         await sendMail({ email, html, subject: 'Finish register account!' })
//         return res.json({
//             success: true,
//             mes: 'Please check your email to active account!'
//         })
//     }
// })

const finalRegister = asyncHandler(async (req, res) => {
    const { token } = req.params
    const notActivedEmail = await User.findOne({ email: new RegExp(`${token}$`) })
    if (notActivedEmail) {
        notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0])
        notActivedEmail.save()
    }
    return res.json({
        success: notActivedEmail ? true : false,
        mes: notActivedEmail ? 'Register is successful. Please go login!' : 'Something went wrong, please try later!'
    })
    // const newUser = await User.create({
    //     email: cookie?.dataregister?.email,
    //     password: cookie?.dataregister?.password,
    //     mobile: cookie?.dataregister?.mobile,
    //     firstName: cookie?.dataregister?.firstName,
    //     lastName: cookie?.dataregister?.lastName,
    // })
    // res.clearCookie('dataregister')
    // if (newUser) return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`)
    // else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
    // Thành công => redirect(`${process.env.CLIENT_URL}/finalregister/success`)
    // Thất bại => redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
})

// const finalRegister = asyncHandler(async (req, res) => {
//     const cookie = req.cookies
//     const { token } = req.params
//     if (!cookie || cookie?.dataregister?.token !== token) {
//         res.clearCookie('dataregister')
//         return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
//     }
//     const newUser = await User.create({
//         email: cookie?.dataregister?.email,
//         password: cookie?.dataregister?.password,
//         mobile: cookie?.dataregister?.mobile,
//         firstName: cookie?.dataregister?.firstName,
//         lastName: cookie?.dataregister?.lastName,
//     })
//     res.clearCookie('dataregister')
//     if (newUser) return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`)
//     else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
//     // Thành công => redirect(`${process.env.CLIENT_URL}/finalregister/success`)
//     // Thất bại => redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
// })

//refreshToken => Cấp mới accessToken
//accessToken => Xác thực người dùng, phân quyền người dùng.
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs',
        })
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        //Tách password và role ra khỏi response    
        const { password, role, refreshToken, ...userData } = response.toObject()
        //Tạo accessToken
        const accessToken = generateAccessToken(response._id, role)
        //Tạo refreshToken
        const newRefreshToken = generateRefreshToken(response._id)
        //Lưu refreshToken vào DB
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        //Lưu refreshToken vào Cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    }
    else {
        throw new Error('Invalid credentials!')
    }
})

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id)
        .select('-refreshToken -password')
        .populate({
            path: 'cart',
            populate: {
                path: 'product',
                select: 'title thumb price quantity'
            }
        }).populate('wishlist', 'title thumb price color')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found!'
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    //lấy token từ cookie
    const cookie = req.cookies
    //check xem có token không
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies!')
    //check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    //Xóa refreshToken ở DB
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    //Xóa refreshToken ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    res.status(200).json({
        success: true,
        mes: 'Logout is done'
    })
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Missing email!')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()

    const html = `Please click to the link below to reset your password!
    <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here!</a>`

    const data = {
        email,
        html,
        subject: "Forgot password",
    }

    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response?.includes('OK') ? 'Please check your email!' : 'Something went wrong!'
    })
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing Input!')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExprires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangeAt = Date.now()
    user.passwordResetExprires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password!' : 'Something went wrong!'
    })
})

const getUsers = asyncHandler(async (req, res) => {
    // const response = await User.find().select('-refreshToken -password -role')
    // return res.status(200).json({
    //     success: response ? true : false,
    //     users: response
    // })
    const queries = { ...req.query }
    //tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //format lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchEl => `$${matchEl}`)
    const formatedQueries = JSON.parse(queryString)

    //filtering
    if (queries?.name) formatedQueries.name = { $regex: queries.name, $options: 'i' }
    if (req.query.q) {
        delete formatedQueries.q
        formatedQueries['$or'] = [
            { firstName: { $regex: req.query.q, $options: 'i' } },
            { lastName: { $regex: req.query.q, $options: 'i' } },
            { email: { $regex: req.query.q, $options: 'i' } },
        ]
    }
    let queryCommand = User.find(formatedQueries)

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
            const counts = await User.find(formatedQueries).countDocuments()
            return res.status(200).json({
                success: response ? true : false,
                users: response ? response : 'Cannot find any user!',
                counts,
            })
        }).catch((error) => {
            throw new Error(error.message)
        })
})

const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params
    const response = await User.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `User with email ${response.email} deleted` : 'No user delete'
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { firstName, lastName, mobile, address } = req.body
    const data = { firstName, lastName, mobile, address }
    if (req.file) data.avatar = req.file.path
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs!')
    const response = await User.findByIdAndUpdate(_id, data, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'Something went wrong!'
    })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs!')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'Something went wrong!'
    })
})

const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('Missing inputs!')
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Something went wrong!'
    })
})

const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, quantity = 1, color, price, thumbnail, title } = req.body
    if (!pid || !color) throw new Error('Missing inputs!')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid && el.color === color)
    if (alreadyProduct) {
        const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, { $set: { "cart.$.quantity": quantity, "cart.$.price": price, "cart.$.thumbnail": thumbnail, "cart.$.title": title } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Updated you cart' : 'Something went wrong!'
        })
    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color, price, thumbnail, title } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Updated your cart' : 'Something went wrong!'
        })
    }
})

const removeProductInCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, color } = req.params
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart.find(el => el.product.toString() === pid && el.color === color)
    if (!alreadyProduct) return res.status(200).json({
        success: true,
        mes: 'Updated your cart'
    })
    const response = await User.findByIdAndUpdate(_id, { $pull: { cart: { product: pid, color } } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated your cart' : 'Something went wrong!'
    })
})

const updateWishList = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid } = req.params
    const user = await User.findById(_id)
    const alreadyInWishList = user.wishlist?.find(el => el.toString() === pid)
    if (alreadyInWishList) {
        const response = await User.findByIdAndUpdate(_id, { $pull: { wishlist: pid } }, { new: true })
        return res.json({
            success: response ? true : false,
            mes: response ? 'Updated your wishlist!' : 'Failed to update wishlist!'
        })
    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { wishlist: pid } }, { new: true })
        return res.json({
            success: response ? true : false,
            mes: response ? 'Updated your wishlist!' : 'Failed to update wishlist!'
        })
    }
})

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart,
    finalRegister,
    removeProductInCart,
    updateWishList
}