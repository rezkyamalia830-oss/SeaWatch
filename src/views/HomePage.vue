<template>
  <ion-page>
    <ion-content :fullscreen="true" class="sea-content">
      <div class="desktop-background">
        <div class="app-container">
          <!-- ================= HEADER ================= -->
          <section class="hero-header">
            <div class="header-top">
              <div>
                <p class="greeting">{{ greeting }}</p>

                <h1>SeaWatch</h1>
              </div>

              <div class="profile-avatar">
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00B4D8"
    stroke-width="1.8"
    stroke-linecap="round"
  >
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.5 2 5 2 2.5-2 5-2 2.3.5 2.5 1"/>
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.3.5 2.5 1"/>
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.3.5 2.5 1"/>
  </svg>
</div>
            </div>

            <!-- ================= LOKASI AKTIF ================= -->
<div class="active-location-wrapper">
  <button
    type="button"
    class="active-location-button"
    @click="isLocationPickerOpen = true"
    :aria-expanded="isLocationPickerOpen"
  >
    <ion-icon :icon="locationOutline" />

    <span class="location-name">
      {{ activeLocation?.name || 'Pilih Lokasi' }}
    </span>

    <span class="active-badge">
      Aktif
    </span>

    <ion-icon
      class="location-chevron"
      :icon="chevronDownOutline"
    />
  </button>
</div>
          </section>

          <!-- ================= WAVE ================= -->
          <div class="wave-decoration">
            <svg viewBox="0 0 430 32" preserveAspectRatio="none">
              <path
                d="M0 32 L0 10
                Q55 0 107.5 10
                Q160 20 215 10
                Q270 0 322.5 10
                Q375 20 430 10
                L430 32 Z"
                fill="#0E3A6B"
              />
            </svg>

            <div class="wave-overlay"></div>
          </div>

          <!-- ================= CONTENT ================= -->
          <main class="main-content">
            <!-- ===== KONDISI LAUT ===== -->
            <section class="card condition-card">
              <div class="card-header">
                <span class="card-title"> Kondisi Laut </span>

                <span class="live-badge"> Live API </span>
              </div>

              <div class="condition-grid">
                <!-- Tinggi Gelombang -->
                <div class="condition-item">
                  <div class="condition-icon wave-icon">
                    <ion-icon :icon="waterOutline" />
                  </div>

                  <div>
                    <p>Tinggi Gelombang</p>
                    <strong>
  {{
    marineData?.waveHeight !== null &&
    marineData?.waveHeight !== undefined
      ? `${marineData.waveHeight.toFixed(2).replace(".", ",")} m`
      : "—"
  }}
</strong>
                  </div>
                </div>

                <!-- Suhu Laut -->
                <div class="condition-item">
                  <div class="condition-icon temperature-icon">
                    <ion-icon :icon="thermometerOutline" />
                  </div>

                  <div>
                    <p>Suhu Laut</p>
                    <strong>
  {{
    marineData?.seaSurfaceTemperature !== null &&
    marineData?.seaSurfaceTemperature !== undefined
      ? `${marineData.seaSurfaceTemperature.toFixed(1).replace(".", ",")}°C`
      : "—"
  }}
</strong>
                  </div>
                </div>

                <!-- Kecepatan Angin -->
                <div class="condition-item">
                  <div class="condition-icon wind-icon">
                    <ion-icon :icon="speedometerOutline" />
                  </div>

                  <div>
                    <p>Kecepatan Angin</p>
                    <strong>
  {{
    weatherData?.windSpeed !== null &&
    weatherData?.windSpeed !== undefined
      ? `${weatherData.windSpeed.toFixed(1).replace(".", ",")} km/j`
      : "—"
  }}
</strong>
                  </div>
                </div>

                <!-- Kondisi Cuaca -->
                <div class="condition-item">
                  <div class="condition-icon sun-icon">
                    <ion-icon :icon="sunnyOutline" />
                  </div>

                  <div>
                    <p>Kondisi Cuaca</p>
                    <strong>
  {{
    getWeatherDescription(
      weatherData?.weatherCode ?? null
    )
  }}
