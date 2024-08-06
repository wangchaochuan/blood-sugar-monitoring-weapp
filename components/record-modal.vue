<template>
  <u-popup
    closeable
    :round="24"
    :show="visible"
    :closeOnClickOverlay="false"
    @close="close"
    @open="open"
  >
    <view class="content">
      <view class="tip" v-if="mode === 'create'">
        如果添加多个同一天同时段标签血糖值,最后一条记录将覆盖之前的记录
      </view>
      <view class="form">
        <u-form
          labelPosition="left"
          :label-width="70"
          :model="model"
          :rules="rules"
          ref="formRef"
        >
          <u-form-item
            label="测量日期"
            prop="date"
            required
            @click="showDatePicker = true"
          >
            <view class="date-text">
              <u-text
                mode="date"
                align="right"
                line-height="38px"
                :text="model.date"
              ></u-text>
            </view>
          </u-form-item>
          <u-form-item
            label="测量时间"
            prop="time"
            required
            @click="showTimePicker = true"
          >
            <view class="date-text">
              <u-text
                line-height="38px"
                align="right"
                :text="model.time"
              ></u-text>
            </view>
          </u-form-item>
          <u-form-item label="血糖值" prop="value" required>
            <u-input
              v-model.number="model.value"
              type="digit"
              placeholder="请输入"
              border="bottom"
              inputAlign="right"
            >
              <template #suffix>
                <u-text
                  text="mmol/L"
                  slot="suffix"
                  margin="0 3px 0 0"
                  type="tips"
                ></u-text>
              </template>
            </u-input>
          </u-form-item>
          <u-form-item label="时段标签" prop="tag" @click="openPicker">
            <view class="tag-container">
              <view class="tag">
                <u-text
                  line-height="38px"
                  :text="model.tag"
                  suffixIcon="arrow-right"
                ></u-text>
              </view>
            </view>
          </u-form-item>
          <u-form-item label="备注" prop="remark">
            <u-input
              v-model="model.remark"
              placeholder="请输入"
              border="bottom"
            ></u-input>
          </u-form-item>
        </u-form>
      </view>
      <view class="footer">
        <u-button class="cancel" type="error" shape="circle" @click="cancel"
          >取消</u-button
        >
        <u-button
          class="confirm"
          type="primary"
          shape="circle"
          :loading="loading"
          @click="confirm"
          >确定</u-button
        >
      </view>
      <u-datetime-picker
        mode="date"
        v-model="model.date"
        :show="showDatePicker"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="closeDatePicker"
        @close="closeDatePicker"
        @confirm="closeDatePicker"
      ></u-datetime-picker>
      <u-datetime-picker
        mode="time"
        v-model="model.time"
        :show="showTimePicker"
        @cancel="closeTimePicker"
        @close="closeTimePicker"
        @confirm="closeTimePicker"
      ></u-datetime-picker>
      <u-picker
        :show="showTagPicker"
        :columns="[tagList]"
        @confirm="changeTag"
        @cancel="showTagPicker = false"
      ></u-picker>
    </view>
  </u-popup>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import dayjs from "dayjs";
import { tagList, formatRecord } from "@/utils/index.js";
import { addRecord } from "@/service/index.js";
import useUserStore from "@/store/user.js";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "create",
  },
  data: {
    type: Object,
    default: () => ({}),
  },
});
const userStore = useUserStore();
const userId = computed(() => userStore.user._id);
const emits = defineEmits(["close", "success"]);
const close = () => {
  emits("close");
};
const open = () => {
  if (props.mode === "create") {
    model.date = maxDate;
    model.time = today.format("HH:mm");
    model.value = undefined;
    model.tag = "空腹";
    model.remark = "";
  } else {
    model.date = props.data.date;
    model.time = props.data.time;
    model.value = props.data.value;
    model.tag = props.data.tag;
    model.remark = props.data.remark;
  }
};

const showDatePicker = ref(false);
const today = dayjs();
const minDate = today.subtract(10, "day").valueOf();
const maxDate = today.valueOf();
const closeDatePicker = () => {
  showDatePicker.value = false;
};

const showTimePicker = ref(false);
const closeTimePicker = () => {
  showTimePicker.value = false;
};

const model = reactive({
  date: maxDate,
  time: today.format("HH:mm"),
  value: undefined,
  tag: "空腹",
  remark: "",
});
const formRef = ref(null);
const rules = {
  value: [
    {
      type: "number",
      required: true,
      message: "请输入血糖值",
      trigger: ["blur", "change"],
    },
  ],
};

const showTagPicker = ref(false);
const openPicker = () => {
  if (props.mode === "create") {
    showTagPicker.value = true;
  }
};
const changeTag = ({ value }) => {
  model.tag = value[0];
  showTagPicker.value = false;
};

const cancel = () => {
  close();
};
const loading = ref(false);
const confirm = async () => {
  try {
    loading.value = true;
    await formRef.value.validate();
    const data = {
      date: dayjs(model.date).valueOf(),
      dateStr: dayjs(model.date).format("YYYY-MM-DD"),
      userId: userId.value,
      value: model.value,
      time: model.time,
      tag: model.tag,
      remark: model.remark,
    };
    const params = formatRecord(data);
    console.log(params, "params");
    const response = await addRecord(params);
    console.log(response);
    emits("success", model);
    close();
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  formRef.value?.setRules(rules);
});
</script>
<style lang="scss">
.content {
  height: fit-content;
  min-height: 240rpx;
  display: flex;
  flex-direction: column;
  padding: 48rpx;

  .tip {
    color: #909399;
    margin-bottom: 16rpx;
  }

  .form {
    flex: 1;

    .date-text {
      width: 100%;
      border-bottom: 0.5px solid #dadbde;
      padding-left: 9px;
    }

    .tag-container {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      border-bottom: 0.5px solid #dadbde;
      padding-left: 9px;

      .tag {
        width: fit-content;
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
