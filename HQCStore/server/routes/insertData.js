const router = require('express').Router()
const ctrls = require('../controllers/insertData')

router.post('/product', ctrls.insertProduct)
router.post('/productcategory', ctrls.insertCategory)

module.exports = router