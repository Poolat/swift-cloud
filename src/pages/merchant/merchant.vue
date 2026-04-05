<script setup lang="ts">
import { getMerchantByIdAPI } from '@/services/merchant'
import { getProductListByMerchantAPI } from '@/services/product'
import type { MerchantVO } from '@/types/merchant'
import type { ProductVO } from '@/types/product'
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores'

const merchantId = ref<number>(0)
const merchant = ref<MerchantVO | null>(null)
const productList = ref<ProductVO[]>([])
const isLoading = ref(false)
const cartStore = useCartStore()

onLoad(async (options) => {
  merchantId.value = Number(options?.id)
  isLoading.value = true
  try {
    const [merchantRes, productRes] = await Promise.all([
      getMerchantByIdAPI(merchantId.value),
      getProductListByMerchantAPI(merchantId.value),
    ])
    merchant.value = merchantRes.data
    productList.value = productRes.data || []
  } finally {
    isLoading.value = false
  }
})

const goToCart = () => {
  uni.switchTab({ url: '/pages/cart/cart' })
}

const addToCart = (product: ProductVO) => {
  cartStore.addItem({
    id: product.id,
    merchantId: merchantId.value,
    name: product.productName,
    price: product.productPrice,
    image: product.productImage || '',
    count: 1,
  })
  uni.showToast({ icon: 'success', title: '已加入订单' })
}

const cartCount = computed(() => cartStore.totalCount)
const failedImages = ref(new Set<number>())
const onImageError = (id: number) => failedImages.value.add(id)
</script>

<template>
  <view class="container">
    <!-- 加载中 -->
    <view v-if="isLoading" class="loading">
      <view class="loading-icon">⏳</view>
      <text class="loading-text">加载中...</text>
    </view>

    <template v-else-if="merchant">
      <!-- 商户信息头部 -->
      <view class="merchant-header">
        <view class="merchant-avatar">
          <text class="avatar-text">{{ merchant.merchantName?.charAt(0) }}</text>
        </view>
        <view class="merchant-info">
          <text class="merchant-name">{{ merchant.merchantName }}</text>
          <view class="merchant-status">
            <text class="status-dot"></text>
            <text class="status-text">营业中</text>
          </view>
          <view class="merchant-meta" v-if="merchant.businessAddress">
            <text class="meta-icon">📍</text>
            <text class="meta-text">{{ merchant.businessAddress }}</text>
          </view>
        </view>
      </view>

      <!-- 商品列表 -->
      <view class="products-section">
        <view class="section-title-row">
          <text class="section-title">全部商品</text>
          <text class="section-count">共 {{ productList.length }} 件</text>
        </view>

        <view v-if="productList.length > 0" class="product-list">
          <view v-for="product in productList" :key="product.id" class="product-card">
            <image
              v-if="product.productImage && !failedImages.has(product.id)"
              class="product-image"
              :src="product.productImage"
              mode="aspectFill"
              @error="onImageError(product.id)"
            ></image>
            <view v-else class="product-image-placeholder">
              <text>📦</text>
            </view>
            <view class="product-info">
              <text class="product-name">{{ product.productName }}</text>
              <text class="product-desc" v-if="product.description">{{ product.description }}</text>
              <view class="product-footer">
                <view class="price-row">
                  <text class="price-current">¥{{ product.productPrice }}</text>
                  <text
                    class="price-original"
                    v-if="product.originalPrice && product.originalPrice > product.productPrice"
                  >
                    ¥{{ product.originalPrice }}
                  </text>
                </view>
                <view class="add-btn" @tap="addToCart(product)">
                  <text class="add-icon">+</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view v-else class="empty">
          <text class="empty-icon">📭</text>
          <text class="empty-text">暂无上架商品</text>
        </view>
      </view>
    </template>

    <!-- 底部结算栏 -->
    <view v-if="cartCount > 0" class="cart-bar" @tap="goToCart">
      <view class="cart-icon">
        <text class="cart-emoji">🛒</text>
        <text class="cart-badge">{{ cartCount }}</text>
      </view>
      <text class="cart-text">查看已选商品</text>
      <text class="cart-action">去结算</text>
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
}

