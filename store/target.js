import { defineStore } from "pinia";
import { ref } from "vue";

const useTargetStore = defineStore("target", () => {
  const target = ref({});

  function setTarget(value) {
    target.value = value;
  }

  return {
    target,
    setTarget,
  };
});

export default useTargetStore;
