<template>
  <view>
    <uni-group :title="props.title" mode="card" top="16" class="group">
      <view class="definition">
        <view class="label">定义:</view>
        <view class="text">{{ props.definition }}</view>
      </view>
      <view class="sense">
        <view class="label">监测意义:</view>
        <view class="text">{{ props.sense }}</view>
      </view>
      <view class="target-list" @click="onClick">
        <view class="target low">
          <view class="value">≤ {{ target?.low }}</view>
          <view class="label">血糖偏低</view>
        </view>
        <view class="target normal">
          <view class="value">{{ target?.low }} ~ {{ target?.normal }}</view>
          <view class="label">血糖正常</view>
        </view>
        <view class="target sub-high">
          <view class="value">{{ target?.normal }} ~ {{ target?.high }}</view>
          <view class="label">前驱糖尿病</view>
        </view>
        <view class="target high">
          <view class="value">≥ {{ target?.high }}</view>
          <view class="label">糖尿病</view>
        </view>
      </view>
    </uni-group>
  </view>
</template>

<script setup>
const props = defineProps(["type", "title", "definition", "sense", "target"]);
const emit = defineEmits(["edit"]);
const onClick = () => {
  emit("edit", props.type, props.target);
};
</script>

<style lang="scss" scoped>
.group {
  .definition,
  .sense {
    margin-bottom: 8rpx;

    .label {
      margin-right: 8rpx;
      font-size: 24rpx;
      color: $u-tips-color;
    }

    .text {
      color: $u-main-color;
      font-size: 24rpx;
    }
  }

  .target-list {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 16rpx;

    .target {
      width: 280rpx;
      height: fit-content;
      border-radius: 8rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 16rpx;
      padding: 16rpx 0;
      color: #fff;

      .value {
      }

      &.low {
        background-color: $u-primary;
      }

      &.normal {
        background-color: $u-success;
      }

      &.sub-high {
        background-color: $u-warning;
      }

      &.high {
        background-color: $u-error;
      }
    }
  }
}
</style>
