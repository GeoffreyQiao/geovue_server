// Schemas.CategorySchema
const mongoose = require('../Collection')
const shortId = require('shortid')
    .generate
const Schema = mongoose.Schema

const category = new Schema( //商品类目 Schema
    { //paths
        name: {
            type: String,
            select: true,
            index: true,
            required: [true, '类目名称必填!!'],
            unique: true
        },
        pid: {
            type: String,
            ref: 'Category'
        },
        _id: {
            type: String,
            required: true,
            index: true,
            unique: true,
            'default': shortId
        }
    }, { //options
        versionKey: false
    }
)


category.statics.findIdByName = function(name, cb) { // 通过 name 参数的字符串值,返回调用的 model, 并进行查询
    return this.findOne({ name: name }, cb)
}

//最后一行
exports = module.exports = category