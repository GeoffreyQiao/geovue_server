// Schemas.UnitSchema
const mongoose = require('../Collection')
const shortId = require('shortid')
    .generate
const Schema = mongoose.Schema

const unit = new Schema( //商品单位 Schema
    { //paths
        name: {
            type: String,
            select: true,
            index: true,
            required: [true, '单位名称必填'],
            unique: true
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


unit.statics.findIdByName = function(name, cb) { // 通过 name 参数的字符串值,返回调用的 model, 并进行查询
        if (typeof name === 'string') {
            return this.findOne({ name: name }, cb)
        }
    }
    //最后一行
exports = module.exports = unit