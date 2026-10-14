<template>
  <ion-page>

    <ion-content :fullscreen="true">

      <div class="page-shell">

        <!-- =========================
             HEADER
        ========================== -->
        <header class="top-bar">

          <div class="top-spacer"></div>

          <h1>Statistik</h1>

          <div class="top-spacer"></div>

        </header>


        <!-- =========================
             CONTENT
        ========================== -->
        <main class="statistics-content">

          <!-- LOADING -->
          <div
            v-if="loading"
            class="loading-state"
          >
            <div class="loading-circle"></div>

            <p>
              Menghitung statistik...
            </p>
          </div>


          <template v-else>

            <!-- =========================
                 RINGKASAN
            ========================== -->
            <section class="summary-grid">

              <div class="summary-card">

                <p>Total Observasi</p>

                <strong>
                  {{ totalObservations }}
                </strong>

                <span>
                  30 hari terakhir
                </span>

              </div>


              <div class="summary-card">

                <p>Lokasi</p>

                <strong>
                  {{ totalLocations }}
                </strong>

                <span>
                  Dipantau
                </span>

              </div>


              <div class="summary-card">

                <p>Paling Sering</p>

                <strong class="small-value">
                  {{ mostCommonWater }}
                </strong>

                <span>
                  Kondisi air
                </span>

              </div>


              <div class="summary-card">

                <p>Rata-rata Gelombang</p>

                <strong>
                  {{ averageWave }}
                </strong>

                <span>
                  Data API
                </span>

              </div>

            </section>


            <!-- =========================
                 DISTRIBUSI SAMPAH
            ========================== -->
            <section class="stat-card">

              <h2>
                Distribusi Tingkat Sampah
              </h2>


              <div class="waste-chart">

                <!-- DONUT -->
                <div class="donut-wrapper">

                  <div
                    class="donut"
                    :style="donutStyle"
                  >
                    <div class="donut-center">

                      <strong>
                        {{ totalObservations }}
                      </strong>

                      <span>
                        observasi
                      </span>

                    </div>
                  </div>

                </div>


                <!-- LEGEND -->
                <div class="waste-legend">

                  <div
                    v-for="item in wasteDistribution"
                    :key="item.level"
                    class="legend-item"
                  >

                    <div class="legend-name">

                      <span
                        class="legend-dot"
                        :style="{
                          background: item.color
                        }"
                      ></span>

                      <span>
                        {{ item.level }}
                      </span>

                    </div>

                    <strong>
                      {{ item.count }}
                    </strong>

                  </div>

                </div>

              </div>

            </section>


            <!-- =========================
                 OBSERVASI PER LOKASI
            ========================== -->
            <section class="stat-card">

              <h2>
                Observasi per Lokasi
              </h2>


              <div class="location-bars">

                <div
                  v-for="item in locationFrequency"
                  :key="item.name"
                  class="bar-row"
                >

                  <div class="bar-label">
                    {{ item.name }}
                  </div>

                  <div class="bar-track">

                    <div
                      class="bar-fill"
                      :style="{
                        width:
                          `${item.percent}%`
                      }"
                    ></div>

                  </div>

                  <strong>
                    {{ item.count }}
                  </strong>

                </div>


                <p
                  v-if="locationFrequency.length === 0"
                  class="no-data"
                >
                  Belum ada data observasi.
                </p>

              </div>

            </section>


            <!-- =========================
                 TREN GELOMBANG
            ========================== -->
            <section class="stat-card">

              <div class="section-heading">

                <h2>
                  Tren Tinggi Gelombang
                </h2>

                <span class="api-badge">
                  Live API
                </span>

              </div>


              <div
                v-if="waveData.length === 0"
                class="chart-empty"
              >
                Data gelombang belum tersedia.
              </div>


                            <div
                v-else
                class="wave-chart"
              >

                                <div
                  ref="waveChartScrollRef"
                  class="wave-chart-scroll"
                >

                  <svg
                    :width="chartWidth"
                    :style="{ width: chartWidth + 'px' }"
                    height="150"
                    :viewBox="`0 0 ${chartWidth} 150`"
                    preserveAspectRatio="xMinYMin meet"
                  >

                    <!-- GRID -->
                    <line
                      x1="10"
                      y1="20"
                      :x2="chartWidth - 10"
                      y2="20"
                      class="grid-line"
                    />

                    <line
                      x1="10"
                      y1="60"
                      :x2="chartWidth - 10"
                      y2="60"
                      class="grid-line"
                    />

                    <line
                      x1="10"
                      y1="100"
                      :x2="chartWidth - 10"
                      y2="100"
                      class="grid-line"
                    />

                    <line
                      x1="10"
                      y1="140"
                      :x2="chartWidth - 10"
                      y2="140"
                      class="grid-line"
                    />


                    <!-- AREA -->
                    <path
                      :d="waveAreaPath"
                      class="wave-area"
                    />


                    <!-- LINE -->
                    <polyline
                      :points="wavePoints"
                      class="wave-line"
                    />


                    <!-- DOTS -->
                    <circle
                      v-for="point in wavePointsArray"
                      :key="point.x"
                      :cx="point.x"
                      :cy="point.y"
                      r="3.5"
                      class="wave-dot"
                    />

                  </svg>


                                    <!-- LABEL -->
                  <div
                    class="wave-labels"
                    :style="{ width: `${chartWidth}px` }"
                  >

                    <span
                      v-for="(point, index) in wavePointsArray"
                      :key="`label-${index}`"
                      class="wave-label-item"
                      :style="{ left: `${point.x}px` }"
                    >
                      {{ waveData[index]?.date }}
                    </span>

                  </div>

                </div>


                <!-- SCROLL HINT -->
                <div
                  v-if="waveData.length > 8"
                  class="scroll-hint"
                >
                  Geser untuk melihat lebih banyak
                </div>

              </div>


              <p class="api-source">
                Sumber: Open-Meteo Marine API
              </p>

            </section>


            <!-- =========================
                 KONDISI AIR
            ========================== -->
            <section class="stat-card">

              <h2>
                Kondisi Air
              </h2>


              <div class="water-distribution">

                <div
                  v-for="item in waterDistribution"
                  :key="item.condition"
                  class="water-item"
                >

                  <div class="water-item-header">

                    <span>
                      {{ item.condition }}
                    </span>

                    <strong>
                      {{ item.count }}
                    </strong>

                  </div>


                  <div class="water-track">

                    <div
                      class="water-fill"
                      :class="
                        getWaterClass(
                          item.condition
                        )
                      "
                      :style="{
                        width:
                          `${item.percent}%`
                      }"
                    ></div>

                  </div>

                </div>

              </div>

            </section>


            <!-- =========================
                 CTA AI
            ========================== -->
            <button
              class="ai-card"
              @click="goToAI"
            >

              <div class="ai-icon">
                ✦
              </div>

              <div class="ai-content">

                <span>
                  Analisis AI
                </span>

                <p>
                  Dapatkan wawasan berbasis AI
                  dari data observasi Anda
                </p>

                <div class="ai-button">
                  Analisis Observasi Saya
                  <span>→</span>
                </div>

              </div>

            </button>

          </template>

        </main>


        <!-- =========================
             BOTTOM NAV
        ========================== -->
        <nav class="bottom-nav">

          <button
            class="nav-item"
            @click="goTo('/home')"
          >
            <ion-icon :icon="homeOutline"></ion-icon>
            <span>Beranda</span>
          </button>


          <button
            class="nav-item"
            @click="goTo('/observations')"
          >
            <ion-icon :icon="clipboardOutline"></ion-icon>
            <span>Observasi</span>
          </button>


          <button
            class="nav-item"
            @click="goTo('/locations')"
          >
            <ion-icon :icon="locationOutline"></ion-icon>
            <span>Lokasi</span>
          </button>


          <button
            class="nav-item active"
          >
            <ion-icon :icon="barChartOutline"></ion-icon>
            <span>Statistik</span>
          </button>

        </nav>

      </div>

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import {
  ref,
  computed,
  nextTick
} from 'vue'