</strong>
                  </div>
                </div>
              </div>
            </section>

            <!-- ===== WAWASAN AI ===== -->
            <button class="ai-card" type="button" @click="goTo('/ai-analysis')">
              <div class="ai-header">
                <div class="ai-title">
                  <div class="ai-icon">
                    <ion-icon :icon="sparklesOutline" />
                  </div>

                  <span>WAWASAN AI</span>
                </div>

                <span class="ai-more"> Lihat selengkapnya → </span>
              </div>

              <p class="ai-text">
  "{{ aiSummary }}"
</p>
            </button>

              <!-- ===== OBSERVASI TERBARU ===== -->
<section class="observations-section">

  <div class="section-header">
    <h2>Observasi Terbaru</h2>

    <button
      type="button"
      class="see-all"
      @click="goTo('/observations')"
    >
      Lihat semua
    </button>
  </div>

  <!-- Jika ada observasi -->
  <template v-if="recentObservations.length > 0">

    <article
      v-for="observation in recentObservations"
      :key="observation.id"
      class="observation-card"
    >

      <div class="observation-top">

        <div class="observation-info">
          <h3>{{ observation.location }}</h3>

          <p>
            {{ formatObservationDate(observation.date) }}
          </p>
        </div>

        <span
          class="water-badge"
          :class="{
            clear: observation.waterCondition === 'Jernih',
            cloudy: observation.waterCondition === 'Agak Keruh',
            murky: observation.waterCondition === 'Keruh'
          }"
        >
          {{ observation.waterCondition }}
        </span>

      </div>

      <div class="observation-bottom">

        <span
          class="waste-badge"
          :class="{
            none: observation.wasteLevel === 'Tidak Ada',
            low: observation.wasteLevel === 'Rendah',
            medium: observation.wasteLevel === 'Sedang',
            high: observation.wasteLevel === 'Tinggi'
          }"
        >
          Sampah: {{ observation.wasteLevel }}
        </span>

      </div>

    </article>

  </template>

  <!-- Jika belum ada observasi -->
  <div
    v-else
    class="empty-observation"
  >

    <div class="empty-observation-icon">
      <ion-icon :icon="locationOutline" />
    </div>

    <h3>Belum ada observasi</h3>

    <p>
      Belum ada catatan pengamatan untuk
      <strong>{{ activeLocation?.name ?? 'lokasi ini' }}</strong>
    </p>

    <button
  type="button"
  class="empty-observation-button"
  @click="goTo('/add-observation')"
  aria-label="Tambah Observasi"
>
  <ion-icon :icon="addOutline" />
</button>

  </div>

</section>

</main>
  

          <!-- ================= LOCATION PICKER ================= -->
<div
  v-if="isLocationPickerOpen"
  class="location-picker-overlay"
  role="dialog"
  aria-modal="true"
  aria-labelledby="location-picker-title"
  @click="isLocationPickerOpen = false"
>
  <div
    class="location-picker-sheet"
    @click.stop
  >
    <!-- Handle -->
    <div class="location-picker-handle"></div>

    <!-- Header -->
    <div class="location-picker-header">
      <div>
        <h2 id="location-picker-title">
          Pilih Lokasi
        </h2>

        <p>
          Kondisi laut di dashboard akan diperbarui
        </p>
      </div>

      <button
        type="button"
        class="location-picker-close"
        @click="isLocationPickerOpen = false"
        aria-label="Tutup pilihan lokasi"
      >
        <ion-icon :icon="closeOutline" />
      </button>
    </div>

    <!-- Daftar lokasi -->
    <div class="location-picker-list">

      <button
        v-for="location in locations"
        :key="location.id"
        type="button"
        class="location-picker-item"
        :class="{
          selected: location.id === selectedLocationId
        }"
        @click="selectLocation(location)"
      >

        <!-- Icon -->
        <span class="location-picker-icon">
          <ion-icon :icon="locationOutline" />
        </span>

        <!-- Informasi -->
        <span class="location-picker-info">

          <span class="location-picker-name">
            {{ location.name }}
          </span>

          <span class="location-picker-detail">
            {{ getLocationPreview(location.id).temperature }}
            · Gelombang
            {{ getLocationPreview(location.id).wave }}
            ·
            {{ getLocationPreview(location.id).condition }}
          </span>

        </span>

        <!-- Check -->
        <span class="location-picker-check">
          <ion-icon :icon="checkmarkOutline" />
        </span>

      </button>

    </div>
  </div>
