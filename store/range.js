import { defineStore } from "pinia";
import { ref } from "vue";
import dayjs from "dayjs";

const useRangeStore = defineStore("range", () => {
  const today = dayjs();
  const start = ref(today.subtract(30, "day").format("YYYY-MM-DD"));
  const end = ref(today.format("YYYY-MM-DD"));

  function setStart(val) {
    start.value = val;
  }

  function setEnd(val) {
    end.value = val;
  }

  return {
    start,
    end,
    setStart,
    setEnd,
  };
});

export default useRangeStore;
