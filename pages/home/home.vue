<template>
  <view class="home">
    <navbar-home></navbar-home>
    <view class="empty" v-if="data.length === 0">
      <u-empty text="暂无数据"></u-empty>
    </view>
    <scroll-view v-else class="content" scroll-y>
      <date-card
        v-for="item in data"
        :key="data.id"
        :date="item.date"
        :data="item.data"
        :id="item.id"
      ></date-card>
    </scroll-view>
    <view class="add" @click="visible = true">
      <u-icon name="plus" color="#fff"></u-icon>
    </view>
  </view>
  <record-modal
    :visible="visible"
    mode="create"
    @close="visible = false"
    @success="success"
  />
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { onShow, onShareAppMessage } from "@dcloudio/uni-app";
import { getRecordList } from "@/service/index.js";
import { recordToData } from "@/utils/index.js";
import RecordModal from "@/components/record-modal.vue";
import NavbarHome from "@/components/navbar_home.vue";
import DateCard from "@/components/date-card.vue";
import useUserStore from "@/store/user.js";
import useRangeStore from "@/store/range.js";
import dayjs from "dayjs";

const userStore = useUserStore();
const userId = computed(() => userStore.user._id);
const rangeStore = useRangeStore();
const start = computed(() => rangeStore.start);
const end = computed(() => rangeStore.end);
const visible = ref(false);
const data = ref([]);

const getData = async () => {
  if (!userId.value) return;
  const params = {
    start: dayjs(start.value).startOf("day").valueOf(),
    end: dayjs(end.value).endOf("day").valueOf(),
    userId: userId.value,
  };
  const response = await getRecordList(params);
  if (Array.isArray(response) && response.length > 0) {
    data.value = response.map((v) => {
      const data = recordToData(v);
      return {
        data: data,
        id: v._id,
        date: v.dateStr,
      };
    });
  }
};

watchEffect(async () => {
  try {
    uni.showLoading();
    getData();
  } catch (e) {
    //TODO handle the exception
    console.log(e);
  } finally {
    uni.hideLoading();
  }
});

const success = () => {
  getData();
};

onShareAppMessage((params) => {
  return {
    title: `${user.value.nick_name}邀请您使用每日血糖监测`,
    path: "/pages/personal-center/personal-center",
  };
});
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;

  .empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 32rpx;
    padding: 32rpx;
    box-sizing: border-box;
    background-color: #fff;
  }

  .add {
    width: 64rpx;
    height: 64rpx;
    border-radius: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 64rpx;
    bottom: 120rpx;
    z-index: 888;
    background-color: #2979ff;
  }
}
</style>
