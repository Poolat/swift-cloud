/** 商品信息 对应后端 ProductVO */
export type ProductVO = {
  /** 商品ID */
  id: number
  /** 商户ID */
  merchantId: number
  /** 分类ID */
  categoryId?: number
  /** 商品名称 */
  productName: string
  /** 商品图片URL */
  productImage?: string
  /** 商品现价 */
  productPrice: number
  /** 商品原价 */
  originalPrice?: number
  /** 商品描述 */
  description?: string
  /** 库存数量 */
  stock: number
  /** 销售数量 */
  salesCount?: number
  /** 状态：1-上架 0-下架 */
  status: number
}