</div>

          <!-- ================= BOTTOM NAV ================= -->
          <nav class="bottom-nav">
            <!-- Beranda -->
            <button type="button" class="nav-item active" @click="goTo('/')">
              <ion-icon :icon="homeOutline" />

              <span> Beranda </span>
            </button>

            <!-- Observasi -->
            <button
              type="button"
              class="nav-item"
              @click="goTo('/observations')"
            >
              <ion-icon :icon="clipboardOutline" />

              <span> Observasi </span>
            </button>

            <!-- Lokasi -->
            <button type="button" class="nav-item" @click="goTo('/locations')">
              <ion-icon :icon="locationOutline" />

              <span> Lokasi </span>
            </button>

            <!-- Statistik -->
            <button type="button" class="nav-item" @click="goTo('/statistics')">
              <ion-icon :icon="barChartOutline" />

              <span> Statistik </span>
            </button>
          </nav>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon } from "@ionic/vue";

import {
  locationOutline,
  addOutline,
  waterOutline,
  thermometerOutline,
  speedometerOutline,
  sunnyOutline,
  sparklesOutline,
  homeOutline,
  clipboardOutline,
  barChartOutline,
  chevronDownOutline,
  closeOutline,
  checkmarkOutline,
} from "ionicons/icons";

import { ref, computed, onMounted, watch } from 'vue'
import { onIonViewWillEnter } from '@ionic/vue'
onIonViewWillEnter(async () => {
  await loadObservations()
})

import { useRouter } from 'vue-router'

import { getLocations, getObservations } from '../data/database'
import { getMarineCurrent } from '../data/marineApi'
import { getWeatherCurrent } from '../data/weatherApi'
import {
  analyzeObservations,
  type ObservationForAI
} from '../services/aiRuleEngine'


const router = useRouter()

interface Location {
  id: number
  name: string
  latitude: number
  longitude: number
  description: string
}

interface Observation {
  id: number
  locationId: number
  location: string
  date: string
  waterCondition: string
  wasteLevel: string
  marineLife: string
  weatherCondition: string
  notes: string
}

const locations = ref<Location[]>([])
const observations = ref<Observation[]>([])
const selectedLocationId = ref<number>(0)
const isLocationPickerOpen = ref(false)

const aiSummary = ref('Belum ada cukup data observasi untuk dianalisis.')

const marineData = ref<Awaited<ReturnType<typeof getMarineCurrent>> | null>(null)
const weatherData = ref<Awaited<ReturnType<typeof getWeatherCurrent>> | null>(null)

const loadingCondition = ref(false)
const apiError = ref('')

interface LocationPreview {
  temperature: string
  wave: string
  condition: string
}

const locationPreviews = ref<Record<number, LocationPreview>>({})

const getLocationPreview = (locationId: number): LocationPreview => {
  return locationPreviews.value[locationId] ?? {
    temperature: '—',
    wave: '—',
    condition: 'Memuat'
  }
}

const activeLocation = computed(() => {
  return locations.value.find(
    location => location.id === selectedLocationId.value
  ) ?? null
})

