/** 订单商品明细 对应后端 OrderDetail 实体 */
export type OrderDetailItem = {
  id: number
  orderId: number
  productId: number
  productName: string
  productImage?: string
  productPrice: number
  quantity: number
  subtotal: number
}

/** 订单详情 对应后端 OrderVO */
export type OrderVO = {
  /** 订单ID */
  id: number
  /** 订单编号 */
  orderNo: string
  /** 用户ID */
  userId: number
  /** 商户ID */
  merchantId: number
  /** 收货地址ID */
  addressId: number
  /** 商品总金额 */
  orderAmount: number
  /** 配送费 */
  deliveryFee: number
  /** 实付金额 */
  actualAmount: number
  /** 订单状态：1-待接单 2-已接单 3-已完成 4-已取消 5-已拒单 */
  orderStatus: number
  /** 订单状态名称 */
  orderStatusName?: string
  /** 支付状态：0-未支付 1-已支付 */
  paymentStatus: number
  /** 备注 */
  remark?: string
  /** 取消/拒绝原因 */
  cancelReason?: string
  /** 预计到达时间 */
  estimatedArrival?: string
  /** 下单时间 */
  createTime: string
  /** 更新时间 */
  updateTime?: string
  /** 商户名称 */
  merchantName?: string
  /** 收货人姓名 */
  receiverName?: string
  /** 收货人电话 */
  receiverPhone?: string
  /** 完整收货地址 */
  fullAddress?: string
  /** 订单商品明细列表 */
  orderDetailList?: OrderDetailItem[]
}

/** 提交订单请求参数 对应后端 OrderSubmitDTO */
export type OrderSubmitParams = {
  /** 收货地址ID */
  addressId: number
  /** 商户ID */
  merchantId: number
  /** 配送费 */
  deliveryFee: number
  /** 备注 */
  remark?: string
  /** 商品明细 */
  items: { productId: number; quantity: number }[]
}

/** 提交订单返回 对应后端 OrderSubmitVO */
export type OrderSubmitVO = {
  id: number
  orderNo: string
}

/** 订单分页查询参数 */
export type OrderPageParams = {
  page: number
  pageSize: number
  orderStatus?: number
}

/** 分页结果 */
export type PageResult<T> = {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/** 取消订单参数 */
export type OrderCancelParams = {
  id: number
  cancelReason: string
}
