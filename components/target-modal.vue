<template>
  <view class="modal">
    <u-modal
      :show="props.show"
      :show-cancel-button="true"
      title="自定义血糖范围"
      @cancel="cancel"
      @confirm="confirm"
    >
      <template #default>
        <u-form :model="model.data" :rules="rules" ref="form">
          <view class="left">
            <view class="low">血糖偏低</view>
            <view class="normal">血糖正常</view>
            <view class="sub-high">前驱糖尿病</view>
            <view class="high">糖尿病</view>
          </view>
          <view class="right">
            <view class="item">
              <view class="prefix">≤</view>
              <u-form-item prop="low">
                <u-input
                  v-model="model.data.low"
                  type="digit"
                  placeholder="请输入"
                ></u-input>
              </u-form-item>
            </view>
            <view class="item">
              <view class="prefix">{{ model.data.low }} ~ </view>
              <u-form-item prop="normal">
                <u-input
                  v-model="model.data.normal"
                  type="digit"
                  placeholder="请输入"
                ></u-input>
              </u-form-item>
            </view>
            <view class="item">
              <view class="prefix">{{ model.data.normal }} ~ </view>
              <u-form-item prop="high">
                <u-input
                  v-model="model.data.high"
                  type="digit"
                  placeholder="请输入"
                ></u-input>
              </u-form-item>
            </view>
            <view class="item">
              <view class="prefix">≥ </view>
              <u-form-item>
                <u-input
                  v-model="model.data.high"
                  border="none"
                  type="digit"
                  readonly
                ></u-input>
              </u-form-item>
            </view>
          </view>
        </u-form>
      </template>
    </u-modal>
  </view>
</template>

<script setup>
import { ref, watch, nextTick, reactive, defineProps, defineEmits } from "vue";

const props = defineProps(["show", "data"]);
const emit = defineEmits(["close", "changeData"]);
const model = reactive({
  data: {},
});
const form = ref();
const rules = reactive({
  low: [
    {
      required: true,
      message: "请输入",
      trigger: ["change", "blur"],
    },
    {
      validator: (rule, value, callback) => {
        return value < model.data.normal;
      },
      message: "要比正常阈值小",
      trigger: ["change", "blur"],
    },
  ],
  normal: [
    {
      required: true,
      message: "请输入",
      trigger: ["change", "blur"],
    },
    {
      validator: (rule, value, callback) => {
        return value > model.data.low;
      },
      message: "要比偏低阈值大",
      trigger: ["change", "blur"],
    },
    {
      validator: (rule, value, callback) => {
        return value < model.data.high;
      },
      message: "要比偏高阈值小",
      trigger: ["change", "blur"],
    },
  ],
  high: [
    {
      required: true,
      message: "请输入",
      trigger: ["change", "blur"],
    },
    {
      validator: (rule, value, callback) => {
        return value > model.data.normal;
      },
      message: "要比正常阈值大",
      trigger: ["change", "blur"],
    },
  ],
});

const cancel = () => {
  emit("close");
};
const confirm = async () => {
  await form.value.validate();
  emit("changeData", model.data);
  emit("close");
};
watch(
  () => props.data,
  (data) => {
    model.data = data;
  }
);
watch(
  () => props.show,
  (show) => {
    if (show) {
      setTimeout(() => {
        form.value.setRules(rules);
      }, 100);
    }
  }
);
</script>

<script>
export default {
  name: "target-model",
  options: {
    styleIsolation: "shared",
  },
};
</script>

<style lang="scss" scoped>
.modal {
  :deep(.u-modal__content) {
    justify-content: flex-start;
  }

  :deep(.u-form) {
    display: flex;
    padding: 16rpx;

    .left {
      flex: 1;

      & > view {
        width: 200rpx;
        height: 64rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        border-radius: 8rpx;
        margin-bottom: 56rpx;

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

    .right {
      flex: 1;

      .item {
        width: 100%;
        height: 64rpx;
        display: flex;
        align-items: center;
        margin-bottom: 56rpx;

        .prefix {
          width: 100rpx;
          text-align: right;
          margin-right: 8rpx;
          font-size: 28rpx;
        }
      }
    }
  }

  :deep(.u-form-item) {
    flex: 1;

    &::after {
      border-bottom-color: transparent;
    }
  }

  :deep(.u-form-item__message) {
    position: absolute;
    bottom: -16rpx;
    padding-left: 0 !important;
  }
}
</style>
