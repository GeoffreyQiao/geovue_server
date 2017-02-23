const { Product, ProductDetail, Unit, Category } = require('./Models')
const db = require('./db')
let pd = {
        // name: '硬中华',
        // brand: '中华',
        // producer: '上海中烟',
        // category: '卷烟',
        barCode: '6234567819749',
        product_id: 'ryfYzGjYe',
        // parent: true,
        // pid: 'SJ-SDFwVKe',
        // timesForParent: 10,
        spec: '20支',
        purchasePrice: 65,
        suggestPrice: 70,
        unit: '包'
    }
    /*Category.findIdByName('饮料', function(id) {
        console.log(id)
    })*/

Product.add(pd)