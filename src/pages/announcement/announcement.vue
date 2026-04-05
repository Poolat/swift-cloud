<script setup lang="ts">
import { getAnnouncementListAPI, type AnnouncementItem } from '@/services/announcement'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const list = ref<AnnouncementItem[]>([])
const isLoading = ref(false)
const expandedId = ref<number | null>(null)

onLoad(async () => {
  isLoading.value = true
  try {
    const res = await getAnnouncementListAPI()
    list.value = res.data || []
  } finally {
    isLoading.value = false
  }
})

const toggleExpand = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <view class="container">
    <view v-if="isLoading" class="loading">
      <view v-for="i in 4" :key="i" class="skeleton-item"></view>
    </view>

    <view v-else-if="list.length === 0" class="empty">
      <text class="empty-icon">📭</text>
      <text class="empty-text">暂无公告</text>
    </view>

    <view v-else class="ann-list">
      <view
        v-for="item in list"
        :key="item.id"
        class="ann-card"
        @tap="toggleExpand(item.id)"
      >
        <view class="ann-header">
          <view class="ann-title-row">
            <text class="ann-tag">公告</text>
            <text class="ann-title">{{ item.title }}</text>
          </view>
          <text class="ann-arrow">{{ expandedId === item.id ? '�? : '�? }}</text>
        </view>
        <view class="ann-time">{{ item.createTime?.substring(0, 10) }}</view>
        <view v-if="expandedId === item.id" class="ann-content">
          <text>{{ item.content }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f5f5f5;
}

.container {
  padding: 20rpx;
}

.loading {
  .skeleton-item {
    height: 120rpx;
    background-color: #e8e8e8;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;

  .empty-icon {
    font-size: 80rpx;
    margin-bottom: 16rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.ann-list {
  .ann-card {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

    .ann-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      .ann-title-row {
        display: flex;
        align-items: center;
        flex: 1;

        .ann-tag {
          font-size: 20rpx;
          color: #fff;
          background-color: #F76B1C;
          border-radius: 6rpx;
          padding: 2rpx 10rpx;
          margin-right: 12rpx;
          flex-shrink: 0;
        }

        .ann-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          flex: 1;
        }
      }

      .ann-arrow {
        font-size: 24rpx;
        color: #999;
        margin-left: 16rpx;
        flex-shrink: 0;
      }
    }

    .ann-time {
      font-size: 22rpx;
      color: #bbb;
      margin-top: 10rpx;
    }

    .ann-content {
      margin-top: 16rpx;
      padding-top: 16rpx;
      border-top: 1rpx solid #f0f0f0;
      font-size: 26rpx;
      color: #555;
      line-height: 1.7;
    }
  }
}
</style>
