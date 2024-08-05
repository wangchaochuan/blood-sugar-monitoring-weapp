<template>
  <view class="container">
    <view class="tip"
      >血糖范围和您是否患有糖尿病以及您的年龄、体重密切相关，您可以根据医生的建议修改范围。</view
    >
    <scroll-view scroll-y="true">
      <target-group
        type="limosis"
        :title="data.limosis.title"
        :definition="data.limosis.definition"
        :sense="data.limosis.sense"
        :target="data.limosis.target"
        @edit="edit"
      ></target-group>
      <target-group
        type="beforeMeal"
        :title="data.beforeMeal.title"
        :definition="data.beforeMeal.definition"
        :sense="data.beforeMeal.sense"
        :target="data.beforeMeal.target"
        @edit="edit"
      ></target-group>
      <target-group
        type="afterMeal"
        :title="data.afterMeal.title"
        :definition="data.afterMeal.definition"
        :sense="data.afterMeal.sense"
        :target="data.afterMeal.target"
        @edit="edit"
      ></target-group>
      <target-group
        type="beforeSleep"
        :title="data.beforeSleep.title"
        :definition="data.beforeSleep.definition"
        :sense="data.beforeSleep.sense"
        :target="data.beforeSleep.target"
        @edit="edit"
      ></target-group>
    </scroll-view>
    <target-modal
      :show="show"
      v-model:data="model"
      @close="closeModal"
      @changeData="changeData"
    ></target-modal>
  </view>
</template>

<script setup>
import {
  ref,
  toRef,
  toRaw,
  reactive,
  nextTick,
  computed,
  watchEffect,
} from "vue";
import { getUserTarget, updateUserTarget } from "@/service/index.js";
import useUserStore from "@/store/user.js";
import useTargetStore from "@/store/target.js";
import TargetGroup from "@/components/target-group.vue";
import TargetModal from "@/components/target-modal.vue";

const targetStore = useTargetStore();
const target = computed(() => targetStore.target);
const userStore = useUserStore();
const userId = computed(() => userStore.user?._id);

const data = reactive({
  limosis: {
    title: "空腹血糖",
    definition: "空腹血糖一般是指早餐前血糖，离上一餐时间间隔达到8-12小时。",
    sense:
      "空腹血糖是糖尿病检测最常采用的有效指标，它所反应的是胰腺胰岛β细胞分泌胰岛素的能力和水平，能够更准确的反应胰岛素分泌状况。",
    target: {},
  },
  beforeMeal: {
    title: "餐前血糖",
    definition: "一般是指午餐和晚餐前的血糖。",
    sense:
      "餐前血糖反映胰岛β细胞分泌功能的持续性，可指导患者调整将要摄入的食物量和餐前注射胰岛素（或口服药）的量，有低血糖风险者应测定餐前血糖。",
    target: {},
  },
  afterMeal: {
    title: "餐后血糖",
    definition: "一般是指餐后2小时血糖，从吃第一口饭算起。",
    sense:
      "可反映患者胰岛素β细胞的储备功能（增加糖负荷后机体追加胰岛素分泌的能力），以及饮食控制和药物治疗的综合疗效。",
    target: {},
  },
  beforeSleep: {
    title: "睡前血糖",
    definition: "一般是指睡觉前的血糖水平。",
    sense:
      "监测睡前血糖主要是为了指导病人合理掌握睡前药量（主要指胰岛素）以及是否需要加餐，糖尿病人睡前血糖低于6.0 mmol/L，需要考虑加餐，以避免夜间发生低血糖。",
    target: {},
  },
});

watchEffect(() => {
  if (target.value?._id) {
    data.limosis.target = target.value.limosis;
    data.beforeMeal.target = target.value.beforeMeal;
    data.afterMeal.target = target.value.afterMeal;
    data.beforeSleep.target = target.value.beforeSleep;
  }
});

const show = ref(false);
const editType = ref("limosis");
const model = ref({});
const edit = (type, target) => {
  editType.value = type;
  model.value = target;
  show.value = true;
};
const closeModal = () => {
  show.value = false;
};

const changeData = async (target) => {
  const payload = {
    [editType.value]: target,
  };
  await updateUserTarget(userId.value, payload);
  const response = await getUserTarget(userId.value);
  targetStore.setTarget(response);
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  padding: 32rpx;
  box-sizing: border-box;

  .tip {
    color: #909399;
    padding: 0 20rpx;
  }
}
</style>
