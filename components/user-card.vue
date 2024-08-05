<template>
  <view class="card" @click="jump">
    <u-avatar :src="user.avatar" class="avatar" size="42"></u-avatar>
    <view class="name">{{ user.name }}</view>
    <view class="delete" @click.stop="remove">移除</view>
  </view>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { getUserById } from "@/service/index.js";
import { defaultAvatarUrl } from "@/utils/data.js";
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "follow",
  },
});
const emits = defineEmits(["remove"]);

const remove = () => {
  emits("remove", props.id);
};

const user = reactive({
  name: "微信用户",
  avatar: defaultAvatarUrl,
});

const getUserInfo = async () => {
  if (!props.id) return;
  const userInfo = await getUserById(props.id);
  user.name = userInfo?.nick_name || "微信用户";
  user.avatar = userInfo?.avatar?.url || defaultAvatarUrl;
};

onMounted(() => {
  getUserInfo();
});

const jump = () => {
  if (props.type === "follow") return;
  uni.navigateTo({
    url: `/pages/user-record/user-record?userId=${props.id}`,
  });
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 96rpx;
  display: flex;
  align-items: center;
  margin-bottom: 32rpx;
  background-color: #fff;
  padding: 24rpx;
  box-sizing: border-box;
  border-radius: 12rpx;
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);

  .name {
    flex: 1;
    min-width: 120rpx;
    margin: 0 24rpx;
  }

  .delete {
    justify-self: end;
    color: #fa3534;
  }
}
</style>