const selectLocation = async (location: Location) => {
  selectedLocationId.value = location.id
  isLocationPickerOpen.value = false

  await loadLocationData()
  await loadObservations()
}


const getWeatherDescription = (code: number | null) => {
  if (code === null) {
    return 'Tidak tersedia'
  }

  if (code === 0) {
    return 'Cerah'
  }

  if ([1, 2, 3].includes(code)) {
    return 'Berawan'
  }

  if ([45, 48].includes(code)) {
    return 'Berkabut'
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return 'Gerimis'
  }

  if ([61, 63, 65, 66, 67].includes(code)) {
    return 'Hujan'
  }

  if ([71, 73, 75, 77].includes(code)) {
    return 'Salju'
  }

  if ([80, 81, 82].includes(code)) {
    return 'Hujan deras'
  }

  if ([95, 96, 99].includes(code)) {
    return 'Badai petir'
  }

  return 'Berawan'
}

const loadLocationData = async () => {
  if (!activeLocation.value) return

  loadingCondition.value = true
  apiError.value = ''

  try {
    const { latitude, longitude } = activeLocation.value

    const [marine, weather] = await Promise.all([
      getMarineCurrent(latitude, longitude),
      getWeatherCurrent(latitude, longitude)
    ])

    marineData.value = marine
    weatherData.value = weather
  } catch (error) {
    console.error('Gagal mengambil data kondisi laut:', error)

    apiError.value =
      'Data kondisi laut sementara tidak dapat dimuat.'

    marineData.value = null
    weatherData.value = null
  } finally {
    loadingCondition.value = false
  }
}

watch(selectedLocationId, async (newLocationId, oldLocationId) => {
  if (!newLocationId || newLocationId === oldLocationId) {
    return
  }

  await loadLocationData()
})

const loadObservations = async () => {
  try {
    const data = await getObservations()

    observations.value = data.map((item: any) => ({
      id: Number(item.id),
      locationId: Number(item.location_id),
      location: item.location ?? '',
      date: item.observation_date,
      waterCondition: item.water_condition ?? '',
      wasteLevel: item.waste_level ?? '',
      marineLife: item.marine_life ?? '',
      weatherCondition: item.weather_condition ?? '',
      notes: item.notes ?? ''
    }))

    // ================================
    // WAWASAN AI DASHBOARD
    // Analisis seluruh data observasi
    // ================================

    const observationsForAI: ObservationForAI[] = data.map(
      (item: any) => ({
        id: Number(item.id),
        location: item.location ?? '',
        observation_date: item.observation_date ?? '',
        water_condition: item.water_condition ?? '',
        waste_level: item.waste_level ?? '',
        marine_life: item.marine_life ?? '',
        weather_condition: item.weather_condition ?? '',
        wave_height:
          item.wave_height !== null &&
          item.wave_height !== undefined
            ? Number(item.wave_height)
            : null,
        notes: item.notes ?? ''
      })
    )

    const analysis = analyzeObservations(observationsForAI)

    aiSummary.value = analysis.summary

  } catch (error) {
    console.error(
      'Gagal mengambil observasi dari SQLite:',
      error
    )

    observations.value = []

    aiSummary.value =
      'Belum ada cukup data observasi untuk dianalisis.'
  }
}

const recentObservations = computed(() => {
  if (!selectedLocationId.value) {
    return []
  }

  return observations.value
    .filter(
      observation =>
        observation.locationId === selectedLocationId.value
    )
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 3)
})
const formatObservationDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const loadLocationPreviews = async () => {
  const results: Record<number, LocationPreview> = {}

  await Promise.all(
    locations.value.map(async (location) => {
      try {
        const [marine, weather] = await Promise.all([
          getMarineCurrent(
            location.latitude,
            location.longitude
          ),
          getWeatherCurrent(
            location.latitude,
            location.longitude
          )
        ])

        results[location.id] = {
          temperature:
            marine.seaSurfaceTemperature !== null
              ? `${marine.seaSurfaceTemperature.toFixed(1).replace('.', ',')}°C`
              : '—',

          wave:
            marine.waveHeight !== null
              ? `${marine.waveHeight.toFixed(1).replace('.', ',')} m`
              : '—',

          condition: getWeatherDescription(
            weather.weatherCode
          )
        }
      } catch (error) {
        console.error(
          `Gagal mengambil preview ${location.name}:`,
          error
        )

        results[location.id] = {
          temperature: '—',
          wave: '—',
          condition: 'Tidak tersedia'
        }
      }
    })
  )

  locationPreviews.value = results
}



