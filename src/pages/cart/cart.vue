<script setup lang="ts">
import { getAddressListAPI } from '@/services/address'
import { postOrderSubmitAPI } from '@/services/order'
import type { AddressItem } from '@/types/address'
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores'
import { useMemberStore } from '@/stores'

const cartStore = useCartStore()
const memberStore = useMemberStore()

const addressList = ref<AddressItem[]>([])
const selectedAddressId = ref<number | null>(null)
const remark = ref('')
const submitting = ref(false)
const DELIVERY_FEE = 5

const cartItems = computed(() => cartStore.items)
const totalAmount = computed(() => cartStore.totalAmount)
const actualAmount = computed(() => totalAmount.value + DELIVERY_FEE)

onShow(async () => {
  if (!memberStore.profile) return
  const res = await getAddressListAPI()
  addressList.value = res.data || []
  // 自动选中默认地址
  const def = addressList.value.find((a) => a.isDefault === 1)
  if (def && !selectedAddressId.value) selectedAddressId.value = def.id
})

const onSelectAddress = (id: number) => {
  selectedAddressId.value = id
}

const goAddAddress = () => {
  uni.navigateTo({ url: '/pages/address/address' })
}

const goToLogin = () => {
  uni.navigateTo({ url: '/pages/login/login' })
}

