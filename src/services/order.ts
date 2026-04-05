import type {
  OrderVO,
  OrderSubmitParams,
  OrderSubmitVO,
  OrderPageParams,
  PageResult,
  OrderCancelParams,
} from '@/types/order'
import { http } from '@/utils/http'

/**
 * 提交订单
 */
export const postOrderSubmitAPI = (data: OrderSubmitParams) => {
  return http<OrderSubmitVO>({
    method: 'POST',
    url: '/user/order/submit',
    data,
  })
}

/**
 * 分页查询订单列表
 */
export const getOrderPageAPI = (params: OrderPageParams) => {
  return http<PageResult<OrderVO>>({
    method: 'GET',
    url: '/user/order/page',
    data: params,
  })
}

/**
 * 查询订单详情
 * @param id 订单ID
 */
export const getOrderByIdAPI = (id: number) => {
  return http<OrderVO>({
    method: 'GET',
    url: `/user/order/${id}`,
  })
}

/**
 * 取消订单
 */
export const cancelOrderAPI = (data: OrderCancelParams) => {
  return http({
    method: 'PUT',
    url: '/user/order/cancel',
    data,
  })
}

/**
 * 确认签收
 * @param id 订单ID
 */
export const confirmOrderAPI = (id: number) => {
  return http({
    method: 'PUT',
    url: `/user/order/confirm/${id}`,
  })
}
