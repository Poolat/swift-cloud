import type { MerchantVO } from '@/types/merchant'
import { http } from '@/utils/http'

/**
 * 查询营业中商户列表（服务大厅首页）
 */
export const getMerchantListAPI = () => {
  return http<MerchantVO[]>({
    method: 'GET',
    url: '/user/merchant/list',
  })
}

/**
 * 查询商户详情
 * @param id 商户ID
 */
export const getMerchantByIdAPI = (id: number) => {
  return http<MerchantVO>({
    method: 'GET',
    url: `/user/merchant/${id}`,
  })
}
