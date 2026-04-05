<script setup lang="ts">
import { useMemberStore } from '@/stores'
const { safeAreaInsets } = uni.getSystemInfoSync()
const memberStore = useMemberStore()

const goLogin = () => uni.navigateTo({ url: '/pages/login/login' })
const goOrderList = () => uni.navigateTo({ url: '/pages/order/order-list' })
const goAddress = () => uni.navigateTo({ url: '/pages/address/address' })
const goAnnouncement = () => uni.navigateTo({ url: '/pages/announcement/announcement' })
const goMerchantRegister = () => uni.navigateTo({ url: '/pages/register/merchant-register' })
const goDeliverymanRegister = () => uni.navigateTo({ url: '/pages/register/deliveryman-register' })

const onLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确认退出当前账号？',
    success: (res) => {
      if (res.confirm) {
        memberStore.clearProfile()
        uni.reLaunch({ url: '/pages/index/index' })
      }
    },
  })
}
</script>

<template>
  <scroll-view class="viewport" scroll-y>
    <!-- 顶部用户信息头部 -->
    <view class="profile-header" :style="{ paddingTop: safeAreaInsets!.top + 20 + 'px' }">
      <view class="header-bg-circle"></view>
      <view v-if="memberStore.profile" class="user-info">
        <view class="avatar-wrap">
          <text class="avatar-text">{{
            memberStore.profile.openid?.charAt(0)?.toUpperCase() || 'U'
          }}</text>
          <view class="avatar-badge">✓</view>
        </view>
        <view class="user-meta">
          <text class="user-name">云驰用户</text>
          <text class="user-id">ID · {{ memberStore.profile.id }}</text>
        </view>
        <view class="header-tag">已认证</view>
      </view>
      <view v-else class="user-info guest" @tap="goLogin">
        <view class="avatar-wrap guest-avatar">
          <text class="avatar-text">👤</text>
        </view>
        <view class="user-meta">
          <text class="user-name">未登录</text>
          <text class="user-id">点击登录账号 →</text>
        </view>
      </view>
    </view>

    <!-- 快捷入口浮动卡片 -->
    <view class="quick-card">
      <view class="quick-item" @tap="goOrderList">
        <view class="quick-icon-wrap q-orange">
          <text class="quick-icon">📋</text>
        </view>
        <text class="quick-text">我的订单</text>
      </view>
      <view class="quick-divider"></view>
      <view class="quick-item" @tap="goAddress">
        <view class="quick-icon-wrap q-navy">
          <text class="quick-icon">📍</text>
        </view>
        <text class="quick-text">收货地址</text>
      </view>
      <view class="quick-divider"></view>
      <view class="quick-item" @tap="goAnnouncement">
        <view class="quick-icon-wrap q-amber">
          <text class="quick-icon">📢</text>
        </view>
        <text class="quick-text">平台公告</text>
      </view>
    </view>

    <!-- 入驻申请 -->
    <view class="section-card">
      <view class="section-label">
        <view class="section-accent"></view>
        <text class="section-title">入驻申请</text>
      </view>
      <view class="menu-item" @tap="goMerchantRegister">
        <view class="menu-icon-wrap m-orange">
          <text class="menu-icon">🏪</text>
        </view>
        <text class="menu-label">申请成为商户</text>
        <text class="menu-desc">入驻平台，开展业务</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="goDeliverymanRegister">
        <view class="menu-icon-wrap m-navy">
          <text class="menu-icon">🛵</text>
        </view>
        <text class="menu-label">申请成为配送员</text>
        <text class="menu-desc">加入配送，灵活赚钱</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view v-if="memberStore.profile" class="logout-wrap">
      <button class="logout-btn" @tap="onLogout">退出当前账号</button>
    </view>

    <view class="footer-tip">
      <text>云驰享低空物流配送平台</text>
    </view>
  </scroll-view>
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
}

.viewport {
  min-height: 100vh;
}

