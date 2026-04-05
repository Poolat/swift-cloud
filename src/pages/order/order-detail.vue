<script setup lang="ts">
import { getOrderByIdAPI, cancelOrderAPI, confirmOrderAPI } from '@/services/order'
import type { OrderVO } from '@/types/order'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const order = ref<OrderVO | null>(null)
const isLoading = ref(false)

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

onLoad(async (options) => {
  const id = Number(options?.id)
  if (!id) return
  isLoading.value = true
  try {
    const res = await getOrderByIdAPI(id)
    order.value = res.data
  } finally {
    isLoading.value = false
  }
})

const onCancel = () => {
  if (!order.value) return
  uni.showActionSheet({
    itemList: ['不想要了', '地址填写有误', '其他原因'],
    success: async (res) => {
      const reasons = ['不想要了', '地址填写有误', '其他原因']
      await cancelOrderAPI({ id: order.value!.id, cancelReason: reasons[res.tapIndex] })
      uni.showToast({ icon: 'success', title: '已取消' })
      const res2 = await getOrderByIdAPI(order.value!.id)
      order.value = res2.data
    },
  })
}

const onConfirm = () => {
  uni.showModal({
    title: '确认签收',
    content: '确认已收到货物？',
    success: async (res) => {
      if (res.confirm && order.value) {
        await confirmOrderAPI(order.value.id)
        uni.showToast({ icon: 'success', title: '签收成功' })
        const res2 = await getOrderByIdAPI(order.value.id)
        order.value = res2.data
      }
    },
  })
}
</script>

<template>
  <view class="container">
    <view v-if="isLoading" class="loading"><text>加载中...</text></view>

    <template v-else-if="order">
      <!-- 状态横幅 -->
      <view class="status-banner" :style="{ backgroundColor: STATUS_COLOR[order.orderStatus] }">
        <text class="status-text">{{ STATUS_MAP[order.orderStatus] || '未知' }}</text>
        <text class="order-no">订单编号：{{ order.orderNo }}</text>
      </view>

      <!-- 收货信息 -->
      <view class="section">
        <view class="section-title">收货信息</view>
        <view class="info-row">
          <text class="info-label">收货人</text>
          <text class="info-val">{{ order.receiverName }} {{ order.receiverPhone }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">收货地址</text>
          <text class="info-val">{{ order.fullAddress }}</text>
        </view>
      </view>

      <!-- 商品清单 -->
      <view class="section">
        <view class="section-title">商户：{{ order.merchantName }}</view>
        <view v-for="item in order.orderDetailList" :key="item.id" class="goods-item">
          <image
            v-if="item.productImage"
            class="goods-img"
            :src="item.productImage"
            mode="aspectFill"
          ></image>
          <view v-else class="goods-img-ph"><text>📦</text></view>
          <view class="goods-info">
            <text class="goods-name">{{ item.productName }}</text>
            <view class="goods-footer">
              <text class="goods-price">¥{{ item.productPrice }}</text>
              <text class="goods-qty">× {{ item.quantity }}</text>
              <text class="goods-sub">¥{{ item.subtotal?.toFixed(2) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 费用明细 -->
      <view class="section">
        <view class="section-title">费用明细</view>
        <view class="fee-row">
          <text>商品金额</text><text>¥{{ order.orderAmount?.toFixed(2) }}</text>
        </view>
        <view class="fee-row">
          <text>配送费</text><text>¥{{ order.deliveryFee?.toFixed(2) }}</text>
        </view>
        <view class="fee-row total">
          <text>实付金额</text>
          <text class="fee-total">¥{{ order.actualAmount?.toFixed(2) }}</text>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="section">
        <view class="section-title">订单信息</view>
        <view class="info-row"
          ><text class="info-label">下单时间</text
          ><text class="info-val">{{ order.createTime }}</text></view
        >
        <view class="info-row" v-if="order.remark"
          ><text class="info-label">备注</text
          ><text class="info-val">{{ order.remark }}</text></view
        >
        <view class="info-row" v-if="order.cancelReason"
          ><text class="info-label">取消原因</text
          ><text class="info-val">{{ order.cancelReason }}</text></view
        >
      </view>

      <!-- 操作按钮 -->
      <view class="actions">
        <view v-if="order.orderStatus === 1" class="action-btn cancel" @tap="onCancel"
          >取消订单</view
        >
        <view v-if="order.orderStatus === 2" class="action-btn confirm" @tap="onConfirm"
          >确认签收</view
        >
      </view>
    </template>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f5f5f5;
}
.container {
  padding-bottom: 40rpx;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 100rpx 0;
}

.status-banner {
  padding: 40rpx 30rpx;
  display: flex;
  flex-direction: column;
  .status-text {
    font-size: 36rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 8rpx;
  }
  .order-no {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.section {
  background: #fff;
  margin: 20rpx 0 0;
  padding: 24rpx 30rpx;
  .section-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
  }
}

.info-row {
  display: flex;
  padding: 8rpx 0;
  .info-label {
    font-size: 24rpx;
    color: #999;
    width: 120rpx;
    flex-shrink: 0;
  }
  .info-val {
    font-size: 26rpx;
    color: #333;
    flex: 1;
  }
}

.goods-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  .goods-img {
    width: 110rpx;
    height: 110rpx;
    border-radius: 8rpx;
    flex-shrink: 0;
  }
  .goods-img-ph {
    width: 110rpx;
    height: 110rpx;
    border-radius: 8rpx;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50rpx;
    flex-shrink: 0;
  }
  .goods-info {
    flex: 1;
    margin-left: 20rpx;
    .goods-name {
      font-size: 26rpx;
      color: #333;
      display: block;
      margin-bottom: 12rpx;
    }
    .goods-footer {
      display: flex;
      align-items: center;
      .goods-price {
        font-size: 26rpx;
        color: #ff4d4f;
        margin-right: 16rpx;
      }
      .goods-qty {
        font-size: 24rpx;
        color: #999;
        flex: 1;
      }
      .goods-sub {
        font-size: 26rpx;
        font-weight: bold;
        color: #333;
      }
    }
  }
}

.fee-row {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
  font-size: 26rpx;
  color: #333;
  &.total {
    border-top: 1rpx solid #f0f0f0;
    margin-top: 10rpx;
    padding-top: 16rpx;
    font-weight: bold;
  }
  .fee-total {
    font-size: 30rpx;
    color: #ff4d4f;
  }
}

.actions {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 30rpx;
  gap: 20rpx;
  .action-btn {
    font-size: 26rpx;
    padding: 16rpx 40rpx;
    border-radius: 50rpx;
    border: 1rpx solid;
    &.cancel {
      color: #999;
      border-color: #ccc;
    }
    &.confirm {
      background: linear-gradient(135deg, #f76b1c, #ffa42b);
      color: #fff;
      border-color: #f76b1c;
    }
  }
}
</style>
