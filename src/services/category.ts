import type { CategoryItem } from '@/types/category'
import { http } from '@/utils/http'

/**
 * 查询所有启用的一级分类列表
 */
export const getCategoryListAPI = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/user/category/list',
  })
}

/**
 * 根据父分类ID查询子分类列表
 * @param parentId 父分类ID
 */
export const getCategoryChildrenAPI = (parentId: number) => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/user/category/list/children',
    data: { parentId },
  })
}
