<template>
  <ion-app>
    <SplashScreen v-if="showSplash" />
    <ion-router-outlet v-else />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import SplashScreen from './components/SplashScreen.vue';
import { useRouter } from 'vue-router'
import { App as CapacitorApp } from '@capacitor/app'

const showSplash = ref(true);
const router = useRouter()

// Daftar route yang dianggap "halaman utama" / root.
// Kalau user berada di salah satu ini dan tidak ada
// riwayat untuk dimundurkan, tombol back akan
// menutup aplikasi.
const rootPaths = ['/home', '/']

onMounted(() => {
  document.addEventListener('ionBackButton', (ev: any) => {
    ev.detail.register(-1, () => {
      const currentPath = router.currentRoute.value.path

      if (rootPaths.includes(currentPath)) {
        // Di halaman utama: tidak ada lagi yang bisa dimundurkan,
        // jadi keluar dari aplikasi.
        CapacitorApp.exitApp()
      }

      // Selain di halaman utama: TIDAK melakukan apa-apa di sini.
      // Navigasi mundur sudah otomatis ditangani oleh Ionic
      // (ion-router-outlet) sendiri.
    })
  })
})

onMounted(() => {
  setTimeout(() => {
    showSplash.value = false;
  }, 1800);
});
</script>