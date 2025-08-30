<script setup>
/**
 * RatingStars.vue
 *
 * Renders a 5-star rating input with validation.
 * Ensures rating is between 1 and 5 using vee-validate + yup.
 * Emits selected value to parent.
 */
import { watch } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
})
const emit = defineEmits(['update:modelValue'])

const { value: rating, errorMessage } = useField('rating')

watch(
  () => props.modelValue,
  (val) => {
    rating.value = val
  },
  { immediate: true },
)

watch(rating, (val) => {
  emit('update:modelValue', val)
})

function setRating(star) {
  rating.value = star
}
</script>

<template>
  <div>
    <div class="flex space-x-1">
      <span
        v-for="star in 5"
        :key="star"
        class="cursor-pointer text-2xl"
        :class="star <= rating ? 'text-yellow-500' : 'text-gray-400'"
        @click="setRating(star)"
      >
        ★
      </span>
    </div>
    <span v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</span>
  </div>
</template>
