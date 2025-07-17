<script lang="ts" setup>
import { useSocketStore } from '@/stores/socket'
import { ref } from 'vue'
import { watch } from 'vue'
const role = ref('coder')
const line = ref('')
const code = ref('')
const thinking = ref(false);
async function submitLine() {
  thinking.value = true
  useSocketStore().socket?.once('code', (arg) => {
    code.value = ''
    for (const i of arg as string[]) {
      code.value = code.value + i + '\n'
    }
  })
  console.log(line.value)
  useSocketStore().socket?.emit('line', line.value)
  line.value = ''
  useSocketStore().socket?.once('ack', () => {
    thinking.value = false
    line.value = ''
    console.log("acknowledged")
  })
}


</script>
<template>
  <div>
      <p>
        You are the coder, your partner can only get to see your newest line after you send it. You
        can only submit a new line once your partner has acknowledged your previous one.
      </p>
      <hr />
      <p v-if="thinking">Wait for the compiler to confirm!</p>
      <label for="code">Your existing code</label><br />
      <textarea name="code" id="code" v-model="code" readonly></textarea>
      <form @submit.prevent="submitLine">

        <label for="line">Your next line: </label><br />
        <input type="text" name="line" id="line" v-model="line" :readonly="thinking" />
        <button type="submit" :disabled="thinking">Submit line</button>
      </form>
      <p>
        To finish writing your code, and compare with your partner's results, press the button
        below.
      </p>
      <button @click="">Finish</button>
    </div>
</template>
