<script setup lang="ts">
import { getAddressListAPI, deleteAddressAPI, setDefaultAddressAPI } from '@/services/address'
import type { AddressItem } from '@/types/address'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

const addressList = ref<AddressItem[]>([])
const isLoading = ref(false)

const loadAddresses = async () => {
  isLoading.value = true
  try {
    const res = await getAddressListAPI()
    addressList.value = res.data || []
  } finally {
    isLoading.value = false
  }
}

onShow(() => loadAddresses())

const goEdit = (id?: number) => {
  uni.navigateTo({ url: `/pages/address/address-form?id=${id || ''}` })
}

const onDelete = (item: AddressItem) => {
  uni.showModal({
    title: '删除地址',
    content: `确认删除 ${item.receiverName} 的地址？`,
    success: async (res) => {
      if (res.confirm) {
        await deleteAddressAPI(item.id)
        uni.showToast({ icon: 'success', title: '已删除' })
        loadAddresses()
      }
    },
  })
}

const onSetDefault = async (item: AddressItem) => {
  if (item.isDefault === 1) return
  await setDefaultAddressAPI(item.id)
  uni.showToast({ icon: 'success', title: '已设为默认' })
  loadAddresses()
}
</script>

<template>
  <view class="container">
    <view v-if="isLoading" class="loading"><text>加载中...</text></view>

    <view v-else-if="addressList.length === 0" class="empty">
      <text class="empty-icon">📭</text>
      <text class="empty-text">暂无收货地址</text>
    </view>

    <view v-else class="address-list">
      <view v-for="item in addressList" :key="item.id" class="address-card">
        <view class="card-main" @tap="goEdit(item.id)">
          <view class="addr-header">
            <text class="addr-name">{{ item.receiverName }}</text>
            <text class="addr-phone">{{ item.phone }}</text>
            <text v-if="item.isDefault === 1" class="addr-default">默认</text>
          </view>
          <text class="addr-detail">
            {{
              [item.provinceName, item.cityName, item.districtName, item.detailAddress]
                .filter(Boolean)
                .join(' ')
            }}
          </text>
          <text v-if="item.addressLabel" class="addr-label">{{ item.addressLabel }}</text>
        </view>
        <view class="card-actions">
          <view class="action-btn set-default" @tap="onSetDefault(item)">
            <text>{{ item.isDefault === 1 ? '✓ 默认' : '设为默认' }}</text>
          </view>
          <view class="action-btn edit" @tap="goEdit(item.id)">编辑</view>
          <view class="action-btn delete" @tap="onDelete(item)">删除</view>
        </view>
      </view>
    </view>

    <view class="add-btn-wrap">
      <button class="add-btn" @tap="goEdit()">+ 新增收货地址</button>
    </view>
  </view>
</template>

<style lang="scss">
$primary: #f76b1c;
$navy: #1b2d5e;
$bg: #f4f5f9;
$card: #ffffff;
$text-1: #1a1a2e;
$text-2: #64748b;
$text-3: #94a3b8;

page {
  background-color: $bg;
}

.container {
  padding-bottom: 140rpx;
}

.loading,
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

.address-list {
  padding: 20rpx;
}

.address-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);

  .card-main {
    padding-bottom: 16rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .addr-header {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;

      .addr-name {
        font-size: 30rpx;
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
      font-size: 26rpx;
      color: #666;
      line-height: 1.5;
    }

    .addr-label {
      display: inline-block;
      font-size: 20rpx;
      color: #999;
      background-color: #f5f5f5;
      border-radius: 4rpx;
      padding: 2rpx 10rpx;
      margin-top: 8rpx;
    }
  }

  .card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;
    padding-top: 16rpx;

    .action-btn {
      font-size: 24rpx;
      padding: 8rpx 20rpx;
      border-radius: 30rpx;
      border: 1rpx solid;

      &.set-default {
        color: $primary;
        border-color: $primary;
      }

      &.edit {
        color: #666;
        border-color: #ccc;
      }

      &.delete {
        color: #ff4d4f;
        border-color: #ff4d4f;
      }
    }
  }
}

.add-btn-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;

  .add-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, $primary, #ffa42b);
    color: #fff;
    font-size: 30rpx;
    font-weight: bold;
    border-radius: 50rpx;
    box-shadow: 0 6rpx 20rpx rgba(247, 107, 28, 0.3);
  }
}
</style>
