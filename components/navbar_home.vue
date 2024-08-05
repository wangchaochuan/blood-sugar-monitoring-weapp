<template>
  <view class="navbar">
    <view class="title">每日血糖监测</view>
    <view class="content">
      <view class="text">查询时间范围 : </view>
      <view class="range" @click="showRangePicker = true">
        <view class="start">{{ start }}</view>
        <view class="sign">~</view>
        <view class="end">{{ end }}</view>
      </view>
    </view>
    <u-calendar
      :show="showRangePicker"
      :default-date="defaultDate"
      mode="range"
      :minDate="minDate"
      :maxDate="maxDate"
      :closeOnClickOverlay="true"
      :allowSameDay="true"
      :monthNum="4"
      @close="showRangePicker = false"
      @confirm="confirm"
    >
    </u-calendar>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import dayjs from "dayjs";
import useMenuStore from "@/store/menu.js";
import useRangeStore from "@/store/range.js";

const store = useMenuStore();
const menuTop = computed(() => store.menu.menuTop);
const menuHeight = computed(() => store.menu.menuHeight);
const rangeStore = useRangeStore();
const start = computed(() => rangeStore.start);
const end = computed(() => rangeStore.end);

const showRangePicker = ref(false);
const defaultDate = reactive([]);
const minDate = dayjs().subtract(90, "day").valueOf();
const maxDate = dayjs().valueOf();
const confirm = (e) => {
  const startDay = e[0];
  const endDay = e[e.length - 1];
  rangeStore.setStart(startDay);
  rangeStore.setEnd(endDay);
  showRangePicker.value = false;
};

onMounted(() => {
  for (let i = 30; i >= 0; i--) {
    defaultDate.push(dayjs().subtract(i, "day").format("YYYY-MM-DD"));
  }
});
</script>

<style lang="scss" scoped>
.navbar {
  height: 180rpx;
  background-color: $u-primary;
  padding-top: v-bind(menuTop);
  padding-left: 32rpx;
  padding-right: 32rpx;

  & > .title {
    height: v-bind(menuHeight);
    color: #fff;
    display: flex;
    align-items: center;
    margin-bottom: 32rpx;
  }

  & > .content {
    height: 48rpx;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 24rpx;

    .text {
      height: 100%;
      display: flex;
      align-items: center;
      margin-right: 12rpx;
    }

    .range {
      height: 100%;
      display: flex;
      align-items: center;

      .sign {
        margin: 0 12rpx;
      }
    }
  }
}
</style>
