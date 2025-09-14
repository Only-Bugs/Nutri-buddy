<script setup>
import FeatureCard from './FeatureCard.vue'

const features = [
  {
    icon: 'meal',
    title: 'Smart Meal Plans',
    description:
      'Get personalized meal plans tailored to your dietary preferences, health goals, and lifestyle. Our AI creates balanced nutrition plans just for you.',
    points: ['Custom dietary restrictions', 'Weekly meal prep guides', 'Shopping list generation'],
  },
  {
    icon: 'star',
    title: 'Food Ratings & Reviews',
    description:
      'Rate meals, discover new recipes, and get recommendations based on your taste preferences and nutritional needs.',
    points: [
      'Community recipe sharing',
      'Nutritional scoring system',
      'Personalized recommendations',
    ],
  },
  {
    icon: 'analytics',
    title: 'Advanced Analytics',
    description:
      'Track your progress with detailed analytics and insights. Monitor calories, macros, and achieve your health goals faster.',
    points: ['Real-time nutrition tracking', 'Progress visualization', 'Health trend analysis'],
  },
]
</script>

<template>
  <section id="features" class="px-6 py-12 bg-gray-50">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h2 class="text-3xl font-bold">Everything You Need for Healthy Living</h2>
      <p class="text-gray-600 mt-2">
        Discover powerful features designed to make nutrition tracking simple, effective, and
        enjoyable.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <FeatureCard
        v-for="(feature, i) in features"
        :key="i"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
        :points="feature.points"
      />
    </div>
  </section>
</template>
