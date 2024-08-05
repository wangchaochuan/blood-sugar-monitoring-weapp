<template>
  <view class="container">
    <view class="header">以下是关注您的小伙伴:</view>
    <scroll-view v-if="members.length > 0" class="body" scroll-y>
      <user-card
        v-for="item in members"
        :key="item"
        :id="item"
        type="follow"
        @remove="remove"
      ></user-card>
    </scroll-view>
    <view class="empty" v-else>
      <u-empty mode="list" text="暂无关注者"></u-empty>
    </view>
    <view class="footer">
      <u-button open-type="share" type="primary" shape="circle"
        >邀请关注</u-button
      >
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { onLoad, onShareAppMessage } from "@dcloudio/uni-app";
import { removeNoticeUser } from "@/service/index.js";
import useUserStore from "@/store/user.js";
import UserCard from "@/components/user-card.vue";

const userStore = useUserStore();
const members = computed(() => userStore.user?.follow || []);
const userName = computed(() => userStore.user?.nick_name);
const userId = computed(() => userStore.user?._id);

const remove = async (id) => {
  const list = [...members.value];
  const index = list.findIndex((v) => v === id);
  if (index > -1) {
    list.splice(index, 1);
    const follow = list;
    await removeNoticeUser(id, userId.value);
    const user = {
      ...userStore.user,
      follow,
    };
    userStore.setUser(user);
  }
};

uni.showShareMenu({
  withShareTicket: true,
});
onShareAppMessage((params) => {
  if (params.from === "button") {
    return {
      title: `${userName.value}邀请您使用每日血糖监测，并邀请关您关注他的血糖监测情况`,
      path: `/pages/invite/invite?type=follow&userId=${userId.value}&userName=${userName.value}`,
    };
  } else {
    return {
      title: `${userName.value}邀请您使用每日血糖监测`,
      path: "/pages/personal-center/personal-center",
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32rpx;
  box-sizing: border-box;
  background-color: $u-info-light;

  .header {
    height: 64rpx;
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
  }

  .body {
    flex: 1;
    min-height: 0;
  }

  .empty {
    flex: 1;
    min-height: 0;
  }

  .footer {
    height: 64rpx;
    display: flex;
    align-items: center;
    margin-top: 24rpx;
    margin-bottom: 32rpx;
  }
}
</style>
