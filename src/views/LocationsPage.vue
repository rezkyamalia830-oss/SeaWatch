<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <main class="page-container">

        <!-- HEADER -->
        <div class="top-bar">
          <div class="top-bar-side"></div>

          <h1>Lokasi</h1>

          <div class="top-bar-side"></div>
        </div>

        <!-- DAFTAR LOKASI -->
        <div class="content">

          <div
            v-if="locations.length === 0"
            class="empty-state"
          >
            <div class="empty-icon">
              <ion-icon :icon="locationOutline" />
            </div>

            <h2>Belum Ada Lokasi</h2>

            <p>
              Tambahkan lokasi melalui halaman
              Tambah Observasi.
            </p>
          </div>

          <div
            v-for="location in locations"
            :key="location.id"
            class="location-card"
            @click="openLocation(location)"
          >

            <!-- MAP PREVIEW -->
            <div class="map-preview">

              <div class="map-rings">
                <span
                  v-for="index in 5"
                  :key="index"
                  :style="{
                    width: `${60 + index * 30}px`,
                    height: `${60 + index * 30}px`
                  }"
                ></span>
              </div>

              <div class="location-marker">
                <div></div>
              </div>

              <div class="coordinates">
                {{ Number(location.latitude).toFixed(4) }},
                {{ Number(location.longitude).toFixed(4) }}
              </div>

            </div>

            <!-- INFO LOKASI -->
            <div class="location-info">

              <div>
                <h2>{{ location.name }}</h2>

                <p>
                  {{ location.observationCount }}
                  observasi tercatat
                </p>
              </div>

              <div class="location-status">

                <div class="condition">
                  <span
                    class="condition-dot"
                    :class="getConditionClass(location.condition)"
                  ></span>

                  <span>
                    {{ location.condition }}
                  </span>
                </div>

                <span class="temperature">
                  {{ location.temperature }}
                </span>

              </div>

            </div>

          </div>

        </div>

      </main>
    </ion-content>

    <!-- ========================================
         BOTTOM NAV
         Sengaja diletakkan DI LUAR ion-content
         (sejajar/sibling), supaya benar-benar
         "fixed" ke layar dan tidak ikut ter-scroll
         bersama konten di dalam ion-content.
    ========================================= -->
    <nav class="bottom-nav">

      <!-- BERANDA -->
      <button
        type="button"
        class="nav-item"
        @click="router.push('/home')"
      >
        <ion-icon :icon="homeOutline" />
        <span>Beranda</span>
      </button>

      <!-- OBSERVASI -->
      <button
        type="button"
        class="nav-item"
        @click="router.push('/observations')"
      >
        <ion-icon :icon="clipboardOutline" />
        <span>Observasi</span>
      </button>

      <!-- LOKASI (aktif) -->
      <button
        type="button"
        class="nav-item active"
        @click="router.push('/locations')"
      >
        <ion-icon :icon="locationOutline" />
        <span>Lokasi</span>
      </button>

      <!-- STATISTIK -->
      <button
        type="button"
        class="nav-item"
        @click="router.push('/statistics')"
      >
        <ion-icon :icon="barChartOutline" />
        <span>Statistik</span>
      </button>

    </nav>

  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  IonPage,
  IonContent,
  IonIcon,
  onIonViewWillEnter
} from '@ionic/vue'

import {
  homeOutline,
  clipboardOutline,
  locationOutline,
  barChartOutline
} from 'ionicons/icons'

import { getLocations, getObservations } from '../data/database'

import {
  getMarineCurrent
} from '../data/marineApi'

const router = useRouter()

interface Location {
  id: number
  name: string
  latitude: number
  longitude: number
  description: string
  observationCount: number
  condition: string
  temperature: string
}

const locations = ref<Location[]>([])

const loadLocations = async () => {
  try {
    const locationData = await getLocations()
    const observationData = await getObservations()

    locations.value = await Promise.all(
      locationData.map(async (location: any) => {

        const locationObservations = observationData.filter(
          (observation: any) =>
            Number(observation.location_id) === Number(location.id)
        )

        // getObservations() sudah diurutkan
        // dari tanggal terbaru ke terlama
        const latestObservation = locationObservations[0]

        // =========================
        // KONDISI TERBARU
        // =========================

        let condition = 'Belum ada data'

        if (latestObservation) {
          const waterCondition =
            latestObservation.water_condition

          if (waterCondition === 'Jernih') {
            condition = 'Baik'
          } else if (waterCondition === 'Agak Keruh') {
            condition = 'Sedang'
          } else if (waterCondition === 'Keruh') {
            condition = 'Buruk'
          }
        }

        // =========================
        // SUHU LAUT DARI API
        // =========================

        let temperature = '—'

        try {
          const marineData = await getMarineCurrent(
            Number(location.latitude),
            Number(location.longitude)
          )

          if (marineData.seaSurfaceTemperature !== null) {
            temperature =
              `${marineData.seaSurfaceTemperature.toFixed(1)} °C`
          }

        } catch (error) {
          console.error(
            `Gagal mengambil suhu laut untuk ${location.name}:`,
            error
          )

          temperature = '—'
        }

        return {
          id: Number(location.id),
          name: location.name,
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
          description: location.description ?? '',

          // Data dari SQLite
          observationCount: locationObservations.length,
          condition,

          // Data dari Marine API
          temperature
        }
      })
    )

  } catch (error) {
    console.error(
      'Gagal memuat lokasi:',
      error
    )

    alert('Gagal memuat data lokasi.')
  }
}

