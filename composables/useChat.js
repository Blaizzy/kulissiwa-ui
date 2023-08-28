import { ref } from 'vue';

const clearMessagesFlag = ref(false);

export default function useChat() {
  function clearMessages() {
    clearMessagesFlag.value = !clearMessagesFlag.value;
  }

  return {
    clearMessagesFlag,
    clearMessages,
  };
}