import {
  useRouter
} from 'vue-router'

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

import {
  getLocations,
  getObservations
} from '../data/database'

import {
  getMarineCurrent
} from '../data/marineApi'


// =====================================================
// ROUTER
// =====================================================

const router = useRouter()

const goTo = (path: string) => {
  router.replace(path)
}

const goToAI = () => {
  router.replace('/ai-analysis')
}


// =====================================================
// STATE
// =====================================================

const loading = ref(true)

const locations = ref<any[]>([])

const observations = ref<any[]>([])


// =====================================================
// LOAD DATABASE
// =====================================================

const loadStatistics = async () => {

  loading.value = true

  try {

    const locationData =
      await getLocations()

    const observationData =
      await getObservations()

    locations.value =
      locationData ?? []

    observations.value =
      observationData ?? []

    await loadWaveData()

  } catch (error) {

    console.error(
      'Gagal memuat statistik:',
      error
    )

  } finally {

    loading.value = false

  }

}


// =====================================================
// TOTAL
// =====================================================

const totalObservations =
  computed(() => {

    return observations.value.length

  })


const totalLocations =
  computed(() => {

    return locations.value.length

  })


// =====================================================
// KONDISI AIR PALING SERING
// =====================================================

const mostCommonWater =
  computed(() => {

    if (
      observations.value.length === 0
    ) {
      return '—'
    }

    const counts: Record<
      string,
      number
    > = {}

    observations.value.forEach(
      observation => {

        const condition =
          observation.water_condition

        counts[condition] =
          (counts[condition] ?? 0) + 1

      }
    )

    const sorted =
      Object.entries(counts)
        .sort(
          (a, b) => b[1] - a[1]
        )

    return sorted[0]?.[0] ?? '—'

  })