const openLocation = (location: Location) => {
  router.push({
    path: '/location-detail',
    query: {
      id: String(location.id)
    }
  })
}

const getConditionClass = (condition: string) => {
  if (condition === 'Baik') return 'good'
  if (condition === 'Sedang') return 'medium'
  if (condition === 'Buruk') return 'bad'

  return 'unknown'
}

onIonViewWillEnter(async () => {
  await loadLocations()
})
</script>

<style scoped>
.page-container {
  min-height: 100%;
  background: #EEF4FB;
  padding-bottom: calc(68px + env(safe-area-inset-bottom, 0px) + 16px);
}

/* HEADER */

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 48px 20px 16px;

  background: #EEF4FB;
}

.top-bar h1 {
  margin: 0;

  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 20px;
  font-weight: 400;

  color: #0A2342;
}

.top-bar-side {
  width: 36px;
}

/* CONTENT */

.content {
  padding: 4px 20px 20px;
}

/* LOCATION CARD */

.location-card {
  background: #FFFFFF;

  border: 1px solid #E2EDF8;
  border-radius: 16px;

  padding: 14px;

  margin-bottom: 14px;

  box-shadow:
    0 3px 12px rgba(10, 35, 66, 0.05);

  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.location-card:active {
  transform: scale(0.98);
}

/* MAP */

.map-preview {
  position: relative;

  width: 100%;
  height: 112px;

  border-radius: 12px;

  overflow: hidden;

  margin-bottom: 13px;

  background:
    linear-gradient(
      135deg,
      #D4EEFF 0%,
      #90C4E8 50%,
      #0A2342 100%
    );
}

.map-rings {
  position: absolute;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 0.22;
}

.map-rings span {
  position: absolute;

  border-radius: 50%;

  border: 1px solid #00B4D8;
}

.location-marker {
  position: absolute;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}

.location-marker::before {
  content: '';

  width: 26px;
  height: 26px;

  border-radius: 50%;

  background: #00B4D8;

  border: 2px solid white;

  box-shadow:
    0 3px 10px rgba(0, 0, 0, 0.2);
}

.location-marker div {
  position: absolute;

  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: white;
}

.coordinates {
  position: absolute;

  right: 8px;
  bottom: 8px;

  padding: 4px 7px;

  border-radius: 5px;

  background: rgba(0, 0, 0, 0.4);

  color: white;

  font-family: monospace;

  font-size: 9px;
}

/* INFO */

.location-info {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 12px;
}

.location-info h2 {
  margin: 0;

  color: #0A2342;

  font-size: 15px;
  font-weight: 600;
}

.location-info p {
  margin: 4px 0 0;

  color: #5C7A9A;

  font-size: 11px;
}

.location-status {
  text-align: right;
  flex-shrink: 0;
}

.condition {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  margin-bottom: 5px;

  color: #0A2342;

  font-size: 11px;
  font-weight: 500;
}

.condition-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  margin-right: 6px;
}

.condition-dot.good {
  background: #22C55E;
}

.condition-dot.medium {
  background: #F59E0B;
}

.condition-dot.bad {
  background: #EF4444;
}

.condition-dot.unknown {
  background: #94A3B8;
}

.temperature {
  color: #5C7A9A;

  font-size: 10px;
}

/* EMPTY */

.empty-state {
  text-align: center;

  padding: 60px 20px;
}

.empty-icon {
  width: 58px;
  height: 58px;

  margin: 0 auto 15px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #D4EEFF;

  color: #00B4D8;

  font-size: 28px;
}

.empty-state h2 {
  margin: 0 0 6px;

  color: #0A2342;

  font-size: 16px;
}

.empty-state p {
  margin: 0;

  color: #5C7A9A;

  font-size: 12px;

  line-height: 1.5;
}

/* ==========================================
   BOTTOM NAVIGATION (sama persis dengan
   halaman Observasi & Beranda)
========================================== */

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;

  width: 430px;
  max-width: 100vw;
  height: calc(68px + env(safe-area-inset-bottom, 0px));

  transform: translateX(-50%);

  display: flex;
  align-items: center;
  justify-content: space-around;

  padding: 9px 8px calc(13px + env(safe-area-inset-bottom, 0px));

  background: #FFFFFF;
  border-top: 1px solid #C8DCF0;

  box-shadow:
    0 -4px 24px rgba(10, 35, 66, 0.07);

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

  color: #5C7A9A;

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
  color: #00B4D8;
}

.nav-item.active span {
  font-weight: 600;
}
</style>