onMounted(async () => {
  try {
    const data = await getLocations()

    locations.value = data.map((item: any) => ({
      id: Number(item.id),
      name: item.name,
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      description: item.description ?? ''
    }))

    if (locations.value.length > 0) {
      selectedLocationId.value = locations.value[0].id

      await Promise.all([
        loadLocationData(),
        loadLocationPreviews(),
        loadObservations()
      ])
    }
  } catch (error) {
    console.error('Gagal memuat lokasi:', error)

    apiError.value =
      'Gagal memuat daftar lokasi.'
  }
})

const goTo = (path: string) => {
  router.push(path);
};

// ================= GREETING =================

const currentHour = new Date().getHours();

const greeting = computed(() => {
  if (currentHour < 12) {
    return "Selamat pagi";
  }

  if (currentHour < 17) {
    return "Selamat siang";
  }

  return "Selamat malam";
});
</script>

<style scoped>

.empty-observation {
  padding: 24px 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  border: 1px solid #e2edf8;
  border-radius: 16px;

  background: #ffffff;
}

.empty-observation ion-icon {
  width: 28px;
  height: 28px;

  margin-bottom: 8px;

  color: #00b4d8;
}

.empty-observation p {
  margin: 0;

  color: #0a2342;

  font-size: 13px;
  font-weight: 600;
}

.empty-observation span {
  margin-top: 4px;

  color: #5c7a9a;

  font-size: 11px;
}

.empty-observation-button {
  width: 50px;
  height: 50px;

  margin-top: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;

  background: linear-gradient(
    135deg,
    #00B4D8,
    #0A2342
  );

  color: #FFFFFF;

  box-shadow: 0 8px 20px rgba(10, 35, 66, 0.25);

  cursor: pointer;

  transition: transform 0.15s ease;
}

.empty-observation-button:active {
  transform: scale(0.95);
}

.empty-observation-button ion-icon {
  font-size: 26px;
  color: #FFFFFF;
  --ionicon-stroke-width: 32px;
  transform: translateY(3px);

}

/* =====================================================
   GLOBAL / DESKTOP BACKGROUND
   ===================================================== */

:global(html),
:global(body) {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  background: #cbd5e1;
}

/* */

ion-page {
  background: transparent;
}

/* Ionic content */

.sea-content {
  --background: transparent;

  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
}

/* =====================================================
   DESKTOP BACKGROUND
   ===================================================== */

.desktop-background {
  width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;

  background: #cbd5e1;
}

/* =====================================================
   MOBILE APP CONTAINER
   ===================================================== */

.app-container {
  position: relative;

  width: 100%;
  max-width: 430px;

  min-height: 100vh;

  background: #eef4fb;

  overflow-x: hidden;

  padding-bottom: 86px;
}

/* =====================================================
   HEADER
   ===================================================== */

.hero-header {
  padding: 48px 20px 24px;

  background: linear-gradient(160deg, #32830d 0%, #1e6b0e 100%);

  color: white;
}

.header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  margin-bottom: 20px;
}

.greeting {
  margin: 0 0 4px;

  color: #90c4e8;

  font-size: 14px;
  line-height: 1.4;
}

.hero-header h1 {
  margin: 0;

  color: white;

  font-family: "DM Serif Display", Georgia, serif;

  font-size: 26px;
  font-weight: 400;

  line-height: 1.1;
}

