<script setup>
import Header from './header.vue';
import Footer from './footer.vue';
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Header />
    <main class="container my-3 flex-grow-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>
