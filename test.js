      ``
      `mermaid
      graph TB
        input(input 的外部数据)-->hasProductId{是否有 product_id}
        hasProductId--true-->hasProductDetail{是否有 productDetail}
        hasProductId--false-->findProductId{通过 name 查找 product_id}
        subgraph 有id
          hasProductDetail--true-->addProductDetail(新增 ProductDetail)
          addProductDetail-->productDetailAdded{新增 ProductDetail 是否成功}
          productDetailAdded--true-->addNewProductDetailIdToProduct(向 product_id 对应的商品信息添加新增 productDetail 的 ID)
        end
        subgraph 没id
          findProductId--false-->createProduct(新增 product)
        end
      `
      ``