/* Profile */

.profile-avatar {
  width: 44px;
  height: 44px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 16px;   /* rounded-2xl */

  background: rgba(0, 180, 216, 0.2);   /* bg-[#00B4D8]/20 */
  border: 1px solid rgba(0, 180, 216, 0.4);   /* border-[#00B4D8]/40 */
}

/* Location */

.active-badge {
  margin-left: 4px;

  padding: 2px 8px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.1);

  color: white;

  font-size: 10px;
}

/* =====================================================
   ACTIVE LOCATION — FIGMA
   ===================================================== */

.active-location-wrapper {
  display: flex;
  align-items: center;
}

.active-location-button {
  display: flex;
  align-items: center;
  gap: 6px;

  margin-left: -8px;
  padding: 6px 8px;

  border: none;
  border-radius: 12px;

  background: transparent;

  color: #90c4e8;

  font-family: inherit;
  font-size: 14px;

  cursor: pointer;

  transition: background 0.15s ease;
}

.active-location-button:active {
  background: rgba(255, 255, 255, 0.12);
}

.active-location-button > ion-icon:first-child {
  width: 18px;
  height: 18px;
}

.location-name {
  font-weight: 500;
}

.active-badge {
  margin-left: 4px;

  padding: 3px 8px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.10);

  color: white;

  font-size: 10px;
  line-height: 1.2;
}

.location-chevron {
  width: 15px;
  height: 15px;

  margin-left: 2px;

  color: #90c4e8;
}

/* =====================================================
   LOCATION PICKER — FIGMA
   ===================================================== */

.location-picker-overlay {
  position: fixed;

  inset: 0;

  z-index: 60;

  width: 100%;
  max-width: 430px;

  margin: 0 auto;

  display: flex;
  align-items: flex-end;

  background: rgba(10, 35, 66, 0.55);

  backdrop-filter: blur(2px);

  -webkit-backdrop-filter: blur(2px);
}

.location-picker-sheet {
  width: 100%;

  box-sizing: border-box;

  padding: 12px 20px 32px;

  border-radius: 28px 28px 0 0;

  background: #eef4fb;

  box-shadow:
    0 -8px 30px rgba(10, 35, 66, 0.15);

  animation: locationSheetUp 0.22s ease-out;
}

@keyframes locationSheetUp {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.location-picker-handle {
  width: 40px;
  height: 4px;

  margin: 0 auto 20px;

  border-radius: 999px;

  background: #c8dcf0;
}

.location-picker-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 12px;

  margin-bottom: 16px;
}

.location-picker-header h2 {
  margin: 0;

  color: #0a2342;

  font-family: "DM Serif Display", Georgia, serif;

  font-size: 22px;
  font-weight: 400;

  line-height: 1.2;
}

.location-picker-header p {
  margin: 5px 0 0;

  color: #5c7a9a;

  font-size: 12px;

  line-height: 1.4;
}

.location-picker-close {
  width: 36px;
  height: 36px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #e2edf8;

  border-radius: 50%;

  background: white;

  color: #5c7a9a;

  cursor: pointer;
}

.location-picker-close ion-icon {
  width: 18px;
  height: 18px;
}

.location-picker-list {
  display: flex;
  flex-direction: column;

  gap: 10px;
}

.location-picker-item {
  width: 100%;

  box-sizing: border-box;

  display: flex;
  align-items: center;

  gap: 12px;

  padding: 14px;

  border: 1px solid #e2edf8;

  border-radius: 16px;

  background: white;

  text-align: left;

  font-family: inherit;

  cursor: pointer;

  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.15s ease;
}

.location-picker-item:active {
  transform: scale(0.985);
}

/* LOKASI YANG SEDANG AKTIF */

.location-picker-item.selected {
  border-color: #00b4d8;

  background: #d4eeff;
}

/* ICON */

.location-picker-icon {
  width: 40px;
  height: 40px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: #eef4fb;

  color: #00b4d8;
}

