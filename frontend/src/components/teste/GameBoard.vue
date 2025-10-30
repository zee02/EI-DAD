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
// A variável 'ref' foi removida porque 'cards' local foi apagada

// 
// O 'const cards = ref([1,2,3,4,5,6,7,8])' FOI APAGADO [cite: 283]
// 

// Isto define 'cards' como uma prop que vem do componente pai [cite: 284]
const props = defineProps({
  cards: {
    type: Array,
    required: true
  }
})

// Isto é do Passo 20 [cite: 340-344]
const emits = defineEmits(['flipCard'])

const handleCardClick = (card) => {
  emits('flipCard', card)
}
</script>