// ── 头部 ───────────────────────────────────────
.profile-header {
  background: linear-gradient(145deg, $navy 0%, $navy-light 60%, #3a5cc0 100%);
  padding: 30rpx 36rpx 80rpx;
  position: relative;
  overflow: hidden;

  .header-bg-circle {
    position: absolute;
    right: -60rpx;
    top: -60rpx;
    width: 280rpx;
    height: 280rpx;
    border-radius: 50%;
    background: rgba(247, 107, 28, 0.12);
  }

  .user-info {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .avatar-wrap {
    width: 110rpx;
    height: 110rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, $primary, #ffa42b);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    box-shadow: 0 6rpx 20rpx rgba(247, 107, 28, 0.4);

    &.guest-avatar {
      background: rgba(255, 255, 255, 0.2);
      box-shadow: none;
    }

    .avatar-text {
      font-size: 46rpx;
      color: #fff;
      font-weight: bold;
    }

    .avatar-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 32rpx;
      height: 32rpx;
      border-radius: 50%;
      background: #22c55e;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18rpx;
      color: #fff;
      border: 3rpx solid $navy;
    }
  }

  .user-meta {
    flex: 1;
    margin-left: 24rpx;

    .user-name {
      display: block;
      font-size: 34rpx;
      font-weight: bold;
      color: #fff;
      margin-bottom: 8rpx;
    }

    .user-id {
      display: block;
      font-size: 22rpx;
      color: rgba(255, 255, 255, 0.65);
    }
  }

  .header-tag {
    background: rgba(247, 107, 28, 0.25);
    border: 1rpx solid rgba(247, 107, 28, 0.5);
    border-radius: 20rpx;
    padding: 6rpx 18rpx;
    font-size: 20rpx;
    color: #ffb88c;
  }
}

// ── 快捷入口卡片 ───────────────────────────────
.quick-card {
  display: flex;
  align-items: center;
  background: $card;
  margin: -44rpx 24rpx 20rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(27, 45, 94, 0.12);
  padding: 36rpx 0;
  position: relative;
  z-index: 2;

  .quick-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .quick-icon-wrap {
      width: 90rpx;
      height: 90rpx;
      border-radius: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14rpx;

      .quick-icon {
        font-size: 42rpx;
      }

      &.q-orange {
        background: #fff0e6;
      }
      &.q-navy {
        background: #eef1fb;
      }
      &.q-amber {
        background: #fff8e6;
      }
    }

    .quick-text {
      font-size: 24rpx;
      color: $text-2;
      font-weight: 500;
    }
  }

  .quick-divider {
    width: 1rpx;
    height: 60rpx;
    background: #f0f2f8;
  }
}

// ── 功能卡片 ───────────────────────────────────
.section-card {
  background: $card;
  margin: 0 0 20rpx;
  padding: 0 0 8rpx;

  .section-label {
    display: flex;
    align-items: center;
    padding: 28rpx 30rpx 16rpx;

    .section-accent {
      width: 8rpx;
      height: 28rpx;
      background: $primary;
      border-radius: 4rpx;
      margin-right: 14rpx;
    }

    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: $text-1;
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: 24rpx 30rpx;
    border-top: 1rpx solid #f4f5f9;

    .menu-icon-wrap {
      width: 72rpx;
      height: 72rpx;
      border-radius: 18rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-right: 20rpx;

      .menu-icon {
        font-size: 36rpx;
      }

      &.m-orange {
        background: #fff0e6;
      }
      &.m-navy {
        background: #eef1fb;
      }
    }

    .menu-label {
      font-size: 28rpx;
      font-weight: 500;
      color: $text-1;
      flex: 1;
    }

    .menu-desc {
      font-size: 22rpx;
      color: $text-3;
      margin-right: 10rpx;
    }

    .menu-arrow {
      font-size: 38rpx;
      color: $text-3;
    }
  }
}

// ── 退出登录 ───────────────────────────────────
.logout-wrap {
  padding: 40rpx 30rpx 20rpx;

  .logout-btn {
    width: 100%;
    height: 88rpx;
    background: #fff;
    color: #ef4444;
    font-size: 30rpx;
    border-radius: 50rpx;
    border: 2rpx solid #fecaca;
    box-shadow: 0 2rpx 8rpx rgba(239, 68, 68, 0.1);
  }
}

.footer-tip {
  text-align: center;
  padding: 20rpx 0 60rpx;

  text {
    font-size: 22rpx;
    color: $text-3;
  }
}
</style>