// =====================================================
// WASTE DISTRIBUTION
// =====================================================

const wasteColors: Record<
  string,
  string
> = {

  'Tidak Ada': '#00B4D8',

  'Rendah': '#48CAE4',

  'Sedang': '#F4A261',

  'Tinggi': '#E76F51'

}


const wasteDistribution =
  computed(() => {

    const levels = [
      'Tidak Ada',
      'Rendah',
      'Sedang',
      'Tinggi'
    ]

    return levels.map(level => {

      const count =
        observations.value.filter(
          observation =>
            observation.waste_level === level
        ).length

      const percent =
        totalObservations.value > 0
          ? (
              count /
              totalObservations.value
            ) * 100
          : 0

      return {
        level,
        count,
        percent,
        color:
          wasteColors[level]
      }

    })

  })


// =====================================================
// DONUT
// =====================================================

const donutStyle =
  computed(() => {

    const items =
      wasteDistribution.value

    let current = 0

    const parts =
      items.map(item => {

        const start = current

        current += item.percent

        return `${item.color} ${start}% ${current}%`

      })

    if (parts.length === 0) {
      return {
        background:
          '#E2EDF8'
      }
    }

    return {
      background:
        `conic-gradient(${parts.join(', ')})`
    }

  })


// =====================================================
// LOCATION FREQUENCY
// =====================================================

const locationFrequency =
  computed(() => {

    const counts =
      locations.value.map(location => {

        const count =
          observations.value.filter(
            observation =>
              Number(
                observation.location_id
              ) === Number(location.id)
          ).length

        return {
          name: location.name,
          count
        }

      })

    const max =
      Math.max(
        ...counts.map(
          item => item.count
        ),
        1
      )

    return counts
      .sort(
        (a, b) =>
          b.count - a.count
      )
      .map(item => ({
        ...item,
        percent:
          (item.count / max) * 100
      }))

  })


// =====================================================
// WATER DISTRIBUTION
// =====================================================

const waterDistribution =
  computed(() => {

    const conditions = [
      'Jernih',
      'Agak Keruh',
      'Keruh'
    ]

    return conditions.map(
      condition => {

        const count =
          observations.value.filter(
            observation =>
              observation.water_condition ===
              condition
          ).length

        const percent =
          totalObservations.value > 0
            ? (
                count /
                totalObservations.value
              ) * 100
            : 0

        return {
          condition,
          count,
          percent
        }

      }
    )

  })


const getWaterClass = (
  condition: string
) => {

  if (condition === 'Jernih') {
    return 'water-clear'
  }

  if (
    condition === 'Agak Keruh'
  ) {
    return 'water-cloudy'
  }

  return 'water-murky'
}


// =====================================================
// WAVE API
// =====================================================

interface WaveItem {
  date: string
  height: number
}

const waveData =
  ref<WaveItem[]>([])

  const waveChartScrollRef =
  ref<HTMLElement | null>(null)


const averageWave =
  computed(() => {

    if (
      waveData.value.length === 0
    ) {
      return '—'
    }

    const total =
      waveData.value.reduce(
        (sum, item) =>
          sum + item.height,
        0
      )

    return (
      total /
      waveData.value.length
    ).toFixed(2).replace('.', ',')
    + ' m'

  })


