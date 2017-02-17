const chalk = require('chalk')

function runAsync1() {
    var p = new Promise(function(resolve, reject) {
        //做一些异步操作
        setTimeout(function() {
            console.log(chalk.green('异步任务1  执行完成'))
            resolve('随便什么数据1');
        }, 1000);
    });
    return p;
}

function runAsync2() {
    var p = new Promise(function(resolve, reject) {
        //做一些异步操作
        setTimeout(function() {
            console.log(chalk.green('异步任务2  执行完成'))
            resolve('随便什么数据2');
        }, 2000);
    });
    return p;
}

function runAsync3() {
    var p = new Promise(function(resolve, reject) {
        //做一些异步操作
        setTimeout(function() {
            console.log(chalk.green('异步任务3  执行完成'))
            resolve('随便什么数据3');
        }, 2000);
    });
    return p;
}

runAsync1() // 异步任务1执行完成
    .then(function(data) {
        console.log(chalk.red(data, '\n')) // 随便什么数据1
        return runAsync2(); // 异步任务2执行完成
    })
    .then(function(data) {
        console.log(chalk.red(data, '\n')) // 随便什么数据2
        return runAsync3(); // 异步任务3执行完成
    })
    .then(function(data) {
        console.log(chalk.red(data, '\n')) // 随便什么数据3
    });