<script setup>
const props = defineProps({
  members: {
    type: Array,
    default: () => [],
  },
})

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 3)
    .toUpperCase()
}
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-12">
    <div class="grid gap-6 md:grid-cols-3">
      <article
        v-for="member in props.members"
        :key="member.name"
        class="flex flex-col items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <span
          class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-base font-semibold text-green-700"
        >
          {{ getInitials(member.name) }}
        </span>
        <div>
          <p class="text-lg font-semibold text-gray-900">{{ member.name }}</p>
          <p class="text-sm text-green-600">{{ member.role }}</p>
        </div>
        <p class="text-sm text-gray-600">{{ member.story }}</p>
      </article>
    </div>
  </section>
</template>
