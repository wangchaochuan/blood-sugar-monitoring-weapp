<template>
  <view class="card" v-show="count">
    <view class="title">{{ title }}</view>
    <view class="overview" v-show="count">
      <text class="text primary">{{ dayCount }}</text>
      <text class="text">天内共有</text>
      <text class="text primary">{{ count }}</text>
      <text class="text">条记录,其中</text>
      <text class="text error" v-if="overCount > 0">
        {{ overCount }}条记录血糖过高
      </text>
      <text class="text warning" v-if="highCount > 0">
        {{ highCount }}条记录血糖偏高
      </text>
      <text class="text success" v-if="normalCount > 0">
        {{ normalCount }}条记录血糖正常
      </text>
      <text class="text primary" v-if="lowCount > 0">
        {{ lowCount }}条记录血糖偏低
      </text>
    </view>
    <view class="empty" v-if="count === 0">
      <u-empty text="暂无数据"></u-empty>
    </view>
    <view class="charts-box" v-else>
      <qiun-data-charts
        ontouch
        type="column"
        canvas2d
        :opts="opts"
        :chartData="chartData"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import dayjs from "dayjs";
import useTargetStore from "@/store/target.js";
import { tagMap, targetMap } from "@/utils/index.js";

const props = defineProps({
  tag: {
    type: String,
    default: "limosis",
  },
  records: {
    type: Array,
    default: [],
  },
  date: {
    type: Array,
    default: [],
  },
});

const targetStore = useTargetStore();
const target = computed(() => targetStore.target);

const dayCount = computed(() => props.date.length);
const count = computed(() => {
  return props.records.filter(Boolean).length;
});
const type = computed(() => {
  return targetMap[props.tag] || "limosis";
});
const overCount = computed(() => {
  const high = +target.value[type.value].high;
  const list = props.records.filter((v) => v > high);
  return list.length;
});
const highCount = computed(() => {
  const high = +target.value[type.value].high;
  const normal = +target.value[type.value].normal;
  const list = props.records.filter((v) => v > normal && v <= high);
  return list.length;
});
const normalCount = computed(() => {
  const low = +target.value[type.value].low;
  const normal = +target.value[type.value].normal;
  const list = props.records.filter((v) => v > low && v <= normal);
  return list.length;
});
const lowCount = computed(() => {
  const low = +target.value[type.value].low;
  const list = props.records.filter((v) => v <= low && v > 0);
  return list.length;
});

const title = computed(() => {
  return `${tagMap[props.tag]}统计`;
});
const opts = computed(() => ({
  padding: [15, 15, 5, 5],
  touchMoveLimit: 24,
  enableScroll: props.date.length > 7,
  xAxis: {
    disableGrid: true,
    scrollShow: true,
    itemCount: 7,
  },
  yAxis: {
    disableGrid: true,
    splitNumber: 2,
    data: [
      {
        min: 0,
        max: 20,
      },
    ],
  },
}));
const chartData = computed(() => {
  console.log(
    props.records,
    props.records.map((v) => Number(v))
  );
  return {
    categories: props.date,
    series: [
      {
        name: tagMap[props.tag],
        data: props.records.map((v) => Number(v)),
      },
    ],
  };
});
</script>

<style lang="scss">
.card {
  width: 100%;
  height: fit-content;
  margin-bottom: 16rpx;
  // background-color: #fff;
  background-color: $u-info-light;
  padding: 24rpx;
  box-sizing: border-box;
  border-radius: 12rpx;
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);

  .title {
    color: #303133;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 24rpx;
  }

  .overview {
    font-size: 24rpx;
    margin-bottom: 24rpx;

    .primary {
      color: #2979ff;
    }

    .error {
      color: #fa3534;
    }

    .warning {
      color: #ff9900;
    }

    .success {
      color: #19be6b;
    }
  }

  .charts-box {
    width: 100%;
    height: 300rpx;
  }

  .empty {
    width: 100%;
    height: 300rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
