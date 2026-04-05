/** 微信登录返回信息 对应后端 UserLoginVO */
export type LoginResult = {
  /** 用户ID */
  id: number
  /** 微信 openid */
  openid: string
  /** JWT 登录凭证 */
  token: string
}

/** 用户详情信息 对应后端 UserInfoVO */
export type ProfileDetail = {
  /** 用户ID */
  id: number
  /** 微信 openid */
  openid: string
  /** 昵称 */
  nickname?: string
  /** 头像URL */
  avatarUrl?: string
  /** 手机号 */
  phone?: string
  /** 性别：0-未知 1-男 2-女 */
  gender?: number
  /** 角色类型：1-普通用户 2-商户 3-配送员 */
  roleType?: number
  /** 角色类型名称 */
  roleTypeName?: string
  /** 账号状态：1-正常 2-审核中 */
  status?: number
  /** 状态名称 */
  statusName?: string
}

/** 更新用户信息请求参数 对应后端 UserUpdateDTO */
export type ProfileParams = {
  /** 昵称 */
  nickname?: string
  /** 头像URL */
  avatarUrl?: string
  /** 手机号 */
  phone?: string
  /** 性别：0-未知 1-男 2-女 */
  gender?: number
}
