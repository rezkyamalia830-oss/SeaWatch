import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IonicVue } from '@ionic/vue'
import { Capacitor } from '@capacitor/core'
import { initDatabase, seedHistoryData, deleteObservationsByYear } from './data/database'

import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'
import '@ionic/vue/css/palettes/dark.system.css'
import './theme/variables.css'

const app = createApp(App)

app
  .use(IonicVue)
  .use(router)

router.isReady().then(async () => {
  // SQLite hanya diinisialisasi pada Android/iOS.
  // Saat menggunakan ionic serve di browser, lewati init SQLite.
  if (Capacitor.isNativePlatform()) {
    await initDatabase()
    //await seedHistoryData()
    // Hapus data dummy tahun 2024
  //await deleteObservationsByYear(2024)
  }

  app.mount('#app')
})