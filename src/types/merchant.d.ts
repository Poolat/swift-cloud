/** 商户信息 对应后端 MerchantVO */
export type MerchantVO = {
  /** 商户ID */
  id: number
  /** 关联用户ID */
  userId: number
  /** 商户名称 */
  merchantName: string
  /** 营业执照号 */
  businessLicense?: string
  /** 营业执照URL */
  licenseUrl?: string
  /** 联系人姓名 */
  contactName?: string
  /** 联系电话 */
  contactPhone?: string
  /** 经营地址 */
  businessAddress?: string
  /** 营业状态：1-休息中 2-营业中 */
  businessStatus: number
  /** 审核状态：0-待审核 1-已通过 2-已拒绝 */
  status: number
  /** 创建时间 */
  createTime?: string
  /** 用户昵称 */
  userNickname?: string
  /** 用户手机号 */
  userPhone?: string
}
