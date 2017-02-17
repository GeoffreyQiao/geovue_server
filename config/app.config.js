const unhandledRejections = new Map()
const chalk = require('chalk')

process.on('unhandledRejection', (reason, p) => {
    unhandledRejections.set(p, reason)
});
process.on('rejectionHandled', (p) => {
    unhandledRejections.delete(p)
})
process.on('unhandledRejection', (reason, p) => {
    console.log('Promise 未捕获的 Rejection \"', chalk.red(reason.name), '\" 错误!!!\n错误原因 :', chalk.red(reason.message), '\n错误详情: \n', chalk.red(reason.errors))
})

exports = module.exports = unhandledRejections