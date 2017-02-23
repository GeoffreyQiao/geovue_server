#  添加商品业务流程

* ## **首先在获得外部传入的商品数据后, 业务流程分为以下几种情况:**
  ```mermaid
    graph LR
    classDef classEnd fill:#f9f,stroke:#333,stroke-width:4px
    input(input 的外部数据)==>hasProductId{是否有 product_id}
    hasProductId==true==>findProduct{查找 product}
    findProduct==true==>saveProduct(缓存 product)
    saveProduct==>hasProductDetail{是否有 barcode}
    hasProductId==false==>findProductByName{通过 name 查找 product}
    hasProductDetail==true==>addProductDetail(新增 ProductDetail)
    addProductDetail==>productDetailAdded{新增 ProductDetail 是否成功}
    productDetailAdded==true==>addNewProductDetailIdToProduct(向 product_id 对应的商品信息添加新增 productDetail 的 ID)
    findProductByName==>findProduct
    findProduct==false==>checkParams{检查是否含有新增 product 的必要属性}
    checkParams==true==>createProduct(新增 product)
    checkParams==false==>return
    createProduct==>saveProduct

    hasProductDetail==false==>return[返回]
    addNewProductDetailIdToProduct==>return
    class return classEnd
  ```
  1. ### 有商品基础信息, 只需要新增商品实体
    + 传入的商品信息结构如下图:
      ```mermaid
      graph TB
        入口["input:外部输入值"]
        subgraph 
          入口==必要==>属性barCode(barCode)
          入口==>属性spec(spec)
          入口==>属性unit_id(unit_id)
          入口==>属性otherAttrs(otherAttrs...)
        end
        入口==必要==>属性product_id(product_id)
      ```
      只需要图中所示为**必要**的两个属性

    + 与另外两个流程最大的区别就是在于只有本流程有 **product_id**, 所以首先应判断 **product_id** 是否存在

      ```javascript
      function hasProductId(obj){
        //如果存在,直接返回符合要求的 obj
        if(obj.product_id) return obj

        //product_id 不存在时, 就要获取 product_id 了
        getProductId(obj)
      }
      ```

    + 创造一个合法有效的 **product_id** 其实就是创造一个合法的 **product** 信息, 传入的数据当中没有具体的 **product_id**, 就肯定有寻找 **product_id** 需要的 **name** 属性. 从 Product 中查询对应 **name** 的结果在这里有两种可能

      1. 查询结果不为空. 有对应的商品信息
      1. 查询结果为空, 需要新建对应的商品信息


  1. ### 无商品基础信息, 需要新增商品实体

  1. ### 只需要新增商品实体
