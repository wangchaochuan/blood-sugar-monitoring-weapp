<template>
  <view class="user_page">
    <view class="bg">
      <image v-if="src" :src="src" mode="aspectFill"></image>
      <image v-else :src="defaultAvatar" mode="aspectFill"></image>
    </view>
    <view class="header">
      <view class="user">
        <u-avatar :src="src" class="avatar" size="42"></u-avatar>
        <u-text :text="username" class="username" size="18" bold></u-text>
      </view>
      <view>
        <text>今天是您坚持监测血糖的第</text>
        <text
          style="
            font-size: 18px;
            color: #18b566;
            font-weight: 600;
            margin: 0 4px;
          "
          >{{ count }}</text
        >
        <text>天,请继续保持哦</text>
      </view>
      <u-text text="血糖稳定,健康相随" size="18" type="primary" bold></u-text>
      <u-text text="控制血糖,享受自由" size="18" type="primary" bold></u-text>
    </view>

    <view class="body">
      <view class="group">
        <view class="item" @click="jumpToUser">
          <view class="left"><text class="text">用户信息</text></view>
          <view class="right"
            ><u-icon name="arrow-right" size="24" color="#555"></u-icon
          ></view>
        </view>
        <view class="item" @click="jumpToTarget">
          <view class="left"><text class="text">血糖目标管理</text></view>
          <view class="right"
            ><u-icon name="arrow-right" size="24" color="#555"></u-icon
          ></view>
        </view>
        <view class="item" @click="jumpToAttention">
          <view class="left"><text class="text">我关注的小伙伴</text></view>
          <view class="right"
            ><u-icon name="arrow-right" size="24" color="#555"></u-icon
          ></view>
        </view>
        <view class="item" @click="jumpToFollow">
          <view class="left"><text class="text">关注我的小伙伴</text></view>
          <view class="right"
            ><u-icon name="arrow-right" size="24" color="#555"></u-icon
          ></view>
        </view>
        <!-- 功能后续开发 -->
        <!-- <view class="item">
					<view class="left"><text class="text">导出数据</text></view>
					<view class="right"><u-icon name="arrow-right" size="24" color="#555"></u-icon></view>
				</view> -->
        <view class="item" @click="jumpToAbout">
          <view class="left"><text class="text">关于我们</text></view>
          <view class="right"
            ><u-icon name="arrow-right" size="24" color="#555"></u-icon
          ></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { onShow, onShareAppMessage } from "@dcloudio/uni-app";
import { defaultAvatarUrl } from "@/utils/data.js";
import useUserStore from "@/store/user.js";
import dayjs from "dayjs";

const userStore = useUserStore();
const user = computed(() => userStore.user);
const src = computed(() => {
  if (user.value?.avatar?.url) {
    return user.value?.avatar?.url;
  }
  return defaultAvatarUrl;
});
const username = computed(() => user.value.nick_name);
const count = computed(() => {
  const today = dayjs().valueOf();
  const registerTime = user.value.register_date;
  const gap = today - registerTime;
  return Math.ceil(gap / (1000 * 60 * 60 * 24));
});

const navigate = (url) => {
  uni.navigateTo({
    url,
  });
};

const jumpToUser = () => {
  navigate("/pages/user-detail/user-detail");
};
const jumpToTarget = () => {
  navigate(`/pages/target/target`);
};
const jumpToAttention = () => {
  navigate(`/pages/attention/attention`);
};
const jumpToFollow = () => {
  navigate("/pages/follow/follow");
};
const jumpToAbout = () => {
  navigate("/pages/about/about");
};
onShareAppMessage((params) => {
  return {
    title: `${user.value.nick_name}邀请您使用每日血糖监测`,
    path: "/pages/personal-center/personal-center",
  };
});
</script>

<style lang="scss" scoped>
.user_page {
  width: 100%;
  height: 100%;
  padding: 32rpx;
  box-sizing: border-box;

  .header {
    position: relative;
    z-index: 8;
    display: flex;
    flex-direction: column;
    gap: 18rpx;

    .user {
      display: flex;
      align-items: center;
      gap: 24rpx;

      .tip {
        justify-self: flex-end;
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .body {
    margin-top: 32rpx;

    .group {
      padding: 15rpx 0;

      .item {
        position: relative;
        z-index: 8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25rpx 0;
        font-size: 36rpx;
        color: #555;

        .left {
          display: flex;
          align-items: center;

          .iconfont {
            font-size: 38rpx;
            margin-right: 10rpx;
          }
        }

        .right {
          .iconfont {
            font-size: 26rpx;
          }
        }
      }
    }
  }
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  image {
    width: 100%;
    height: 100%;
    filter: blur(20px);
    transform: scale(2);
    opacity: 0.5;
  }
}
</style>
