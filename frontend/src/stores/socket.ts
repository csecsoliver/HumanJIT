import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref<Socket | undefined>(undefined)
  
  return { socket }
})
