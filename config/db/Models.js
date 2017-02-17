const { product, productDetail, category, unit } = require('./Schemas')
const db = require('./db')

Product = db.model('Product', product)
ProductDetail = db.model('ProductDetail', productDetail)
Category = db.model('Category', category)
Unit = db.model('Unit', unit)


exports = module.exports = {
    Product,
    ProductDetail,
    Category,
    Unit
}