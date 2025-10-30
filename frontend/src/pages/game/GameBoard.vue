<template>
  <div class="m-auto pt-10 grid gap-10 p-4 max-w-lg grid-cols-4">
    <MemoryCard 
      v-for="card in props.cards" 
      :key="card.id"
      :card="card"
      @clicked="handleCardClick" 
    />
  </div>
</template>

<script setup>
import MemoryCard from './MemoryCard.vue';
// import { ref } from 'vue' // <-- Esta linha já não é necessária aqui

// 
// APAGA ESTA LINHA (Passo 16.1):
// const cards = ref([1,2,3,4,5,6,7,8])
// 

// ADICIONA ISTO (Passo 16.2):
// Define 'cards' como uma prop que vem do componente pai
const props = defineProps({
  cards: {
    type: Array,
    required: true
  }
})

// ADICIONA ISTO (Passo 20):
// Lógica para re-emitir o clique para a página principal
const emits = defineEmits(['flipCard'])

const handleCardClick = (card) => {
  emits('flipCard', card)
}
</script>