.container {
  padding-bottom: 120rpx;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 150rpx 0;

  .loading-icon {
    font-size: 80rpx;
    margin-bottom: 20rpx;
  }

  .loading-text {
    font-size: 28rpx;
    color: #999;
  }
}

.merchant-header {
  background: linear-gradient(135deg, $navy 0%, $navy-light 100%);
  padding: 40rpx 30rpx 36rpx;
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;

  .merchant-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 24rpx;
    background: linear-gradient(135deg, $primary, #ffa42b);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 6rpx 20rpx rgba(247, 107, 28, 0.4);

    .avatar-text {
      font-size: 46rpx;
      color: #fff;
      font-weight: bold;
    }
  }

  .merchant-info {
    flex: 1;
    margin-left: 24rpx;

    .merchant-name {
      font-size: 34rpx;
      font-weight: bold;
      color: #fff;
      display: block;
      margin-bottom: 12rpx;
    }

    .merchant-status {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;

      .status-dot {
        width: 10rpx;
        height: 10rpx;
        border-radius: 50%;
        background-color: #22c55e;
        margin-right: 8rpx;
        animation: blink 1.5s ease-in-out infinite;
      }

      .status-text {
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.85);
      }
    }

    .merchant-meta {
      display: flex;
      align-items: center;

      .meta-icon {
        font-size: 22rpx;
        margin-right: 6rpx;
      }

      .meta-text {
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.7);
      }
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

.products-section {
  background-color: $card;

  .section-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 30rpx;
    border-bottom: 1rpx solid #f4f5f9;

    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      color: $text-1;
    }

    .section-count {
      font-size: 22rpx;
      color: $text-3;
      background: #fff0e6;
      padding: 4rpx 16rpx;
      border-radius: 20rpx;
      color: $primary;
    }
  }
}

.product-list {
  padding: 0 20rpx;
}

.product-card {
  display: flex;
  align-items: center;
  padding: 24rpx 10rpx;
  border-bottom: 1rpx solid #f5f5f5;

  .product-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    flex-shrink: 0;
  }

  .product-image-placeholder {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 60rpx;
  }

  .product-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 160rpx;

    .product-name {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      line-height: 1.4;
    }

    .product-desc {
      font-size: 22rpx;
      color: #999;
      margin-top: 6rpx;
    }

    .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;

      .price-row {
        display: flex;
        align-items: baseline;
        gap: 10rpx;

        .price-current {
          font-size: 32rpx;
          font-weight: bold;
          color: #ff4d4f;
        }

        .price-original {
          font-size: 22rpx;
          color: #bbb;
          text-decoration: line-through;
        }
      }

      .add-btn {
        width: 56rpx;
        height: 56rpx;
        border-radius: 50%;
        background: linear-gradient(135deg, $primary, #ffa42b);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4rpx 12rpx rgba(247, 107, 28, 0.35);

        .add-icon {
          font-size: 36rpx;
          color: #fff;
          line-height: 1;
        }
      }
    }
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;

  .empty-icon {
    font-size: 80rpx;
    margin-bottom: 16rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.cart-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: linear-gradient(90deg, $navy 0%, $navy-light 100%);
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 -4rpx 20rpx rgba(27, 45, 94, 0.2);

  .cart-icon {
    position: relative;
    margin-right: 20rpx;

    .cart-emoji {
      font-size: 48rpx;
    }

    .cart-badge {
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      background-color: #ff4d4f;
      color: #fff;
      font-size: 18rpx;
      border-radius: 20rpx;
      padding: 0 8rpx;
      min-width: 30rpx;
      text-align: center;
    }
  }

  .cart-text {
    flex: 1;
    font-size: 26rpx;
    color: #fff;
  }

  .cart-action {
    background: linear-gradient(135deg, $primary, #ffa42b);
    color: #fff;
    font-size: 28rpx;
    font-weight: bold;
    padding: 16rpx 36rpx;
    border-radius: 50rpx;
    box-shadow: 0 4rpx 12rpx rgba(247, 107, 28, 0.4);
  }
}
</style>
