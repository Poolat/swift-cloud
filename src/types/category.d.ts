/** 分类项 对应后端 Category 实体 */
export type CategoryItem = {
  /** 分类ID */
  id: number
  /** 分类名称 */
  categoryName: string
  /** 分类层级：1-一级 2-二级 */
  categoryLevel: number
  /** 父分类ID（一级分类为null） */
  parentId?: number
  /** 状态：1-启用 0-禁用 */
  status: number
  /** 子分类列表（前端聚合，非后端字段） */
  children?: CategoryItem[]
}
