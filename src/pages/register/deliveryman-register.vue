<script setup lang="ts">
import { http } from '@/utils/http'
import { ref } from 'vue'

const form = ref({
  realName: '',
  idCard: '',
  phone: '',
  vehicleType: '',
  vehicleNo: '',
})
const submitting = ref(false)

const onSubmit = async () => {
  if (!form.value.realName.trim()) {
    uni.showToast({ icon: 'none', title: '请输入真实姓名' })
    return
  }
  if (!form.value.phone.trim()) {
    uni.showToast({ icon: 'none', title: '请输入联系电话' })
    return
  }
  submitting.value = true
  try {
    await http({
      method: 'POST',
      url: '/user/auth/deliveryman/register',
      data: form.value,
    })
    uni.showToast({ icon: 'success', title: '申请已提交，等待审核' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch {
    uni.showToast({ icon: 'none', title: '提交失败，请重试' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="container">
    <view class="form-header">
      <text class="form-header-icon">🛵</text>
      <text class="form-header-title">配送员入驻申请</text>
      <text class="form-header-desc">提交申请后将由平台进行审核，审核通过后即可开始接单</text>
    </view>

    <view class="form">
      <view class="form-item">
        <text class="form-label">真实姓名 <text class="required">*</text></text>
        <input class="form-input" v-model="form.realName" placeholder="请输入真实姓名" />
      </view>
      <view class="form-item">
        <text class="form-label">身份证号</text>
        <input class="form-input" v-model="form.idCard" placeholder="请输入身份证号（选填）" />
      </view>
      <view class="form-item">
        <text class="form-label">联系电话 <text class="required">*</text></text>
        <input class="form-input" v-model="form.phone" type="number" placeholder="请输入联系电话" />
      </view>
      <view class="form-item">
        <text class="form-label">交通工具</text>
        <input
          class="form-input"
          v-model="form.vehicleType"
          placeholder="如：电动车、摩托车（选填）"
        />
      </view>
      <view class="form-item">
        <text class="form-label">车牌号码</text>
        <input class="form-input" v-model="form.vehicleNo" placeholder="请输入车牌号码（选填）" />
      </view>
    </view>

    <button class="submit-btn" :disabled="submitting" :loading="submitting" @tap="onSubmit">
      提交申请
    </button>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f5f5f5;
}

.container {
  padding-bottom: 40rpx;
}

.form-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 40rpx 40rpx;
  background-color: #fff;
  margin-bottom: 20rpx;

  .form-header-icon {
    font-size: 80rpx;
    margin-bottom: 16rpx;
  }

  .form-header-title {
    font-size: 34rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
  }

  .form-header-desc {
    font-size: 24rpx;
    color: #999;
    text-align: center;
    line-height: 1.6;
  }
}

.form {
  background-color: #fff;

  .form-item {
    display: flex;
    align-items: center;
    padding: 28rpx 30rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .form-label {
      font-size: 28rpx;
      color: #333;
      width: 180rpx;
      flex-shrink: 0;

      .required {
        color: #ff4d4f;
      }
    }

    .form-input {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }
  }
}

.submit-btn {
  margin: 40rpx 30rpx;
  width: calc(100% - 60rpx);
  height: 88rpx;
  background: linear-gradient(135deg, #f76b1c, #ffa42b);
  color: #fff;
  font-size: 30rpx;
  border-radius: 50rpx;

  &[disabled] {
    opacity: 0.6;
  }
}
</style>
