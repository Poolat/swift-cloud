/** 收货地址项 对应后端 Address 实体 */
export type AddressItem = {
  /** 地址ID */
  id: number
  /** 用户ID */
  userId?: number
  /** 收货人姓名 */
  receiverName: string
  /** 收货人电话 */
  phone: string
  /** 省份编码 */
  provinceCode?: string
  /** 省份名称 */
  provinceName?: string
  /** 城市编码 */
  cityCode?: string
  /** 城市名称 */
  cityName?: string
  /** 区/县编码 */
  districtCode?: string
  /** 区/县名称 */
  districtName?: string
  /** 详细地址 */
  detailAddress: string
  /** 地址标签：1-家 2-公司 3-学校 */
  addressLabel?: number
  /** 是否默认：1-是 0-否 */
  isDefault: number
}

/** 新增/修改地址请求参数 */
export type AddressParams = Omit<AddressItem, 'userId'>
