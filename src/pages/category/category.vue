<script setup lang="ts">
import { getCategoryListAPI, getCategoryChildrenAPI } from '@/services/category'
import type { CategoryItem } from '@/types/category'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const categoryList = ref<CategoryItem[]>([])
const activeIndex = ref(0)
const childrenMap = ref<Record<number, CategoryItem[]>>({})
const isLoading = ref(false)

onLoad(async () => {
  isLoading.value = true
  const res = await getCategoryListAPI()
  categoryList.value = res.data || []
  // 默认加载第一个分类的子分�?  if (categoryList.value.length > 0) {
    await loadChildren(categoryList.value[0].id)
  }
  isLoading.value = false
})

const loadChildren = async (parentId: number) => {
  if (childrenMap.value[parentId]) return
  const res = await getCategoryChildrenAPI(parentId)
  childrenMap.value[parentId] = res.data || []
}

const onSelectCategory = async (index: number) => {
  activeIndex.value = index
  const cat = categoryList.value[index]
  if (cat) await loadChildren(cat.id)
}

const currentChildren = () => {
  const cat = categoryList.value[activeIndex.value]
  if (!cat) return []
  return childrenMap.value[cat.id] || []
}
</script>

<template>
  <view class="viewport">
    <!-- 加载�?-->
    <view v-if="isLoading" class="loading-wrap">
      <view v-for="i in 6" :key="i" class="skeleton-item"></view>
    </view>

    <view v-else class="categories">
      <!-- 左侧：一级分�?-->
      <scroll-view class="primary" scroll-y>
        <view
          v-for="(item, index) in categoryList"
          :key="item.id"
          class="primary-item"
          :class="{ active: index === activeIndex }"
          @tap="onSelectCategory(index)"
        >
          <text class="primary-name">{{ item.categoryName }}</text>
        </view>
      </scroll-view>

      <!-- 右侧：二级分�?-->
      <scroll-view enable-back-to-top class="secondary" scroll-y>
        <view v-if="currentChildren().length > 0">
          <view v-for="child in currentChildren()" :key="child.id" class="child-item">
            <view class="child-header">
              <text class="child-name">{{ child.categoryName }}</text>
            </view>
          </view>
        </view>
        <view v-else class="empty-children">
          <text class="empty-text">暂无子分�?/text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #f5f5f5;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.loading-wrap {
  padding: 20rpx;
  .skeleton-item {
    height: 80rpx;
    background-color: #e8e8e8;
    border-radius: 8rpx;
    margin-bottom: 16rpx;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.categories {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.primary {
  width: 200rpx;
  background-color: #fff;

  .primary-item {
    padding: 28rpx 20rpx;
    font-size: 26rpx;
    color: #555;
    border-left: 4rpx solid transparent;

    &.active {
      color: #F76B1C;
      border-left-color: #F76B1C;
      background-color: #f5f5f5;
      font-weight: bold;
    }

    .primary-name {
      display: block;
      text-align: center;
    }
  }
}

.secondary {
  flex: 1;
  background-color: #f5f5f5;
  padding: 16rpx;

  .child-item {
    background-color: #fff;
    border-radius: 12rpx;
    margin-bottom: 16rpx;
    overflow: hidden;

    .child-header {
      padding: 24rpx;
      border-bottom: 1rpx solid #f0f0f0;

      .child-name {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
      }
    }
  }

  .empty-children {
    display: flex;
    justify-content: center;
    padding-top: 100rpx;

    .empty-text {
      font-size: 26rpx;
      color: #bbb;
    }
  }
}
</style>
