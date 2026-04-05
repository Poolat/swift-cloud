import type { LoginResult } from '@/types/member'
import { http } from '@/utils/http'

/**
 * 微信小程序登录
 * @param code wx.login() 返回的临时登录凭证
 */
export const postLoginWxMinAPI = (code: string) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/user/user/login',
    data: { code },
  })
}
