<template>
  <view class="container">
    <view class="header">
      <view class="text">查询时间范围 : </view>
      <view class="range" @click="handleShowRange">
        <view class="start">{{ start }}</view>
        <view class="sign">~</view>
        <view class="end">{{ end }}</view>
      </view>
    </view>
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
        :canEdit="false"
      ></date-card>
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
import { onShow, onLoad } from "@dcloudio/uni-app";
import { getRecordList } from "@/service/index.js";
import { recordToData } from "@/utils/index.js";
import dayjs from "dayjs";
import DateCard from "@/components/date-card.vue";

const today = dayjs();
const start = ref(today.subtract(6, "day").format("YYYY-MM-DD"));
const end = ref(today.format("YYYY-MM-DD"));
const userId = ref("");
const data = ref([]);

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
    showRangePicker.value = true;
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

onShow(() => {
  for (let i = 6; i >= 0; i--) {
    defaultDate.push(dayjs().subtract(i, "day").format("YYYY-MM-DD"));
  }
});

const getData = async () => {
  if (!userId.value) return;
  const params = {
    start: dayjs(start.value).startOf("day").valueOf(),
    end: dayjs(end.value).endOf("day").valueOf(),
    userId: userId.value,
  };
  const response = await getRecordList(params);
  console.log(response, "response");
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

onLoad((option) => {
  userId.value = option.userId;
});
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
        showRangePicker.value = true;
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
    box-sizing: border-box;
  }
}
</style>