const loadWaveData =
  async () => {

    if (
      locations.value.length === 0
    ) {
      return
    }

    try {

      // Gunakan lokasi pertama
      // sebagai titik utama statistik.
      const location =
        locations.value[0]

      const url =
        `https://marine-api.open-meteo.com/v1/marine` +
        `?latitude=${location.latitude}` +
        `&longitude=${location.longitude}` +
        `&daily=wave_height_max` +
        `&past_days=30` +
        `&forecast_days=1` +
        `&timezone=auto`

      const response =
        await fetch(url)

      if (!response.ok) {
        return
      }

      const data =
        await response.json()

            const dates: string[] =
        data?.daily?.time ?? []

      const heights =
        data?.daily?.wave_height_max ?? []

      const items = dates.map(
        (
          date: string,
          index: number
        ) => ({
          rawDate: date,
          date:
            new Date(date)
              .toLocaleDateString(
                'id-ID',
                {
                  day: 'numeric',
                  month: 'short'
                }
              ),
          height:
            heights[index] !== null &&
            heights[index] !== undefined
              ? Number(heights[index])
              : NaN
        })
      )

      let validItems = items.filter(
        (item: any) =>
          Number.isFinite(item.height)
      )

      // ==============================
      // PASTIKAN "HARI INI" SELALU ADA
      // ==============================
      // Kadang API belum punya hasil
      // forecast untuk hari berjalan
      // (nilainya null/kosong), jadi
      // kita lengkapi pakai data live
      // (marine current) sebagai fallback.

      const todayIso =
        new Date().toISOString().slice(0, 10)

      const hasToday =
        validItems.some(
          (item: any) =>
            item.rawDate === todayIso
        )

      if (!hasToday) {
        try {
          const current =
            await getMarineCurrent(
              location.latitude,
              location.longitude
            )

          if (
            current?.waveHeight !== null &&
            current?.waveHeight !== undefined
          ) {
            validItems.push({
              rawDate: todayIso,
              date:
                new Date(todayIso)
                  .toLocaleDateString(
                    'id-ID',
                    {
                      day: 'numeric',
                      month: 'short'
                    }
                  ),
              height:
                Number(current.waveHeight)
            })
          }
        } catch (fallbackError) {
          console.warn(
            'Gagal mengambil data gelombang hari ini:',
            fallbackError
          )
        }
      }

      waveData.value = validItems

      // ==============================
      // GESER TAMPILAN KE PALING KANAN
      // (hari ini) sebagai posisi awal
      // ==============================

      await nextTick()
      await nextTick()

      requestAnimationFrame(() => {
        if (waveChartScrollRef.value) {
          waveChartScrollRef.value.scrollLeft =
            waveChartScrollRef.value.scrollWidth
        }
      })

    } catch (error) {

      console.warn(
        'Gagal mengambil data gelombang:',
        error
      )

    }

  }

//chartWidthh
const chartWidth =
  computed(() => {

    const minimumWidth = 360
    const widthPerPoint = 42

    const calculatedWidth =
      20 + waveData.value.length * widthPerPoint

    return Math.max(
      minimumWidth,
      calculatedWidth
    )

  })


// =====================================================
// SVG WAVE GRAPH
// =====================================================

const wavePointsArray =
  computed(() => {

    const data =
      waveData.value

    if (data.length === 0) {
      return []
    }

    const max =
      Math.max(
        ...data.map(
          item => item.height
        ),
        1
      )

    const min =
      Math.min(
        ...data.map(
          item => item.height
        ),
        0
      )

    const range =
      Math.max(
        max - min,
        0.5
      )

    return data.map(
      (item, index) => {

               const x =
          data.length === 1
            ? chartWidth.value / 2
            : 10 +
              (
                index /
                (data.length - 1)
              ) * (chartWidth.value - 20)

        const y =
          125 -
          (
            (
              item.height -
              min
            ) /
            range
          ) * 100

        return {
          x,
          y
        }

      }
    )

  })


const wavePoints =
  computed(() => {

    return wavePointsArray.value
      .map(
        point =>
          `${point.x},${point.y}`
      )
      .join(' ')

  })


const waveAreaPath =
  computed(() => {

    const points =
      wavePointsArray.value

    if (points.length === 0) {
      return ''
    }

    const first =
      points[0]

    const last =
      points[points.length - 1]

    const line =
      points
        .map(
          point =>
            `${point.x} ${point.y}`
        )
        .join(' L ')

    return `
      M ${first.x} 140
      L ${line}
      L ${last.x} 140
      Z
    `

  })


