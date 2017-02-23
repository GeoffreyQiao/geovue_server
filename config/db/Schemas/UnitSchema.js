// Schemas.UnitSchema
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const db = require('../db')
const shortId = require('shortid')
    .generate


const unit = new Schema( //商品单位 Schema
    { //paths
        name: {
            type: String,
            select: true,
            index: true,
            required: true,
            unique: true
        },
        _id: {
            type: String,
            required: true,
            index: true,
            unique: true,
            'default': shortId
        },
        pid: {
            type: String,
            ref: 'Unit'
        }
    }, {
        timestamps: true,
        retainKeyOrder: true,
        versionKey: false
    }
)


unit.statics.findIdByName = function(name) { // 通过 name 参数的字符串值,返回调用的 model, 并进行查询
        return this.findOne({ name: name })
    }
    //最后一行
exports = module.exports = unit