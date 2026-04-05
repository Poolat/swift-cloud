<script setup lang="ts">
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeAreaInsets!.top + 10 + 'px' }">
    <!-- logo文字 -->
    <view class="logo">
      <text class="logo-title">云驰享</text>
      <text class="logo-text">低空物流配送平台</text>
    </view>
    <!-- 搜索条 -->
    <view class="search">
      <text class="icon-search">搜索服务商户</text>
    </view>
  </view>
</template>

<style lang="scss">
/* 自定义导航条 */
.navbar {
  background: linear-gradient(135deg, #1b2d5e 0%, #2a4494 60%, #f76b1c 160%);
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;

    .logo-title {
      font-size: 40rpx;
      font-weight: bold;
      color: #fff;
      letter-spacing: 2rpx;
    }

    .logo-text {
      line-height: 28rpx;
      color: rgba(255, 255, 255, 0.8);
      margin: 2rpx 0 0 20rpx;
      padding-left: 20rpx;
      border-left: 1rpx solid rgba(255, 255, 255, 0.4);
      font-size: 22rpx;
    }
  }

  .search {
    display: flex;
    align-items: center;
    padding: 0 26rpx;
    height: 64rpx;
    margin: 16rpx 20rpx;
    color: rgba(255, 255, 255, 0.7);
    font-size: 26rpx;
    border-radius: 32rpx;
    background-color: rgba(255, 255, 255, 0.15);
    border: 1rpx solid rgba(255, 255, 255, 0.2);
  }

  .icon-search::before {
    margin-right: 10rpx;
  }
}
</style>
