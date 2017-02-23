// Schemas.ProductDetailSchema
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const db = require('../db')
const shortId = require('shortid')
    .generate

const productDetail = Schema({
    _id: {
        type: String,
        index: true,
        unique: true,
        'default': shortId
    },
    product_id: {
        type: String,
        index: true,
        ref: 'Product',
        required: true
    },
    barCode: {
        type: String,
        index: true,
        unique: true,
        match: /^\d{4,13}[[\-\.]?\d*]?$/,
        required: true
    },
    unit_id: {
        type: String,
        index: true,
        ref: 'Unit'
    },
    base: {
        type: 'Boolean',
        default: true
    },
    parent_id: {
        type: String,
        index: true,
        unique: true,
        ref: 'ProductDetail'
    },
    timesForParent: {
        type: 'Number',
        required: true,
        default: 1
    },
    spec: {
        type: String,
        unique: true,
        required: true,
        match: /^[\u4E00-\u9FA5\w\d]*[•@\\\/\+\-\.]?[\u4E00-\u9FA5\w\d]+$/
    },
    purchasePrice: {
        type: Number,
        required: true
    },
    suggestPrice: {
        type: Number,
        required: true
    },
    inSale: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    retainKeyOrder: true,
    versionKey: false
})

productDetail.static({

    add(details, id) {
        return Promise.resolve([details, id])
            .then(createDetail)
            .then(afterCreate)
            .catch(err => console.log(err))
    }
})

function afterCreate(res) {
    if (res) return res
    throw new Error('ERROR:\n\t新增商品详情结果为空')
}

function createDetail(data) {
    return Promise.resolve(data)
        .then(findUnitId)
        .then(pdata => ProductDetail.create(pdata))
}

function findUnitId(data) {
    let [detail, pid] = data
    if (pid) detail.product_id = pid
    if (!detail.unit_id) {
        return Unit.findIdByName(detail.unit)
            .then(unit => {
                detail.unit_id = unit._id
                return detail
            })
    } else {
        return detail
    }
}
//最后一行
exports = module.exports = productDetail