// Schemas.ProductDetailSchema
const shortId = require('shortid')
    .generate
const mongoose = require('../Collection')
const Schema = mongoose.Schema
let validErrMsg = '{VALUE} 不是合法的 {PATH} 数据!'
const productDetail = new Schema({
    _id: {
        type: String,
        'default': shortId,
        required: true,
        index: true,
        unique: true
    },
    barCode: { //条码
        type: String,
        index: true,
        unique: [true, '条形码已存在'],
        match: [/^[0-9]{13}$/, validErrMsg],
        required: [true, '条形码为必填项']
    },
    unit_id: { //商品单位
        type: String,
        index: true,
        sparse: true,
        ref: 'Unit'
    },
    parent: { //父级商品
        type: Boolean,
        default: false
    },
    pid: { //父级商品id
        index: true,
        type: String,
        unique: true,
        ref: 'ProductDetail',
        default: ''
    },
    timesForParent: { //与父级商品的数量关系
        type: Number,
        required: true,
        default: 1
    },
    spec: { //规格
        type: String,
        unique: true,
        required: true,
        match: [/^[\u4E00-\u9FA5\w\d]*[•@\/\\\+\-\.]?[\u4E00-\u9FA5\w\d]+$/, validErrMsg]
    },
    purchasePrice: { //成本价
        type: Number,
        required: true
    },
    suggestPrice: { //建议零售价
        type: Number,
        required: true
    },
    inSale: { //是否在售
        type: Boolean,
        default: true
    }
}, { //option for mongoose.Schema
    retainKeyOrder: true,
    versionKey: false
})

productDetail.statics.addOne = function(details, cb) {
    return new Promise((resolve, reject) => {
        Unit.findIdByName(details.unit, (err, unit) => {
            if (err) reject('err on unit', err)
            details.unit_id = unit._id
            resolve(details)
        })
    })
}

//最后一行
exports = module.exports = productDetail