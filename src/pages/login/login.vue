<script setup lang="ts">
import { postLoginWxMinAPI } from '@/services/login'
import { useMemberStore } from '@/stores'
import type { LoginResult } from '@/types/member'
import { ref } from 'vue'

const isAgreePrivacy = ref(false)
const isAgreePrivacyShakeY = ref(false)
const loading = ref(false)

const checkedAgreePrivacy = async () => {
  if (!isAgreePrivacy.value) {
    uni.showToast({ icon: 'none', title: '请先阅读并勾选协议' })
    isAgreePrivacyShakeY.value = true
    setTimeout(() => {
      isAgreePrivacyShakeY.value = false
    }, 500)
    return Promise.reject(new Error('请先阅读并勾选协议'))
  }
}

// 微信授权登录
const onWxLogin = async () => {
  await checkedAgreePrivacy()
  if (loading.value) return
  loading.value = true
  try {
    // 1. 调用 wx.login 获取临时登录凭证 code
    const loginRes = await wx.login()
    // 2. 携带 code 请求后端登录接口
    const res = await postLoginWxMinAPI(loginRes.code)
    loginSuccess(res.data)
  } catch (e) {
    uni.showToast({ icon: 'none', title: '登录失败，请重试' })
  } finally {
    loading.value = false
  }
}

const loginSuccess = (profile: LoginResult) => {
  const memberStore = useMemberStore()
  memberStore.setProfile(profile)
  uni.showToast({ icon: 'success', title: '登录成功' })
  setTimeout(() => {
    uni.navigateBack()
  }, 500)
}

const onOpenPrivacyContract = () => {
  // #ifdef MP-WEIXIN
  wx.openPrivacyContract({})
  // #endif
}
</script>

<template>
  <view class="viewport">
    <!-- 顶部品牌区 -->
    <view class="brand-area">
      <view class="brand-bg-circle c1"></view>
      <view class="brand-bg-circle c2"></view>
      <view class="brand-logo-wrap">
        <view class="brand-icon-box">
          <text class="brand-icon">✈</text>
        </view>
        <text class="brand-name">云驰享</text>
        <text class="brand-slogan">低空物流配送平台</text>
      </view>
      <!-- 特性标签 -->
      <view class="feature-tags">
        <view class="feature-tag"><text>⚡ 极速配送</text></view>
        <view class="feature-tag"><text>🛡 安全可靠</text></view>
        <view class="feature-tag"><text>📍 实时追踪</text></view>
      </view>
    </view>

    <!-- 登录卡片 -->
    <view class="login-card">
      <text class="card-title">欢迎登录</text>
      <text class="card-subtitle">使用微信账号快速登录，享受完整服务</text>

      <button class="btn-wechat" :loading="loading" @tap="onWxLogin">
        <text class="btn-icon">💬</text>
        <text class="btn-text">微信授权登录</text>
      </button>

      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">安全登录</text>
        <view class="divider-line"></view>
      </view>

      <view class="security-tips">
        <text class="security-item">🔒 数据加密传输</text>
        <text class="security-item">✅ 隐私安全保护</text>
      </view>

      <view class="agree-row" :class="{ shake: isAgreePrivacyShakeY }">
        <radio
          class="agree-radio"
          color="#F76B1C"
          :checked="isAgreePrivacy"
          @tap="isAgreePrivacy = !isAgreePrivacy"
        />
        <text class="agree-text" @tap="isAgreePrivacy = !isAgreePrivacy">登录即同意云驰享</text>
        <navigator class="agree-link" hover-class="none" url="./protocal">《服务条款》</navigator>
        <text class="agree-text">和</text>
        <text class="agree-link" @tap="onOpenPrivacyContract">《隐私协议》</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
$primary: #f76b1c;
$navy: #1b2d5e;
$navy-light: #2a4494;

page {
  height: 100%;
  background-color: $navy;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(180deg, $navy 0%, #243570 50%, #f4f5f9 50%);
}

// ── 品牌区 ─────────────────────────────────────
.brand-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 40rpx 0 60rpx;

  .brand-bg-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(247, 107, 28, 0.08);
    &.c1 {
      width: 500rpx;
      height: 500rpx;
      top: -150rpx;
      right: -100rpx;
    }
    &.c2 {
      width: 300rpx;
      height: 300rpx;
      bottom: 0rpx;
      left: -80rpx;
      background: rgba(255, 255, 255, 0.05);
    }
  }

  .brand-logo-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;

    .brand-icon-box {
      width: 140rpx;
      height: 140rpx;
      border-radius: 36rpx;
      background: linear-gradient(135deg, $primary, #ffa42b);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 28rpx;
      box-shadow: 0 12rpx 32rpx rgba(247, 107, 28, 0.4);

      .brand-icon {
        font-size: 72rpx;
        color: #fff;
      }
    }

    .brand-name {
      font-size: 64rpx;
      font-weight: bold;
      color: #fff;
      letter-spacing: 6rpx;
      margin-bottom: 12rpx;
    }

    .brand-slogan {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.65);
      letter-spacing: 2rpx;
    }
  }

  .feature-tags {
    display: flex;
    margin-top: 40rpx;
    z-index: 1;

    .feature-tag {
      background: rgba(255, 255, 255, 0.12);
      border: 1rpx solid rgba(255, 255, 255, 0.2);
      border-radius: 30rpx;
      padding: 8rpx 22rpx;
      margin: 0 10rpx;

      text {
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.85);
      }
    }
  }
}

// ── 登录卡片 ───────────────────────────────────
.login-card {
  background: #fff;
  border-radius: 48rpx 48rpx 0 0;
  padding: 52rpx 48rpx 80rpx;
  box-shadow: 0 -8rpx 40rpx rgba(27, 45, 94, 0.15);

  .card-title {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #1a1a2e;
    margin-bottom: 10rpx;
  }

  .card-subtitle {
    display: block;
    font-size: 24rpx;
    color: #94a3b8;
    margin-bottom: 44rpx;
  }

  .btn-wechat {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, #06c05f, #05a050);
    border-radius: 48rpx;
    border: none;
    box-shadow: 0 8rpx 24rpx rgba(6, 192, 95, 0.35);
    margin-bottom: 36rpx;

    .btn-icon {
      font-size: 36rpx;
      margin-right: 12rpx;
    }

    .btn-text {
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;
    }
  }

  .divider {
    display: flex;
    align-items: center;
    margin-bottom: 28rpx;

    .divider-line {
      flex: 1;
      height: 1rpx;
      background: #e8ebf2;
    }
    .divider-text {
      font-size: 22rpx;
      color: #94a3b8;
      margin: 0 20rpx;
    }
  }

  .security-tips {
    display: flex;
    justify-content: center;
    gap: 40rpx;
    margin-bottom: 40rpx;

    .security-item {
      font-size: 22rpx;
      color: #64748b;
    }
  }

  .agree-row {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    .agree-radio {
      transform: scale(0.65);
      margin-right: -4rpx;
      vertical-align: middle;
    }
    .agree-text {
      font-size: 22rpx;
      color: #94a3b8;
    }
    .agree-link {
      font-size: 22rpx;
      color: $primary;
      display: inline;
    }

    &.shake {
      animation: shakeY 0.2s ease-in-out 3;
    }
  }
}

@keyframes shakeY {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6rpx);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
