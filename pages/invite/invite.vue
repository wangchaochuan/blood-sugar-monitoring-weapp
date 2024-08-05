<template>
  <view class="container">
    <view class="invite">
      <view class="body">
        <view style="margin-bottom: 8px">
          <text class="text">您的好友</text>
          <text class="user">{{ userName }}</text>
          <text class="text">邀请您使用每日血糖监测</text>
          <text class="book">{{ text }}</text>
        </view>
        <u-text :text="tip" bold type="warning" :size="20"></u-text>
      </view>
      <view class="footer">
        <u-button class="cancel" type="error" shape="circle" @click="cancel">{{
          cancelText
        }}</u-button>
        <u-button
          class="confirm"
          type="primary"
          shape="circle"
          @click="confirm"
          >{{ confirmText }}</u-button
        >
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { addNoticeUser } from "@/service/index.js";

const type = ref("");
const userId = ref("");
const userName = ref("");
const curreontUserId = uni.getStorageSync("userId");

const text = computed(() => {
  return type.value === "follow"
    ? "并邀请关您关注他的血糖监测情况"
    : "并请求关注您的血糖监测情况";
});
const tip = computed(() => {
  return type.value === "follow" ? "请确认是否关注" : "请确认是否同意";
});
const cancelText = computed(() => {
  return type.value === "follow" ? "暂不关注" : "暂不同意";
});
const confirmText = computed(() => {
  return type.value === "follow" ? "立即关注" : "立即同意";
});

const cancel = () => {
  uni.switchTab({
    url: "/pages/personal-center/personal-center",
  });
};

const confirm = async () => {
  if (type.value === "follow") {
    await addNoticeUser(curreontUserId, userId.value);
  } else {
    await addNoticeUser(userId.value, curreontUserId);
  }
  cancel();
};

onLoad((option) => {
  type.value = option.type;
  userId.value = option.userId;
  userName.value = option.userName;
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
  box-sizing: border-box;
  background-color: $u-info-light;

  .invite {
    width: 100%;
    height: fit-content;
    background-color: #fff;
    padding: 32rpx;
    box-sizing: border-box;
    border-radius: 32rpx;

    .body {
      height: fit-content;
      min-height: 200rpx;
      font-size: 32rpx;
      line-height: 48rpx;

      .text {
        color: $u-content-color;
      }

      .user,
      .book {
        font-weight: bold;
        margin: 0 8rpx;
      }

      .user {
        color: $u-main-color;
      }

      .book {
        color: $u-primary;
      }
    }

    .footer {
      display: flex;
      gap: 32rpx;
    }
  }
}
</style>
