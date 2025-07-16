<script setup lang="ts">
import { ref } from 'vue'
import BackendStatus from './components/BackendStatus.vue'
import KnownServers from './components/KnownServers.vue'
import { io } from "socket.io-client";
import { useSocketStore } from './stores/socket';
const role = ref("")
async function refresh() {
  useSocketStore().socket?.on("state", (arg)=>{
    role.value = arg.role;
  })
}

</script>

<template>
  <header>
    <h1>HumanJIT</h1>
    <BackendStatus />
  </header>
  <main>
    <div v-if="role == 'coder'">

    </div>
    <label for="code">Existing code</label>
    <textarea name="code" id="code"></textarea>
    <form>

    </form>
  </main>
</template>
