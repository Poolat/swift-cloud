<script setup lang="ts">
import { getMerchantListAPI } from '@/services/merchant'
import type { MerchantVO } from '@/types/merchant'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import CustomNavbar from './components/CustomNavbar.vue'

const merchantList = ref<MerchantVO[]>([])
const isLoading = ref(false)
const isTriggered = ref(false)

const loadMerchants = async () => {
  try {
    const res = await getMerchantListAPI()
    merchantList.value = res.data || []
  } catch {
    // 401 已由 http.ts 拦截并跳转登录，此处静默处理
  }
}

onLoad(async () => {
  isLoading.value = true
  await loadMerchants()
  isLoading.value = false
})

onShow(() => {
  loadMerchants()
})

const onRefresherrefresh = async () => {
  isTriggered.value = true
  await loadMerchants()
  isTriggered.value = false
}

const goToMerchant = (id: number) => {
  uni.navigateTo({ url: `/pages/merchant/merchant?id=${id}` })
}
</script>

<template>
  <view class="viewport">
    <!-- 自定义导航栏 -->
    <CustomNavbar />
    <!-- 滚动容器 -->
    <scroll-view
      enable-back-to-top
      refresher-enabled
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      class="scroll-view"
      scroll-y
    >
      <!-- 加载骨架 -->
      <view v-if="isLoading" class="skeleton-wrap">
        <view v-for="i in 4" :key="i" class="skeleton-card"></view>
      </view>

      <template v-else>
        <!-- 顶部 Hero Banner -->
        <view class="hero-banner">
          <view class="hero-content">
            <view class="hero-badge">极速配送</view>
            <text class="hero-title">低空物流配送</text>
            <text class="hero-subtitle">无人机极速送达 · 覆盖城乡最后一公里</text>
          </view>
          <view class="hero-decoration">
            <text class="hero-icon">✈</text>
          </view>
        </view>

        <!-- 服务快捷入口 -->
        <view class="service-grid">
          <view class="service-item">
            <view class="service-icon-wrap orange">
              <text class="service-icon">🚀</text>
            </view>
            <text class="service-name">极速达</text>
          </view>
          <view class="service-item">
            <view class="service-icon-wrap navy">
              <text class="service-icon">📦</text>
            </view>
            <text class="service-name">包裹代发</text>
          </view>
          <view class="service-item">
            <view class="service-icon-wrap amber">
              <text class="service-icon">🗺</text>
            </view>
            <text class="service-name">实时追踪</text>
          </view>
          <view class="service-item">
            <view class="service-icon-wrap teal">
              <text class="service-icon">🛡</text>
            </view>
            <text class="service-name">安全保障</text>
          </view>
        </view>

        <!-- 服务大厅标题 -->
        <view class="section-header">
          <view class="section-title-row">
            <view class="section-accent"></view>
            <text class="section-title">服务大厅</text>
          </view>
          <text class="section-desc">{{ merchantList.length }} 家商户营业中</text>
        </view>

        <!-- 商户列表 -->
        <view v-if="merchantList.length > 0" class="merchant-list">
          <view
            v-for="merchant in merchantList"
            :key="merchant.id"
            class="merchant-card"
            @tap="goToMerchant(merchant.id)"
          >
            <view class="card-left">
              <view class="merchant-avatar">
                <text class="avatar-text">{{ merchant.merchantName?.charAt(0) }}</text>
              </view>
            </view>
            <view class="card-body">
              <view class="card-top">
                <text class="merchant-name">{{ merchant.merchantName }}</text>
                <view class="status-badge">
                  <view class="status-dot-live"></view>
                  <text class="status-label">营业中</text>
                </view>
              </view>
              <view class="card-meta" v-if="merchant.businessAddress">
                <text class="meta-icon">📍</text>
                <text class="meta-text">{{ merchant.businessAddress }}</text>
              </view>
              <view class="card-meta" v-if="merchant.contactPhone">
                <text class="meta-icon">📞</text>
                <text class="meta-text">{{ merchant.contactPhone }}</text>
              </view>
            </view>
            <view class="card-right">
              <text class="card-arrow">›</text>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-else class="empty">
          <text class="empty-icon">🏪</text>
          <text class="empty-text">暂无营业中的商户</text>
          <text class="empty-sub">下拉刷新试试</text>
        </view>
      </template>
    </scroll-view>
  </view>
</template>

<style lang="scss">
// ── 主题变量 ──────────────────────────────────
$primary: #f76b1c;
$primary-light: #fff4ec;
$navy: #1b2d5e;
$navy-light: #2a4494;
$bg: #f4f5f9;
$card: #ffffff;
$text-1: #1a1a2e;
$text-2: #64748b;
$text-3: #94a3b8;
$border: #e8ebf2;

page {
  background-color: $bg;
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}