const onSubmit = async () => {
  if (!memberStore.profile) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }
  if (!selectedAddressId.value) {
    uni.showToast({ icon: 'none', title: '请选择收货地址' })
    return
  }
  if (cartItems.value.length === 0) {
    uni.showToast({ icon: 'none', title: '购物车为空' })
    return
  }
  submitting.value = true
  try {
    const res = await postOrderSubmitAPI({
      addressId: selectedAddressId.value,
      merchantId: cartStore.currentMerchantId!,
      deliveryFee: DELIVERY_FEE,
      remark: remark.value,
      items: cartItems.value.map((i) => ({ productId: i.id, quantity: i.count })),
    })
    cartStore.clearCart()
    uni.showToast({ icon: 'success', title: '下单成功' })
    setTimeout(() => {
      uni.navigateTo({ url: `/pages/order/order-detail?id=${res.data.id}` })
    }, 500)
  } catch {
    uni.showToast({ icon: 'none', title: '下单失败，请重试' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="container">
    <!-- 未登录提示 -->
    <view v-if="!memberStore.profile" class="not-login">
      <text class="nl-icon">🔐</text>
      <text class="nl-text">请先登录后使用</text>
      <button class="nl-btn" @tap="goToLogin">去登录</button>
    </view>

    <template v-else>
      <!-- 收货地址区域 -->
      <view class="section address-section">
        <view class="section-title">收货地址</view>
        <view v-if="addressList.length === 0" class="no-address" @tap="goAddAddress">
          <text class="na-icon">📍</text>
          <text class="na-text">暂无地址，点击添加</text>
          <text class="na-arrow">›</text>
        </view>
        <view v-else>
          <view
            v-for="addr in addressList"
            :key="addr.id"
            class="address-item"
            :class="{ selected: addr.id === selectedAddressId }"
            @tap="onSelectAddress(addr.id)"
          >
            <view class="addr-radio">
              <text v-if="addr.id === selectedAddressId" class="radio-dot selected-dot">●</text>
              <text v-else class="radio-dot">○</text>
            </view>
            <view class="addr-info">
              <view class="addr-top">
                <text class="addr-name">{{ addr.receiverName }}</text>
                <text class="addr-phone">{{ addr.phone }}</text>
                <text v-if="addr.isDefault === 1" class="addr-default">默认</text>
              </view>
              <text class="addr-detail">
                {{
                  [addr.provinceName, addr.cityName, addr.districtName, addr.detailAddress]
                    .filter(Boolean)
                    .join(' ')
                }}
              </text>
            </view>
          </view>
          <view class="add-addr-row" @tap="goAddAddress">
            <text class="add-addr-text">+ 添加新地址</text>
          </view>
        </view>
      </view>

      <!-- 商品列表 -->
      <view class="section goods-section">
        <view class="section-title">商品清单</view>
        <view v-if="cartItems.length === 0" class="empty-cart">
          <text class="empty-icon">🛒</text>
          <text class="empty-text">购物车为空，去选购商品吧</text>
        </view>
        <view v-else>
          <view v-for="item in cartItems" :key="item.id" class="goods-item">
            <image v-if="item.image" class="goods-img" :src="item.image" mode="aspectFill"></image>
            <view v-else class="goods-img-placeholder"><text>📦</text></view>
            <view class="goods-info">
              <text class="goods-name">{{ item.name }}</text>
              <view class="goods-footer">
                <text class="goods-price">¥{{ item.price }}</text>
                <view class="goods-qty">
                  <text class="qty-btn" @tap="cartStore.removeItem(item.id)">－</text>
                  <text class="qty-num">{{ item.count }}</text>
                  <text class="qty-btn" @tap="cartStore.addItem({ ...item, count: 1 })">＋</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 备注 -->
      <view class="section remark-section">
        <view class="section-title">订单备注</view>
        <input
          class="remark-input"
          v-model="remark"
          placeholder="选填，可填写特殊需求"
          :maxlength="100"
        />
      </view>

      <!-- 费用明细 -->
      <view class="section fee-section">
        <view class="fee-row">
          <text class="fee-label">商品小计</text>
          <text class="fee-value">¥{{ totalAmount.toFixed(2) }}</text>
        </view>
        <view class="fee-row">
          <text class="fee-label">配送费</text>
          <text class="fee-value">¥{{ DELIVERY_FEE.toFixed(2) }}</text>
        </view>
        <view class="fee-row total-row">
          <text class="fee-label">实付金额</text>
          <text class="fee-total">¥{{ actualAmount.toFixed(2) }}</text>
        </view>
      </view>
    </template>

    <!-- 底部提交栏 -->
    <view v-if="memberStore.profile" class="submit-bar">
      <text class="submit-total">¥{{ actualAmount.toFixed(2) }}</text>
      <button
        class="submit-btn"
        :disabled="submitting || cartItems.length === 0"
        :loading="submitting"
        @tap="onSubmit"
      >
        提交订单
      </button>
    </view>
  </view>
</template>

<style lang="scss">
$primary: #f76b1c;
$navy: #1b2d5e;
$navy-light: #2a4494;
$bg: #f4f5f9;
$card: #ffffff;
$text-1: #1a1a2e;
$text-2: #64748b;
$text-3: #94a3b8;

page {
  background-color: $bg;
  padding-bottom: 120rpx;
}

.container {
  padding-bottom: 120rpx;
}

.not-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;

  .nl-icon {
    font-size: 80rpx;
    margin-bottom: 20rpx;
  }
  .nl-text {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 30rpx;
  }
  .nl-btn {
    background: linear-gradient(135deg, #f76b1c, #ffa42b);
    color: #fff;
    font-size: 28rpx;
    padding: 16rpx 60rpx;
    border-radius: 50rpx;
    box-shadow: 0 6rpx 20rpx rgba(247, 107, 28, 0.35);
  }
}

.section {
  background-color: $card;
  margin-bottom: 16rpx;
  padding: 28rpx 30rpx;

  .section-title {
    font-size: 26rpx;
    font-weight: bold;
    color: $text-2;
    margin-bottom: 20rpx;
    text-transform: uppercase;
    letter-spacing: 1rpx;
  }
}

.no-address {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
  .na-icon {
    font-size: 32rpx;
    margin-right: 12rpx;
  }
  .na-text {
    flex: 1;
    font-size: 26rpx;
    color: #999;
  }
  .na-arrow {
    font-size: 36rpx;
    color: #ccc;
  }
}

.address-item {
  display: flex;
  align-items: flex-start;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &.selected {
    background-color: #fff4ec;
    border-radius: 12rpx;
    padding: 16rpx 10rpx;
    border: 1rpx solid rgba(247, 107, 28, 0.2);
  }

  .addr-radio {
    padding-top: 4rpx;
    margin-right: 16rpx;
    .radio-dot {
      font-size: 32rpx;
      color: #ccc;
      &.selected-dot {
        color: $primary;
      }
    }
  }

  .addr-info {
    flex: 1;
    .addr-top {
      display: flex;
      align-items: center;
      margin-bottom: 8rpx;
      .addr-name {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-right: 16rpx;
      }
      .addr-phone {
        font-size: 26rpx;
        color: #555;
        flex: 1;
      }
      .addr-default {
        font-size: 20rpx;
        color: $primary;
        border: 1rpx solid $primary;
        border-radius: 4rpx;
        padding: 2rpx 8rpx;
      }
    }
    .addr-detail {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.add-addr-row {
  padding: 20rpx 0 4rpx;
  .add-addr-text {
    font-size: 26rpx;
    color: #f76b1c;
  }
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  .empty-icon {
    font-size: 60rpx;
    margin-bottom: 16rpx;
  }
  .empty-text {
    font-size: 26rpx;
    color: #999;
  }
}

.goods-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  .goods-img {
    width: 120rpx;
    height: 120rpx;
    border-radius: 8rpx;
    flex-shrink: 0;
  }
  .goods-img-placeholder {
    width: 120rpx;
    height: 120rpx;
    border-radius: 8rpx;
    background-color: #f5f5f5;
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
      margin-bottom: 12rpx;
      display: block;
    }
    .goods-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .goods-price {
        font-size: 28rpx;
        font-weight: bold;
        color: #ff4d4f;
      }
      .goods-qty {
        display: flex;
        align-items: center;
        .qty-btn {
          width: 44rpx;
          height: 44rpx;
          line-height: 44rpx;
          text-align: center;
          background-color: #f5f5f5;
          border-radius: 50%;
          font-size: 30rpx;
          color: #333;
        }
        .qty-num {
          min-width: 50rpx;
          text-align: center;
          font-size: 26rpx;
        }
      }
    }
  }
}

.remark-input {
  width: 100%;
  height: 64rpx;
  font-size: 26rpx;
  color: #333;
  background-color: #f7f7f7;
  border-radius: 8rpx;
  padding: 0 20rpx;
}

.fee-section {
  .fee-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 0;
    .fee-label {
      font-size: 26rpx;
      color: #666;
    }
    .fee-value {
      font-size: 26rpx;
      color: #333;
    }
  }
  .total-row {
    border-top: 1rpx solid #f0f0f0;
    margin-top: 10rpx;
    padding-top: 16rpx;
    .fee-label {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }
    .fee-total {
      font-size: 32rpx;
      font-weight: bold;
      color: #ff4d4f;
    }
  }
}

.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background-color: $card;
  border-top: 1rpx solid #f0f2f8;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 30rpx;
  box-shadow: 0 -4rpx 20rpx rgba(27, 45, 94, 0.08);

  .submit-total {
    font-size: 36rpx;
    font-weight: bold;
    color: $primary;
    margin-right: 24rpx;
  }

  .submit-btn {
    background: linear-gradient(135deg, $primary, #ffa42b);
    color: #fff;
    font-size: 28rpx;
    font-weight: bold;
    padding: 16rpx 50rpx;
    border-radius: 50rpx;
    box-shadow: 0 6rpx 20rpx rgba(247, 107, 28, 0.35);
    &[disabled] {
      opacity: 0.5;
    }
  }
}
</style>
