<script setup>
import { computed } from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'login',
  },
})

const emit = defineEmits(['update:modelValue'])

const tabs = [
  { id: 'login', label: 'Sign In', component: LoginForm },
  { id: 'register', label: 'Sign Up', component: RegisterForm },
]

const activeComponent = computed(
  () => tabs.find((tab) => tab.id === props.modelValue)?.component ?? LoginForm,
)

function selectTab(id) {
  if (id !== props.modelValue) emit('update:modelValue', id)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div
      class="flex rounded-full border border-gray-200 bg-gray-100/60 p-1 text-lg font-semibold text-gray-500"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="flex-1 rounded-full px-4 py-2 transition"
        :class="
          tab.id === modelValue
            ? 'bg-white text-gray-900 shadow-sm'
            : 'hover:text-gray-700 focus-visible:outline-2 focus-visible:outline focus-visible:outline-green-500/40'
        "
        @click="selectTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <Transition name="slide" mode="out-in">
      <component :is="activeComponent" :key="modelValue" />
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter-from {
  transform: translateX(40px);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}
</style>