// =====================================================
// ON MOUNT
// =====================================================

onIonViewWillEnter(async () => {
  await loadStatistics()
})

</script>


<style scoped>

/* =====================================================
   PAGE
===================================================== */

ion-content {
  --background: #CBD5E1;
}

.page-shell {
  width: 100%;
  max-width: 430px;
  min-height: 100vh;

  margin: 0 auto;

  background: #EEF4FB;

  padding-bottom: 86px;
}


/* =====================================================
   HEADER
===================================================== */

.top-bar {
  height: 92px;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  padding: 0 20px 16px;

  background: #EEF4FB;
}

.top-bar h1 {
  margin: 0;

  font-family:
    'DM Serif Display',
    Georgia,
    serif;

  font-size: 18px;

  font-weight: 400;

  color: #0A2342;
}

.top-spacer {
  width: 36px;
}


/* =====================================================
   CONTENT
===================================================== */

.statistics-content {
  padding: 4px 20px 20px;

  display: flex;
  flex-direction: column;

  gap: 14px;
}


/* =====================================================
   SUMMARY
===================================================== */

.summary-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 12px;
}

.summary-card {
  background: white;

  border:
    1px solid #E2EDF8;

  border-radius: 17px;

  padding: 14px;

  box-shadow:
    0 2px 8px
    rgba(10, 35, 66, 0.05);
}

.summary-card p {
  margin: 0 0 5px;

  font-size: 10px;

  color: #5C7A9A;
}

.summary-card strong {
  display: block;

  font-size: 19px;

  line-height: 1.2;

  color: #0A2342;
}

.summary-card .small-value {
  font-size: 15px;
}

.summary-card span {
  display: block;

  margin-top: 3px;

  font-size: 9px;

  color: #5C7A9A;
}


/* =====================================================
   CARD
===================================================== */

.stat-card {
  background: white;

  border:
    1px solid #E2EDF8;

  border-radius: 18px;

  padding: 16px;

  box-shadow:
    0 2px 8px
    rgba(10, 35, 66, 0.05);
}

.stat-card h2 {
  margin: 0 0 14px;

  font-size: 14px;

  font-weight: 600;

  color: #0A2342;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.api-badge {
  background: #D4EEFF;

  color: #007EA7;

  border-radius: 20px;

  padding: 4px 8px;

  font-size: 9px;

  font-weight: 600;
}


/* =====================================================
   DONUT
===================================================== */

.waste-chart {
  display: flex;

  align-items: center;

  gap: 20px;
}

.donut-wrapper {
  flex-shrink: 0;
}

