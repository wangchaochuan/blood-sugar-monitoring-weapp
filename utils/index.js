export * from "./data.js";

export const formatRecord = (data) => {
  const { time, value, tag, remark, date, dateStr, userId } = data;
  const record = {
    date,
    dateStr,
    userId,
  };
  switch (tag) {
    case "空腹":
      record.limosis = {
        time,
        value,
        remark,
      };
      break;
    case "早餐后":
      record.afterBreakfast = {
        time,
        value,
        remark,
      };
      break;
    case "午餐前":
      record.beforeLunch = {
        time,
        value,
        remark,
      };
      break;
    case "午餐后":
      record.afterLunch = {
        time,
        value,
        remark,
      };
      break;
    case "晚餐前":
      record.beforeDinner = {
        time,
        value,
        remark,
      };
      break;
    case "晚餐后":
      record.afterDinner = {
        time,
        value,
        remark,
      };
      break;
    case "睡前":
      record.beforeSleep = {
        time,
        value,
        remark,
      };
      break;
    default:
      record.limosis = {
        time,
        value,
        remark,
      };
      break;
  }
  return record;
};

export const recordToData = (record) => {
  const data = [];
  const {
    limosis,
    afterBreakfast,
    beforeLunch,
    afterLunch,
    beforeDinner,
    afterDinner,
    beforeSleep,
  } = record;
  if (limosis?.value) {
    data.push({
      tag: "空腹血糖",
      type: "limosis",
      value: limosis.value.toFixed(1),
      remark: limosis.remark,
      time: limosis.time,
    });
  }
  if (afterBreakfast?.value) {
    data.push({
      tag: "早餐后血糖",
      type: "afterBreakfast",
      value: afterBreakfast.value.toFixed(1),
      remark: afterBreakfast.remark,
      time: afterBreakfast.time,
    });
  }
  if (beforeLunch?.value) {
    data.push({
      tag: "午餐前血糖",
      type: "beforeLunch",
      value: beforeLunch.value.toFixed(1),
      remark: beforeLunch.remark,
      time: beforeLunch.time,
    });
  }
  if (afterLunch?.value) {
    data.push({
      tag: "午餐后血糖",
      type: "afterLunch",
      value: afterLunch.value.toFixed(1),
      remark: afterLunch.remark,
      time: afterLunch.time,
    });
  }
  if (beforeDinner?.value) {
    data.push({
      tag: "晚餐前血糖",
      type: "beforeDinner",
      value: beforeDinner.value.toFixed(1),
      remark: beforeDinner.remark,
      time: beforeDinner.time,
    });
  }
  if (afterDinner?.value) {
    data.push({
      tag: "晚餐后血糖",
      type: "afterDinner",
      value: afterDinner.value.toFixed(1),
      remark: afterDinner.remark,
      time: afterDinner.time,
    });
  }
  if (beforeSleep?.value) {
    data.push({
      tag: "睡前血糖",
      type: "beforeSleep",
      value: beforeSleep.value.toFixed(1),
      remark: beforeSleep.remark,
      time: beforeSleep.time,
    });
  }
  return data;
};
