<script setup>
import Navbar from '@/components/landing/Navbar.vue'
import HeroSection from '@/components/landing/HeroSection.vue'
import FeaturesSection from '@/components/landing/FeaturesSection.vue'
import AboutSection from '@/components/landing/AboutSection.vue'
import ContactSection from '@/components/landing/ContactSection.vue'
import CtaSection from '@/components/landing/CtaSection.vue'
import Footer from '@/components/landing/Footer.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white text-gray-900">
    <Navbar />
    <main class="flex-1">
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <ContactSection />
      <CtaSection />
    </main>
    <Footer />
  </div>
</template>
