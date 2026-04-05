import type { ProductVO } from '@/types/product'
import { http } from '@/utils/http'

/**
 * 查询商户的上架商品列表
 * @param merchantId 商户ID
 */
export const getProductListByMerchantAPI = (merchantId: number) => {
  return http<ProductVO[]>({
    method: 'GET',
    url: '/user/product/list',
    data: { merchantId },
  })
}

/**
 * 查询商品详情
 * @param id 商品ID
 */
export const getProductByIdAPI = (id: number) => {
  return http<ProductVO>({
    method: 'GET',
    url: `/user/product/${id}`,
  })
}
