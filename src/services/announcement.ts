import { http } from '@/utils/http'

export type AnnouncementItem = {
  id: number
  title: string
  content: string
  createTime: string
  status?: number
}

export const getAnnouncementListAPI = () => {
  return http<AnnouncementItem[]>({
    method: 'GET',
    url: '/notify/announcement/list',
  })
}
