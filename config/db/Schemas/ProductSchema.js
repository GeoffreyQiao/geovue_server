// Schemas.ProductSchema
const mongoose = require('mongoose')
const db = require('../db')
const PinYin = require('../../../libs/pinyin')
const productDetail = require('./ProductDetailSchema')
const shortId = require('shortid')
    .generate
const chalk = require('chalk')
const Schema = mongoose.Schema

let validErrMsg = '{VALUE} 不是合法的 {PATH} 数据!'

const product = new Schema( //商品 Schema
    { //paths 字段集合
        name: { //商品名称
            type: String,
            index: true,
            unique: true,
            required: true,
            match: [/^[\u4E00-\u9FA5\w\d]{1,5}[•@/\\\+\-\.]?[\u4E00-\u9FA5\w\d]{1,10}$/, '商品名称不能为空']
        },
        aliasName: { //品名缩写/助记符
            type: String,
            uppercase: true,
            required: true,
            match: [/^\w{2,8}\d{0,2}$/, '{VALUE} 错误! 别名/速记名只能为 "2-8 位字母 + 0-2 位数字" 组成, 建议使用商品名每个字的拼音首页字母, 若有重复可使用数字后缀区分']
        },
        brand: { //品牌
            type: String,
            index: true,
            macth: [/^[\u4E00-\u9FA5\w\d]{2, 10}$/, validErrMsg]
        },
        producer: { //厂商
            type: String,
            required: true,
            match: [/[\u4E00-\u9FA5]{2,10}/, validErrMsg]
        },
        category_id: { //商品类型
            type: String,
            ref: 'Category'
        },
        _id: {
            type: String,
            'default': shortId,
            required: true,
            index: true,
            unique: true
        },
        items: [productDetail]
    }, { //option for mongoose.Schema
        timestamps: true,
        retainKeyOrder: true,
        versionKey: false
    }
)

/**
 * @desc   通过一个字符串值和一个字符串表示的所对应 model 模型名, 从数据库中获取字符串值所对应的 _id 值
 * @param  {String} name            需要查询数据库中对应 _id 的文本值.
 * @param  {String} modelName       进行查询的 db.model 名
 * @example _getHelpIds('饮料', 'Category')
 * @return {Promise} doc._id        返回以字符串形式的 _id 值为唯一参数的 Promise
 */
function _getHelpIds(name, modelName) {
    return new Promise((resolve, reject) => {
        if (name) {
            db.model(modelName)
                .findIdByName(name, function(err, doc) {
                    if (err) reject(new Error(`没找到对应项`, err))
                    resolve(doc._id)
                })
        }
    })
}

/**
 * @desc   传入一个商品实体属性数组, 返回一个对应的由 _getHelpIds 方法创建的 Promise.all 对象, 其 resolve 的参数为 itemArr参数对应的 unit_id 数组
 * @param  {Array}          itemArr     一个以包含商品实体属性的对象数组
 * @return {Promise.all}                [unit_id]
 */
function _makeListPromise(itemArr) {
    const arr = []
    itemArr.forEach(function(item, index) {
        arr[index] = _getHelpIds(item.unit, 'Unit')
    })
    return arr
}

/**
 * @param {any} params
 * @returns
 */
function _wrapPromise(params) {
    return Promise.resolve(params)
}

product.static({
    /**
     * @param {any} p
     */
    _addNew(p) {
        _wrapPromise(p)
            .then(p => {
                p.aliasName = PinYin.getFirstLetter(p.name)
                return Promise.all(_makeListPromise(p.items))
            })
            .then(ids => {
                ids.forEach(function(id, index) {
                    p.items[index].unit_id = id
                })
                return p
            })
            .then(p => {
                return Product.create(p)
                    .then(() => console.log('新增商品成功'))
            })
            .catch(err => console.log('错误:\n', err))
    },

    /**
     * @desc    新增子商品
     * @param  {entiry} pdt
     * @param  {Array[ProductDetail]} items
     */
    _addSub(pdt, items) {
        return Promise.all(_makeListPromise(items))
            .then(ids => {
                ids.forEach(function(id, index) {
                    items[index].unit_id = id
                    delete items[index].unit
                })
                return items
            })
            .then(items => {
                const arr = []
                    // let query = pdt.where(items)
                items.forEach(function(item, index) {
                    // query.push(item)
                    // pdt.update({ items: { $push: item } }, { upsert: true })
                    arr.push(pdt.update({ $push: { items: item } })
                        .exec())
                })
                return Promise.all(arr)
            })
    },

    /* 根据参数 p:Object 判断是否存在当前商品, 存在则新增代表商品实体的子文档, 否则新建一个商品 */
    add(p) {
        if (p.category) {
            return _getHelpIds(p.category, 'Category')
                .then(id => {
                    p.category_id = id
                    return Product.findOne({ name: p.name, category_id: id }, 'items')
                        .exec()
                        .then(pdt => {
                            if (pdt) {
                                return Product._addSub(pdt, p.items)
                                    .then(() => console.log('新增商品实体成功'))
                            }
                            return Product._addNew(p)
                        })
                })
                .catch(err => console.log(err))
        }
    },

    /**
     * @param {any} id
     * @param {any} newPaths
     */
    edit(id, newPaths) {
        Product.findById(id)
            .exec()
            .then(p => {
                if (!p) return new Error('该 ID 所代表商品不存在')
            })
    }
})

exports = module.exports = product