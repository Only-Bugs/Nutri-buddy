<script setup>
const props = defineProps({
  modelValue: String,
  loading: Boolean,
  error: String,
})
const emit = defineEmits(['update:modelValue', 'search'])
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-3">
      <input
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        type="text"
        placeholder="Search food (e.g., 100g chicken breast)"
        class="border rounded-lg px-3 py-2 flex-1"
      />
      <button
        @click="emit('search')"
        :disabled="loading"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Searching…' : 'Search' }}
      </button>
    </div>

    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>
