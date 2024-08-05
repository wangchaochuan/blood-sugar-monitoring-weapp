<template>
  <view class="card">
    <view class="title">
      <view class="left">{{ date }}</view>
      <view class="right">{{ week }}</view>
    </view>
    <view class="content">
      <view
        class="item"
        v-for="item in data"
        :key="item.type"
        @click="jump(id, item.type)"
      >
        <view class="left">{{ item.tag }}</view>
        <view class="right" :class="getClass(item.type, item.value)">{{
          item.value
        }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";
import useTargetStore from "@/store/target.js";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  date: {
    type: String,
    default: "",
  },
  data: {
    type: Array,
    default: () => [],
  },
  canEdit: {
    type: Boolean,
    default: true,
  },
});
const targetStore = useTargetStore();
const target = computed(() => targetStore.target);
const week = computed(() => {
  const d = dayjs(props.date).day();
  const week = ["日", "一", "二", "三", "四", "五", "六"];
  return `星期${week[d]}`;
});

const getClass = (type, value) => {
  const map = {
    limosis: "limosis",
    afterBreakfast: "afterMeal",
    beforeLunch: "beforeMeal",
    afterLunch: "afterMeal",
    beforeDinner: "beforeMeal",
    afterDinner: "afterMeal",
    beforeSleep: "beforeSleep",
  };
  const o = target.value[map[type]];
  if (!o) {
    return {};
  }
  const low = Number(o.low);
  const normal = Number(o.normal);
  const high = Number(o.high);
  const val = Number(value);

  return {
    "low-value": val <= low,
    "normal-value": val > low && val <= normal,
    "high-value": val > normal && val <= high,
    "too-high": val > high,
  };
};

const jump = (id, type) => {
  if (!props.canEdit) return;
  uni.navigateTo({
    url: `/pages/record-detail/record-detail?id=${id}&type=${type}`,
  });
};
</script>

<style lang="scss">
.card {
  width: 100%;
  margin-bottom: 16rpx;

  .title {
    height: 48rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      font-size: 28rpx;
      color: $u-content-color;
    }

    .right {
      font-size: 24rpx;
      color: $u-light-color;
    }
  }

  .content {
    height: fit-content;
    display: flex;
    flex-direction: column;
    margin-top: 8rpx;
    background-color: $u-info-light;
    border-radius: 16rpx;
    box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);

    .item {
      height: fit-content;
      display: flex;
      padding: 16rpx 32rpx;
      border-bottom: 1px solid $u-border-color;

      .left {
        flex: 2;
      }

      .right {
        height: 100%;
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        align-self: center;

        &.low-value {
          color: #2979ff;
        }

        &.normal-value {
          color: #19be6b;
        }

        &.high-value {
          color: #ff9900;
        }

        &.too-high {
          color: #fa3534;
        }
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }

  :deep(.u-tag) {
    padding: 0 16rpx;
  }
}
</style>
