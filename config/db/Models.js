const { product, productDetail, category, unit } = require('./Schemas')
const db = require('./db')
Product = db.model('Product', product)
ProductDetail = db.model('ProductDetail', productDetail)
Category = db.model('Category', category)
Unit = db.model('Unit', unit)


const initQuery = function() {
    return Promise.all([
            Category.find()
            .exec(),
            Unit.find()
            .exec()
        ])
        .then(res => console.log('结果', res),
            err => console.log('处理了', err))
}

exports = module.exports = {
    Product,
    ProductDetail,
    Category,
    Unit
}