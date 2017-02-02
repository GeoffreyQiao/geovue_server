import mongoose from 'mongoose'
const Schema = mongoose.Schema

/**
 * @example
 *     var PersonSchema;   Person的文本属性
 *     var PersonModel;    Person的数据库模型
 *     var PersonEntity;   Person实体
 */

const schemas = {
    Product: new Schema({
        barcode: {
            type: String
        }
    })
}