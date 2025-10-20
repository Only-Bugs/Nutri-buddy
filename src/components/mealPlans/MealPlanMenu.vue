<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  currentStatus: {
    type: String,
    default: 'draft',
  },
  disableExport: { type: Boolean, default: false },
  disableSearch: { type: Boolean, default: false },
  exporting: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'edit', 'search', 'export', 'status', 'archive'])

const confirmingArchive = ref(false)

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
]

function handleArchive() {
  if (!confirmingArchive.value) {
    confirmingArchive.value = true
    return
  }
  confirmingArchive.value = false
  emit('archive')
}

function handleClose() {
  confirmingArchive.value = false
  emit('close')
}
</script>

<template>
  <transition name="menu">
    <aside
      v-if="show"
      class="absolute right-0 top-full z-30 mt-3 w-52 rounded-xl border border-gray-100 bg-white p-2 shadow-lg ring-1 ring-black/5"
      @mouseleave="confirmingArchive = false"
    >
      <div class="px-2 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Manage
      </div>
      <button
        type="button"
        class="menu-item"
        @click="emit('edit')"
      >
        <FontAwesomeIcon icon="pen" class="text-gray-400" />
        <span>Edit plan</span>
      </button>
      <button
        type="button"
        class="menu-item"
        :class="disableSearch ? 'cursor-not-allowed text-gray-300' : ''"
        :disabled="disableSearch"
        @click="emit('search')"
      >
        <FontAwesomeIcon icon="magnifying-glass" class="text-gray-400" />
        <span>Search dishes</span>
      </button>

      <div class="mt-2 px-2 pb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Export
      </div>
      <button
        type="button"
        class="menu-item"
        :class="disableExport || exporting ? 'cursor-not-allowed text-gray-300' : ''"
        :disabled="disableExport || exporting"
        @click="emit('export')"
      >
        <FontAwesomeIcon icon="file-arrow-down" class="text-gray-400" />
        <span v-if="!exporting">Export plan</span>
        <span v-else class="flex items-center gap-2">
          <svg
            class="h-4 w-4 animate-spin text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Sending…
        </span>
      </button>

      <div class="mt-2 px-2 pb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Status
      </div>
      <ul class="space-y-1">
        <li v-for="option in statusOptions" :key="option.value">
          <button
            type="button"
            class="menu-item"
            :class="currentStatus === option.value ? 'bg-green-50 text-green-700' : ''"
            @click="emit('status', option.value)"
          >
            <FontAwesomeIcon
              :icon="currentStatus === option.value ? 'circle-check' : 'circle'"
              class="text-gray-300"
            />
            <span>{{ option.label }}</span>
          </button>
        </li>
      </ul>

      <div class="mt-2 px-2 pb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Danger
      </div>
      <button
        type="button"
        class="menu-item text-red-600 hover:bg-red-50"
        @click="handleArchive"
      >
        <FontAwesomeIcon icon="box-archive" class="text-red-400" />
        <span>{{ confirmingArchive ? 'Tap again to confirm' : 'Archive plan' }}</span>
      </button>

      <button
        type="button"
        class="mt-2 w-full rounded-lg bg-gray-50 py-2 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:bg-gray-100"
        @click="handleClose"
      >
        Close
      </button>
    </aside>
  </transition>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.menu-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.65rem;
  border-radius: 0.75rem;
  padding: 0.55rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  transition: background-color 0.18s ease, color 0.18s ease;
}
.menu-item:hover:not(:disabled) {
  background-color: #f9fafb;
}
</style>
