import type { AddressItem, AddressParams } from '@/types/address'
import { http } from '@/utils/http'

/**
 * 查询当前用户地址列表
 */
export const getAddressListAPI = () => {
  return http<AddressItem[]>({
    method: 'GET',
    url: '/user/address/list',
  })
}

/**
 * 新增地址
 */
export const postAddressAPI = (data: AddressParams) => {
  return http({
    method: 'POST',
    url: '/user/address',
    data,
  })
}

/**
 * 修改地址
 */
export const putAddressAPI = (data: AddressParams) => {
  return http({
    method: 'PUT',
    url: '/user/address',
    data,
  })
}

/**
 * 删除地址
 * @param id 地址ID
 */
export const deleteAddressAPI = (id: number) => {
  return http({
    method: 'DELETE',
    url: '/user/address',
    data: { id },
  })
}

/**
 * 查询默认地址
 */
export const getDefaultAddressAPI = () => {
  return http<AddressItem>({
    method: 'GET',
    url: '/user/address/default',
  })
}

/**
 * 设置默认地址
 * @param id 地址ID
 */
export const setDefaultAddressAPI = (id: number) => {
  return http({
    method: 'PUT',
    url: '/user/address/default',
    data: { id },
  })
}
