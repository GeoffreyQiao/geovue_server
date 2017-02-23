// Schemas.CategorySchema
const mongoose = require('mongoose')
const db = require('../db')
const Schema = mongoose.Schema
const shortId = require('shortid')
    .generate

const category = Schema({
    name: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    pid: {
        type: String,
        ref: 'Category'
    },
    _id: {
        type: String,
        index: true,
        unique: true,
        'default': shortId
    }
}, {
    timestamps: true,
    retainKeyOrder: true,
    versionKey: false
})

category.statics.findIdByName = function(name) { // 通过 name 参数的字符串值,返回调用的 model, 并进行查询
    return this.findOne({ name: name })
}

//最后一行
exports = module.exports = category