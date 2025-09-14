<script setup>
import Navbar from '@/components/landing/Navbar.vue'
import HeroSection from '@/components/landing/HeroSection.vue'
import FeaturesSection from '@/components/landing/FeaturesSection.vue'
import CtaSection from '@/components/landing/CtaSection.vue'
import Footer from '@/components/landing/Footer.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-1">
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </main>
    <Footer />
  </div>
</template>
