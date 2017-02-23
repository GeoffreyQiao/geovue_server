// Schemas.CategorySchema
const mongoose = require('mongoose')
const db = require('../db')
const Schema = mongoose.Schema
const shortId = require('shortid')
    .generate
const PinYin = require('../../../libs/pinyin')

const product = Schema({
    name: {
        type: String,
        text: true,
        required: true,
        unique: true
    },
    category_id: {
        type: String,
        ref: 'Category'
    },
    aliasName: {
        type: String,
        text: true,
        sparse: true,
        uppercase: true
    },
    brand: {
        type: String,
        text: true,
        sparse: true
    },
    producer: {
        type: String,
        text: true,
        sparse: true
    },
    _id: {
        type: String,
        index: true,
        unique: true,
        'default': shortId
    },
    items: [{
        type: String,
        index: true,
        unique: true,
        ref: 'ProductDetail'
    }]
}, {
    timestamps: true,
    retainKeyOrder: true,
    versionKey: false
})


function findCateId(obj) {
    if (!obj.category_id) {
        return Category.findIdByName(obj.category)
            .then(cate => {
                obj.category_id = cate._id
                return obj
            })
    } else {
        return obj
    }
}

/**
 * @description 捕获并打印错误信息
 * 
 * @param {Error} err 
 */
function printError(err) {
    console.log('运行信息:\n', err)
}

/**
 * @description 提示并完成 Promise 流
 * 
 */
function endPromiseFlow(msg = '') {
    if (!msg) {
        console.log('此操作结束...\n')
        return
    }
    msg = `Mssages: \n
        ${msg}
        
        此操作结束...\n`
    return
}


product.statics = {
    add(p) {
        let cacheProduct = new Object()
        Promise.resolve(p)
            .then(findProduct)
            .then(res => {
                cacheProduct = res
                return
            })
            .then(() => {
                return [p, cacheProduct._id]
            })
            .then(hasDetailNeedCreate)
            .then(res => {
                if (res[0]) {
                    cacheProduct.items.push(res[1])
                    return cacheProduct.save()
                }
                return
            })
            .catch(printError)
            .then(endPromiseFlow)
    }
}

function hasDetailNeedCreate(data) {
    /*    let msg = `新增商品成功
            商品ID  : ${p._id}
            商品名  : ${p.name}
            所属类目: ${p.category_id}
        `
    */
    let [p, id] = data
    if (p.barCode) {
        return ProductDetail.add(p, id)
            .then(res => [res, id])
            .then(addItemsId)
    }
    return false
}

function addItemsId(data) {
    let [res, id] = data
    if (res.product_id == id) {
        return [true, res._id]
    }
    return [false, null]
}

function createProduct(p) {
    return Promise.resolve(p)
        .then(findCateId)
        .then(pdata => Product.create(pdata))
}

function findProduct(obj) {
    if (obj.product_id) {
        return Product.findById(obj.product_id)
            .then(p => {
                return p
            })
    }
    return Product.findOne({ name: obj.name })
        .then(p => {
            if (p) return p
            return createProduct(obj)
        })
}

product.pre('validate', function(next) {
    this.aliasName = PinYin.getFirstLetter(this.name)
    next()
})

exports = module.exports = product