.location-picker-item.selected
.location-picker-icon {
  background: #00b4d8;

  color: white;
}

.location-picker-icon ion-icon {
  width: 22px;
  height: 22px;
}

/* TEXT */

.location-picker-info {
  min-width: 0;

  flex: 1;

  display: flex;
  flex-direction: column;
}

.location-picker-name {
  color: #0a2342;

  font-size: 14px;
  font-weight: 600;

  line-height: 1.3;
}

.location-picker-detail {
  margin-top: 3px;

  color: #5c7a9a;

  font-size: 12px;

  line-height: 1.4;
}

/* CHECK */

.location-picker-check {
  width: 24px;
  height: 24px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #c8dcf0;

  border-radius: 50%;

  background: transparent;

  color: transparent;
}

.location-picker-item.selected
.location-picker-check {
  border-color: #00b4d8;

  background: #00b4d8;

  color: white;
}

.location-picker-check ion-icon {
  width: 16px;
  height: 16px;
}

/* =====================================================
   WAVE DECORATION
   ===================================================== */

.wave-decoration {
  position: relative;

  height: 32px;

  margin-top: -1px;

  overflow: hidden;

  background: #eef4fb;
}

.wave-decoration svg {
  position: absolute;

  left: 0;
  bottom: 0;

  width: 100%;
  height: 32px;
}

.wave-overlay {
  position: absolute;

  left: 0;
  bottom: 0;

  width: 100%;
  height: 32px;

  background: #eef4fb;

  clip-path: ellipse(110% 100% at 50% 100%);
}

/* =====================================================
   MAIN CONTENT
   ===================================================== */

.main-content {
  padding: 8px 20px 24px;

  display: flex;
  flex-direction: column;

  gap: 16px;
}

/* =====================================================
   GENERAL CARD
   ===================================================== */

.card {
  background: #ffffff;

  border: 1px solid #e2edf8;

  border-radius: 16px;

  box-shadow: 0 2px 6px rgba(10, 35, 66, 0.05);
}

/* =====================================================
   KONDISI LAUT
   ===================================================== */

