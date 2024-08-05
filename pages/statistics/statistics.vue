<template>
  <view class="container">
    <view class="header">
      <view class="text">统计时间范围 : </view>
      <view class="range" @click="handleShowRange">
        <view class="start">{{ start }}</view>
        <view class="sign">~</view>
        <view class="end">{{ end }}</view>
      </view>
    </view>
    <view class="empty" v-if="isEmpty">
      <u-empty text="暂无数据"></u-empty>
    </view>
    <scroll-view scroll-y class="content" v-else>
      <statistics-card
        tag="limosis"
        :date="date"
        :records="limosisData"
      ></statistics-card>
      <statistics-card
        tag="afterBreakfast"
        :date="date"
        :records="afterBreakfastData"
      ></statistics-card>
      <statistics-card
        tag="beforeLunch"
        :date="date"
        :records="beforeLunchData"
      ></statistics-card>
      <statistics-card
        tag="afterLunch"
        :date="date"
        :records="afterLunchData"
      ></statistics-card>
      <statistics-card
        tag="beforeDinner"
        :date="date"
        :records="beforeDinnerData"
      ></statistics-card>
      <statistics-card
        tag="afterDinner"
        :date="date"
        :records="afterDinnerData"
      ></statistics-card>
      <statistics-card
        tag="beforeSleep"
        :date="date"
        :records="beforeSleepData"
      ></statistics-card>
    </scroll-view>
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
</template>

<script setup>
import { ref, reactive, computed, watchEffect } from "vue";
import { onShow, onLoad, onShareAppMessage } from "@dcloudio/uni-app";
import { getRecordList } from "@/service/index.js";
import dayjs from "dayjs";
import useUserStore from "@/store/user.js";
import StatisticsCard from "@/components/statistics-card.vue";

const userStore = useUserStore();
const userId = computed(() => userStore.user._id);

const today = dayjs();
const start = ref(today.subtract(6, "day").format("YYYY-MM-DD"));
const end = ref(today.format("YYYY-MM-DD"));

const showRangePicker = ref(false);
const defaultDate = reactive([]);
const minDate = dayjs().subtract(90, "day").valueOf();
const maxDate = dayjs().valueOf();
const handleShowRange = () => {
  // #ifdef MP-WEIXIN
  // 用户触发广告后，显示激励视频广告
  if (videoAd) {
    uni.showToast({
      title: "广告完成后可以进行日期筛选",
      icon: "none",
    });
    videoAd.show().catch(() => {
      // 失败重试
      videoAd
        .load()
        .then(() => videoAd.show())
        .catch((err) => {
          console.log("激励视频 广告显示失败");
        });
    });
  } else {
    this.showRangePicker = true;
  }
  return;
  // #endif
  showRangePicker.value = true;
};
const confirm = (e) => {
  const startDay = e[0];
  const endDay = e[e.length - 1];
  start.value = startDay;
  end.value = endDay;
  showRangePicker.value = false;
};

const data = reactive({
  recordList: [],
});
const limosisData = ref([]);
const afterBreakfastData = ref([]);
const beforeLunchData = ref([]);
const afterLunchData = ref([]);
const beforeDinnerData = ref([]);
const afterDinnerData = ref([]);
const beforeSleepData = ref([]);

const isEmpty = computed(() => {
  return (
    limosisData.value.every((v) => !v) &&
    afterBreakfastData.value.every((v) => !v) &&
    beforeLunchData.value.every((v) => !v) &
      afterLunchData.value.every((v) => !v) &&
    beforeDinnerData.value.every((v) => !v) &&
    afterDinnerData.value.every((v) => !v) &&
    beforeSleepData.value.every((v) => !v)
  );
});

const date = computed(() => {
  const days = [];
  const startDay = dayjs(start.value).valueOf();
  const endDay = dayjs(end.value).valueOf();
  let time = startDay;
  while (time <= endDay) {
    days.push(dayjs(time).format("MM-DD"));
    time = time + 1000 * 60 * 60 * 24;
  }
  return days;
});

const getData = async () => {
  if (!userId.value) return;
  const params = {
    start: dayjs(start.value).startOf("day").valueOf(),
    end: dayjs(end.value).endOf("day").valueOf(),
    userId: userId.value,
  };
  const response = await getRecordList(params);
  if (Array.isArray(response) && response.length > 0) {
    data.recordList = response;
  }
};

const getRecords = () => {
  const limosis = [];
  const afterBreakfast = [];
  const beforeLunch = [];
  const afterLunch = [];
  const beforeDinner = [];
  const afterDinner = [];
  const beforeSleep = [];
  date.value.forEach((day) => {
    const record = data.recordList.find((v) => v.dateStr?.includes(day));
    limosis.push(record?.limosis?.value ?? 0);
    afterBreakfast.push(record?.afterBreakfast?.value);
    beforeLunch.push(record?.beforeLunch?.value);
    afterLunch.push(record?.afterLunch?.value);
    beforeDinner.push(record?.beforeDinner?.value);
    afterDinner.push(record?.afterDinner?.value);
    beforeSleep.push(record?.beforeSleep?.value ?? 0);
  });
  limosisData.value = limosis;
  afterBreakfastData.value = afterBreakfast;
  beforeLunchData.value = beforeLunch;
  afterLunchData.value = afterLunch;
  beforeDinnerData.value = beforeDinner;
  afterDinnerData.value = afterDinner;
  beforeSleepData.value = beforeSleep;
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

watchEffect(() => {
  getRecords();
});

onShow(() => {
  for (let i = 6; i >= 0; i--) {
    defaultDate.push(dayjs().subtract(i, "day").format("YYYY-MM-DD"));
  }
});

onShareAppMessage((params) => {
  return {
    title: `${user.value.nick_name}邀请您使用每日血糖监测`,
    path: "/pages/personal-center/personal-center",
  };
});

// 插屏广告广告  start
// 在页面中定义插屏广告
let interstitialAd = null;
onLoad(() => {
  // 在页面onLoad回调事件中创建插屏广告实例
  if (wx.createInterstitialAd) {
    interstitialAd = wx.createInterstitialAd({
      adUnitId: "adunit-4c42dc67442f56a9",
    });
    interstitialAd.onLoad(() => {});
    interstitialAd.onError((err) => {});
    interstitialAd.onClose(() => {});
  }
});
onShow(() => {
  // 在适合的场景显示插屏广告
  if (interstitialAd) {
    interstitialAd.show().catch((err) => {
      console.error(err);
    });
  }
});
// 插屏广告广告  end

// 在页面中定义激励视频广告
let videoAd = null;
onLoad(() => {
  // #ifdef MP-WEIXIN
  // 在页面onLoad回调事件中创建激励视频广告实例
  if (wx.createRewardedVideoAd) {
    videoAd = wx.createRewardedVideoAd({
      adUnitId: "adunit-af3532810ad20223",
    });
    videoAd.onLoad(() => {});
    videoAd.onError((err) => {});
    videoAd.onClose((status) => {
      if ((status && status.isEnded) || status === undefined) {
        // 正常播放结束，下发奖励
        this.showRangePicker = true;
      }
    });
  }
  // #endif
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  padding: 32rpx;
  background-color: #fff;

  .header {
    height: 48rpx;
    display: flex;
    align-items: center;
    font-size: 24rpx;
    margin-bottom: 16rpx;

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

  .content {
    padding-bottom: 32rpx;
    background-color: #fff;
  }
}
</style>
