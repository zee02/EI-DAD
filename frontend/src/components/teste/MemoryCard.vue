<template>
  <div 
    class="relative w-30 h-40 leading-40 cursor-pointer border-2 border-slate-600 text-2xl text-center"
    :class="{ 'cursor-not-allowed': card.matched }"
    @click="handleClick"
  >
    <div v-if="!card.flipped" class="bg-purple-600 hover:bg-violet-400 w-full h-full flex items-center justify-center">
      <span class="text-3xl text-white font-bold">?</span>
    </div>
    <div v-else class="w-full h-full flex items-center justify-center">
      {{ card.face }}
    </div>
  </div>
</template>

<script setup>
// 19: Script atualizado
const props = defineProps({
  card: {
    type: Object, // Tipo mudou de Number para Object
    required: true
  }
})

const emits = defineEmits(['clicked'])

const handleClick = () => {
  // A lógica no documento está ligeiramente diferente da store,
  // vamos simplificar para apenas emitir
  if (!props.card.matched && !props.card.flipped) {
    emits('clicked', props.card)
  }
}
</script>

<style scoped>
/* Ajustes para garantir que o div interno preencha o pai */
.w-30 { width: 7.5rem; } /* 120px */
.h-40 { height: 10rem; } /* 160px */
.leading-40 { line-height: 10rem; }
</style>