// ── 骨架屏 ───────────────────────────────────
.skeleton-wrap {
  padding: 20rpx 24rpx;
  .skeleton-card {
    height: 180rpx;
    background: linear-gradient(90deg, #e8eaf0 25%, #f0f2f7 50%, #e8eaf0 75%);
    background-size: 400% 100%;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    animation: shimmer 1.4s ease-in-out infinite;
  }
}
@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

// ── Hero Banner ───────────────────────────────
.hero-banner {
  margin: 20rpx 24rpx;
  padding: 40rpx 36rpx;
  background: linear-gradient(135deg, $navy 0%, $navy-light 55%, #3a5cc0 100%);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: -40rpx;
    top: -40rpx;
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    background: rgba(247, 107, 28, 0.15);
  }

  .hero-content {
    flex: 1;
    .hero-badge {
      display: inline-block;
      background-color: $primary;
      color: #fff;
      font-size: 20rpx;
      padding: 4rpx 16rpx;
      border-radius: 20rpx;
      margin-bottom: 16rpx;
      font-weight: bold;
      letter-spacing: 1rpx;
    }
    .hero-title {
      display: block;
      font-size: 40rpx;
      font-weight: bold;
      color: #fff;
      margin-bottom: 12rpx;
      letter-spacing: 2rpx;
    }
    .hero-subtitle {
      display: block;
      font-size: 22rpx;
      color: rgba(255, 255, 255, 0.75);
      line-height: 1.6;
    }
  }

  .hero-decoration {
    .hero-icon {
      font-size: 90rpx;
      opacity: 0.9;
      display: block;
      transform: rotate(-20deg);
    }
  }
}

// ── 服务宫格 ───────────────────────────────────
.service-grid {
  display: flex;
  background-color: $card;
  margin: 0 24rpx 20rpx;
  border-radius: 20rpx;
  padding: 32rpx 0 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);

  .service-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .service-icon-wrap {
      width: 88rpx;
      height: 88rpx;
      border-radius: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14rpx;

      .service-icon {
        font-size: 42rpx;
      }

      &.orange {
        background-color: #fff0e6;
      }
      &.navy {
        background-color: #eef1fb;
      }
      &.amber {
        background-color: #fff8e6;
      }
      &.teal {
        background-color: #e6f9f5;
      }
    }

    .service-name {
      font-size: 22rpx;
      color: $text-2;
    }
  }
}

// ── 分区标题 ───────────────────────────────────
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx 14rpx;

  .section-title-row {
    display: flex;
    align-items: center;
    .section-accent {
      width: 8rpx;
      height: 32rpx;
      background: $primary;
      border-radius: 4rpx;
      margin-right: 14rpx;
    }
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: $text-1;
    }
  }

  .section-desc {
    font-size: 22rpx;
    color: $text-3;
  }
}

// ── 商户列表 ───────────────────────────────────
.merchant-list {
  padding: 0 24rpx 40rpx;
}

.merchant-card {
  background-color: $card;
  border-radius: 20rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 16rpx rgba(27, 45, 94, 0.08);
  display: flex;
  align-items: center;

  .card-left {
    .merchant-avatar {
      width: 88rpx;
      height: 88rpx;
      border-radius: 20rpx;
      background: linear-gradient(135deg, $primary, #ffa42b);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .avatar-text {
        font-size: 40rpx;
        color: #fff;
        font-weight: bold;
      }
    }
  }

  .card-body {
    flex: 1;
    margin: 0 20rpx;

    .card-top {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;

      .merchant-name {
        font-size: 30rpx;
        font-weight: bold;
        color: $text-1;
        flex: 1;
      }

      .status-badge {
        display: flex;
        align-items: center;
        background-color: #e8f8f0;
        border-radius: 20rpx;
        padding: 4rpx 14rpx;

        .status-dot-live {
          width: 10rpx;
          height: 10rpx;
          border-radius: 50%;
          background-color: #22c55e;
          margin-right: 6rpx;
          animation: blink 1.5s ease-in-out infinite;
        }
        .status-label {
          font-size: 20rpx;
          color: #16a34a;
          font-weight: 500;
        }
      }
    }

    .card-meta {
      display: flex;
      align-items: center;
      margin-top: 6rpx;

      .meta-icon {
        font-size: 22rpx;
        margin-right: 8rpx;
      }
      .meta-text {
        font-size: 22rpx;
        color: $text-2;
        flex: 1;
      }
    }
  }

  .card-right {
    .card-arrow {
      font-size: 44rpx;
      color: $text-3;
    }
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

// ── 空状态 ─────────────────────────────────────
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;

  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 20rpx;
  }
  .empty-text {
    font-size: 30rpx;
    color: $text-2;
    margin-bottom: 10rpx;
  }
  .empty-sub {
    font-size: 24rpx;
    color: $text-3;
  }
}
</style>
