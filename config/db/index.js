const { Product, ProductDetail, Unit, Category } = require('./Models')


let pd = {
        name: '软玉',
        brand: '玉溪',
        producer: '云南中烟',
        category: '卷烟',
        items: [{
            barCode: '1234567814734',
            // parent: true,
            // pid: 'SJ-SDFwVKe',
            // timesForParent: 10,
            spec: '10支',
            purchasePrice: 118,
            suggestPrice: 150,
            unit: '条'
        }]
    }
    /*Category.findIdByName('饮料', function(id) {
        console.log(id)
    })*/

Product.add(pd)