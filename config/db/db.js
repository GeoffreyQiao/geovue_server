const chalk = require('chalk')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
    // mongoose.set('debug', true)
let uri = 'mongodb://127.0.0.1/app'
const dbcon = mongoose.createConnection()
dbcon.open(uri)

mongoose.connection.on('error', console.error.bind(console, '数据库连接错误\n'))
mongoose.connection.on('connected', console.log.bind(console, '成功连接到数据库\n\n\n'))

console.log('\n\n---------------  ', chalk.green('数据库连接成功'), '  ------------------\n')

exports = module.exports = dbcon