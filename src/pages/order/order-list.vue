<script setup lang="ts">
import { getOrderPageAPI, cancelOrderAPI, confirmOrderAPI } from '@/services/order'
import type { OrderVO } from '@/types/order'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useMemberStore } from '@/stores'

const memberStore = useMemberStore()
const orderList = ref<OrderVO[]>([])
const isLoading = ref(false)
const page = ref(1)
const hasMore = ref(true)

const STATUS_MAP: Record<number, string> = {
  1: '待接单',
  2: '已接单',
  3: '已完成',
  4: '已取消',
  5: '已拒单',
}
const STATUS_COLOR: Record<number, string> = {
  1: '#ff9800',
  2: '#2196f3',
  3: '#4caf50',
  4: '#999',
  5: '#f44336',
}

const loadOrders = async (reset = false) => {
  if (!memberStore.profile) return
  if (isLoading.value) return
  if (reset) {
    page.value = 1
    hasMore.value = true
  }
  if (!hasMore.value) return
  isLoading.value = true
  try {
    const res = await getOrderPageAPI({ page: page.value, pageSize: 10 })
    const result = res.data
    if (reset) {
      orderList.value = result?.records || []
    } else {
      orderList.value.push(...(result?.records || []))
    }
    hasMore.value = page.value < (result?.pages || 1)
    if (hasMore.value) page.value++
  } finally {
    isLoading.value = false
  }
}

onShow(() => loadOrders(true))

const goToDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/order/order-detail?id=${id}` })
}

const onCancel = async (order: OrderVO) => {
  const reason = await new Promise<string | null>((resolve) => {
    uni.showActionSheet({
      itemList: ['不想要了', '地址填写有误', '其他原因'],
      success: (res) => resolve(['不想要了', '地址填写有误', '其他原因'][res.tapIndex]),
      fail: () => resolve(null),
    })
  })
  if (!reason) return
  await cancelOrderAPI({ id: order.id, cancelReason: reason })
  uni.showToast({ icon: 'success', title: '已取消' })
  loadOrders(true)
}

const onConfirm = async (order: OrderVO) => {
  uni.showModal({
    title: '确认签收',
    content: '确认已收到货物？',
    success: async (res) => {
      if (res.confirm) {
        await confirmOrderAPI(order.id)
        uni.showToast({ icon: 'success', title: '签收成功' })
        loadOrders(true)
      }
    },
  })
}
</script>

<template>
  <view class="container">
    <view v-if="!memberStore.profile" class="not-login">
      <text class="nl-text">请先登录</text>
      <navigator url="/pages/login/login" class="nl-link">去登录</navigator>
    </view>

    <template v-else>
      <view v-if="isLoading && orderList.length === 0" class="loading">
        <text>加载中...</text>
      </view>

      <view v-else-if="orderList.length === 0" class="empty">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无订单</text>
      </view>

      <scroll-view v-else scroll-y class="order-list" @scrolltolower="loadOrders(false)">
        <view
          v-for="order in orderList"
          :key="order.id"
          class="order-card"
          @tap="goToDetail(order.id)"
        >
          <view class="order-header">
            <text class="order-no">订单 {{ order.orderNo }}</text>
            <text class="order-status" :style="{ color: STATUS_COLOR[order.orderStatus] }">
              {{ STATUS_MAP[order.orderStatus] || '未知' }}
            </text>
          </view>

          <view class="order-merchant">
            <text class="merchant-label">商户：</text>
            <text class="merchant-name">{{ order.merchantName || order.merchantId }}</text>
          </view>

          <view class="order-address" v-if="order.receiverName">
            <text class="addr-label">收货：</text>
            <text class="addr-val">{{ order.receiverName }} {{ order.receiverPhone }}</text>
          </view>

          <view class="order-footer">
            <text class="order-time">{{ order.createTime?.substring(0, 10) }}</text>
            <text class="order-amount">¥{{ order.actualAmount?.toFixed(2) }}</text>
          </view>

          <view class="order-actions">
            <view
              v-if="order.orderStatus === 1"
              class="action-btn cancel"
              @tap.stop="onCancel(order)"
              >取消订单</view
            >
            <view
              v-if="order.orderStatus === 2"
              class="action-btn confirm"
              @tap.stop="onConfirm(order)"
              >确认签收</view
            >
          </view>
        </view>

        <view v-if="!hasMore" class="no-more">没有更多了</view>
      </scroll-view>
    </template>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f5f5f5;
}

.container {
  min-height: 100vh;
}

.not-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
  .nl-text {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
  }
  .nl-link {
    background: linear-gradient(135deg, #f76b1c, #ffa42b);
    color: #fff;
    font-size: 28rpx;
    padding: 16rpx 60rpx;
    border-radius: 50rpx;
  }
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
  .empty-icon {
    font-size: 80rpx;
    margin-bottom: 20rpx;
  }
  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.order-list {
  height: 100vh;
}

.order-card {
  background-color: #fff;
  margin: 20rpx 20rpx 0;
  border-radius: 16rpx;
  padding: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);

  .order-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
    .order-no {
      font-size: 24rpx;
      color: #999;
    }
    .order-status {
      font-size: 26rpx;
      font-weight: bold;
    }
  }

  .order-merchant,
  .order-address {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
    .merchant-label,
    .addr-label {
      font-size: 24rpx;
      color: #999;
      width: 80rpx;
      flex-shrink: 0;
    }
    .merchant-name,
    .addr-val {
      font-size: 26rpx;
      color: #333;
    }
  }

  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16rpx;
    border-top: 1rpx solid #f5f5f5;
    padding-top: 16rpx;
    .order-time {
      font-size: 22rpx;
      color: #bbb;
    }
    .order-amount {
      font-size: 30rpx;
      font-weight: bold;
      color: #ff4d4f;
    }
  }

  .order-actions {
    display: flex;
    justify-content: flex-end;
    gap: 16rpx;
    margin-top: 16rpx;
    .action-btn {
      font-size: 24rpx;
      padding: 12rpx 28rpx;
      border-radius: 40rpx;
      border: 1rpx solid;
      &.cancel {
        color: #999;
        border-color: #ccc;
      }
      &.confirm {
        color: #f76b1c;
        border-color: #f76b1c;
      }
    }
  }
}

.no-more {
  text-align: center;
  font-size: 24rpx;
  color: #bbb;
  padding: 30rpx 0;
}
</style>