.donut {
  width: 112px;
  height: 112px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-center {
  width: 68px;
  height: 68px;

  border-radius: 50%;

  background: white;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
}

.donut-center strong {
  color: #0A2342;

  font-size: 16px;
}

.donut-center span {
  color: #5C7A9A;

  font-size: 8px;
}


/* =====================================================
   LEGEND
===================================================== */

.waste-legend {
  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 8px;
}

.legend-item {
  display: flex;

  align-items: center;
  justify-content: space-between;

  font-size: 10px;

  color: #5C7A9A;
}

.legend-name {
  display: flex;

  align-items: center;

  gap: 7px;
}

.legend-dot {
  width: 9px;
  height: 9px;

  border-radius: 50%;
}

.legend-item strong {
  color: #0A2342;
}


/* =====================================================
   LOCATION BAR
===================================================== */

.location-bars {
  display: flex;
  flex-direction: column;

  gap: 12px;
}

.bar-row {
  display: grid;

  grid-template-columns:
    82px 1fr 20px;

  gap: 8px;

  align-items: center;
}

.bar-label {
  color: #5C7A9A;

  font-size: 9px;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
}

.bar-track {
  height: 9px;

  background: #EEF4FB;

  border-radius: 20px;

  overflow: hidden;
}

.bar-fill {
  height: 100%;

  background:
    linear-gradient(
      90deg,
      #00B4D8,
      #48CAE4
    );

  border-radius: 20px;

  transition: width 0.4s ease;
}

.bar-row strong {
  color: #0A2342;

  font-size: 10px;

  text-align: right;
}


/* =====================================================
   WAVE CHART
===================================================== */

.wave-chart {
  width: 100%;
}

.wave-chart-scroll {
  width: 100%;

  overflow-x: auto;
  overflow-y: hidden;

  -webkit-overflow-scrolling: touch;

  scrollbar-width: thin;

  padding-bottom: 4px;
}

.wave-chart-scroll::-webkit-scrollbar {
  height: 5px;
}

.wave-chart-scroll::-webkit-scrollbar-thumb {
  background: #B8D6EA;
  border-radius: 999px;
}

.wave-chart svg {
  display: block;

  height: 145px;

  max-width: none !important;

  flex-shrink: 0;

  overflow: visible;
}

.scroll-hint {
  margin-top: 6px;

  text-align: center;

  color: #7A94AE;

  font-size: 9px;
}

.grid-line {
  stroke: #E2EDF8;

  stroke-width: 1;

  stroke-dasharray: 3 3;
}

.wave-area {
  fill: rgba(0, 180, 216, 0.10);
}

.wave-line {
  fill: none;

  stroke: #00B4D8;

  stroke-width: 2.5;

  stroke-linecap: round;

  stroke-linejoin: round;
}

.wave-dot {
  fill: #00B4D8;

  stroke: white;

  stroke-width: 2;
}

.wave-labels {
  position: relative;

  height: 16px;

  margin-top: 4px;
}

.wave-label-item {
  position: absolute;

  top: 0;

  transform: translateX(-50%);

  color: #5C7A9A;

  font-size: 8px;

  white-space: nowrap;
}

.api-source {
  margin: 10px 0 0;

  color: #5C7A9A;

  font-size: 8px;
}


/* =====================================================
   WATER DISTRIBUTION
===================================================== */

.water-distribution {
  display: flex;
  flex-direction: column;

  gap: 12px;
}

.water-item-header {
  display: flex;

  justify-content: space-between;

  margin-bottom: 5px;

  font-size: 10px;

  color: #5C7A9A;
}

.water-item-header strong {
  color: #0A2342;
}

.water-track {
  height: 7px;

  background: #EEF4FB;

  border-radius: 20px;

  overflow: hidden;
}

.water-fill {
  height: 100%;

  border-radius: 20px;
}

.water-clear {
  background: #00B4D8;
}

.water-cloudy {
  background: #F4A261;
}

.water-murky {
  background: #E76F51;
}


/* =====================================================
   AI CARD
===================================================== */

.ai-card {
  width: 100%;

  border: none;

  border-radius: 18px;

  padding: 16px;

  display: flex;

  gap: 12px;

  text-align: left;

  background:
    linear-gradient(
      135deg,
      #0A2342 0%,
      #0E3A6B 100%
    );
}

.ai-icon {
  width: 34px;
  height: 34px;

  flex-shrink: 0;

  border-radius: 50%;

  background:
    rgba(0, 180, 216, 0.18);

  color: #00B4D8;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
}

.ai-content {
  flex: 1;
}

.ai-content > span {
  color: #00B4D8;

  font-size: 10px;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 0.08em;
}

.ai-content p {
  margin: 5px 0 12px;

  color: white;

  font-size: 12px;

  line-height: 1.5;
}

.ai-button {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 8px 12px;

  background: #00B4D8;

  border-radius: 10px;

  color: white;

  font-size: 10px;

  font-weight: 600;
}


/* =====================================================
   BOTTOM NAV
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
  align-items: center;                 /* ← ubah dari flex-start */
  justify-content: space-around;
  padding: 9px 8px calc(13px + env(safe-area-inset-bottom));
  background: #FFFFFF;
  border-top: 1px solid #C8DCF0;
  box-shadow: 0 -4px 24px rgba(10, 35, 66, 0.07);
  z-index: 30;
  box-sizing: border-box;
}

.nav-item {
  border: none;

  background: transparent;

  min-width: 56px;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 4px;

  color: #5C7A9A;

  font-size: 11px;
}

.nav-item ion-icon {
  font-size: 22px;
}

.nav-item.active {
  color: #00B4D8;
}


/* =====================================================
   LOADING
===================================================== */

.loading-state {
  min-height: 400px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  color: #5C7A9A;
}

.loading-circle {
  width: 28px;
  height: 28px;

  border: 3px solid #D4EEFF;

  border-top-color: #00B4D8;

  border-radius: 50%;

  animation:
    spin 0.8s linear infinite;

  margin-bottom: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.chart-empty,
.no-data {
  text-align: center;

  color: #5C7A9A;

  font-size: 11px;

  padding: 20px 0;
}

</style>