.condition-card {
  padding: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.card-title {
  color: #0a2342;

  font-size: 14px;
  font-weight: 600;
}

.live-badge {
  padding: 2px 8px;

  border-radius: 999px;

  background: #d4eeff;

  color: #007ea7;

  font-size: 10px;
  font-weight: 500;
}

/* Grid */

.condition-grid {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 12px;
}

/* Item */

.condition-item {
  min-height: 70px;

  display: flex;
  align-items: flex-start;

  gap: 8px;

  padding: 12px;

  border-radius: 12px;

  background: #eef4fb;
}

/* Icon */

.condition-icon {
  width: 20px;
  height: 20px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  font-size: 18px;
}

.wave-icon {
  color: #00b4d8;
}

.temperature-icon {
  color: #ff6b5f;
}

.wind-icon {
  color: #48cae4;
}

.sun-icon {
  color: #f4a261;
}

/* Text */

.condition-item p {
  margin: 0 0 4px;

  color: #5c7a9a;

  font-size: 10px;

  line-height: 1.1;
}

.condition-item strong {
  color: #0a2342;

  font-size: 14px;
  font-weight: 600;
}

/* =====================================================
   WAWASAN AI
   ===================================================== */

.ai-card {
  width: 100%;

  padding: 16px;

  border: 1px solid rgba(0, 180, 216, 0.3);

  border-radius: 16px;

  background: linear-gradient(135deg, #eef4fb 0%, #d4eeff 100%);

  text-align: left;

  cursor: pointer;

  font-family: inherit;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.ai-card:active {
  transform: scale(0.985);
}

.ai-header {
  display: flex;
  align-items: center;

  gap: 8px;

  margin-bottom: 8px;
}

.ai-title {
  display: flex;
  align-items: center;

  gap: 7px;
}

.ai-icon {
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #00b4d8;

  font-size: 18px;
}

.ai-title span {
  color: #007ea7;

  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.5px;
}

.ai-more {
  margin-left: auto;

  color: #00b4d8;

  font-size: 11px;
  font-weight: 500;

  white-space: nowrap;
}

.ai-text {
  margin: 0;

  color: #0a2342;

  font-size: 14px;

  line-height: 1.55;
}

/* =====================================================
   OBSERVASI TERBARU
   ===================================================== */

.observations-section {
  width: 100%;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.section-header h2 {
  margin: 0;

  color: #0a2342;

  font-size: 16px;
  font-weight: 600;
}

.see-all {
  padding: 0;

  border: none;

  background: transparent;

  color: #00b4d8;

  font-family: inherit;

  font-size: 14px;
  font-weight: 500;

  cursor: pointer;
}

/* Observation card */

.observation-card {
  margin-bottom: 12px;

  padding: 16px;

  border: 1px solid #e2edf8;

  border-radius: 16px;

  background: #ffffff;

  box-shadow: 0 2px 6px rgba(10, 35, 66, 0.05);
}

.observation-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 10px;
}

.observation-top h3 {
  margin: 0 0 3px;

  color: #0a2342;

  font-size: 14px;
  font-weight: 600;
}

.observation-top p {
  margin: 0;

  color: #5c7a9a;

  font-size: 12px;
}

/* =====================================================
   WATER BADGES
   ===================================================== */

.water-badge,
.waste-badge {
  display: inline-flex;
  align-items: center;

  padding: 4px 10px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 500;

  white-space: nowrap;
}

/* Water */

.water-badge.clear {
  background: #d4eeff;
  color: #007ea7;
}

.water-badge.cloudy {
  background: #fff3cd;
  color: #8b6914;
}

.water-badge.murky {
  background: #ffe5d9;
  color: #c44b2a;
}

/* Waste */

.waste-badge.none {
  background: #d4eeff;
  color: #007ea7;
}

.waste-badge.low {
  background: #d4f5e9;
  color: #1a7a52;
}

.waste-badge.medium {
  background: #fff3cd;
  color: #8b6914;
}

/* =====================================================
   BOTTOM NAVIGATION
   ===================================================== */

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  width: 430px;
  max-width: 100vw;
  height: calc(68px + env(safe-area-inset-bottom));
  transform: translateX(-50%);
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  padding:
    9px
    8px
    calc(13px + env(safe-area-inset-bottom));
  background: #FFFFFF;
  border-top: 1px solid #C8DCF0;
  box-shadow: 0 -4px 24px rgba(10, 35, 66, 0.07);
  z-index: 30;
  box-sizing: border-box;
}

.nav-item {
  min-width: 56px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 4px;

  padding: 0;
  

  border: none;

  background: transparent;

  color: #5c7a9a;

  font-family: inherit;

  cursor: pointer;
}

.nav-item ion-icon {
  width: 22px;
  height: 22px;

  font-size: 22px;
}

.nav-item span {
  font-size: 11px;
  font-weight: 400;
}

.nav-item.active {
  color: #00b4d8;
}

.nav-item.active span {
  font-weight: 600;
}

/* =====================================================
   RESPONSIVE
   ===================================================== */

/* HP kecil */

@media (max-width: 360px) {
  .hero-header {
    padding-left: 16px;
    padding-right: 16px;
  }

  .main-content {
    padding-left: 16px;
    padding-right: 16px;
  }

  .condition-item {
    padding: 10px;
  }

  .condition-item p {
    font-size: 9px;
  }

  .condition-item strong {
    font-size: 13px;
  }

  .ai-more {
    font-size: 10px;
  }
}

/* Desktop */
@media (min-width: 431px) {
  .app-container {
    min-height: 100vh;

    box-shadow: 0 0 30px rgba(10, 35, 66, 0.1);
  }
}
</style>