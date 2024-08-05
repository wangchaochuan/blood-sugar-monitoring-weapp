<template>
  <view class="container">
    <view class="body">
      <view class="item">
        <view class="label">记录日期</view>
        <view class="value">{{ date }}</view>
      </view>
      <view class="item">
        <view class="label">记录时间</view>
        <view class="value">{{ data.time }}</view>
      </view>
      <view class="item">
        <view class="label">时段标签</view>
        <view class="value">{{ tag }}</view>
      </view>
      <view class="item">
        <view class="label">血糖值</view>
        <view class="value">{{ data.value }}</view>
      </view>
      <view class="item" v-if="data.remark">
        <view class="label">备注</view>
        <view class="value">{{ data.remark }}</view>
      </view>
    </view>
    <view class="footer">
      <u-button
        class="cancel"
        type="error"
        shape="circle"
        @click="showDeleteModal = true"
        >删除</u-button
      >
      <u-button
        class="confirm"
        type="primary"
        shape="circle"
        @click="visible = true"
        >编辑</u-button
      >
    </view>
  </view>
  <u-modal
    :show="showDeleteModal"
    :title="title"
    content="删除后数据将无法找回,请谨慎操作"
    showCancelButton
    asyncClose
    @confirm="deleteRecord"
    @cancel="showDeleteModal = false"
  ></u-modal>
  <record-modal
    :visible="visible"
    mode="edit"
    :data="model"
    @close="visible = false"
    @success="success"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getRecordById } from "@/service/index.js";
import { tagMap } from "@/utils/index.js";
import RecordModal from "@/components/record-modal.vue";

const id = ref("");
const type = ref("");
const data = ref({});
const date = ref("");
const tag = computed(() => {
  if (!type.value) return "空腹血糖";
  return tagMap[type.value] || "空腹血糖";
});
const model = computed(() => {
  return {
    ...data.value,
    date: date.value,
    tag: tag.value.slice(0, -2),
  };
});

const getData = async () => {
  if (!id.value) return;
  const response = await getRecordById(id.value);
  date.value = response.dateStr;
  if (type.value) {
    data.value = response[type.value];
  }
};

const showDeleteModal = ref(false);
const deleteRecord = () => {};

const visible = ref(false);
const success = () => {
  getData();
};

onLoad((option) => {
  id.value = option.id;
  type.value = option.type;
  getData();
});
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32rpx;
  padding-bottom: 64rpx;
  box-sizing: border-box;

  .body {
    flex: 1;

    .item {
      height: fit-content;
      min-height: 38px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16rpx;
      background-color: $u-info-disabled;
      border-radius: 38px;
      padding-right: 64rpx;

      .label {
        width: 180rpx;
        text-align: right;
        margin-right: 16rpx;
        color: $u-tips-color;
      }

      .value {
        height: fit-content;
        color: $u-main-color;
      }
    }
  }

  .footer {
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
    margin-top: 36rpx;
  }
}
</style>
