<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="history-page">

        <!-- =========================
             TOP BAR
        ========================== -->
        <div class="top-bar">

          <button
            type="button"
            class="back-button"
            @click="goBack"
          >
            ‹
          </button>

          <h1>Riwayat</h1>

        </div>


        <div class="content-area">

          <!-- =========================
               FILTER CARD
          ========================== -->
          <div class="filter-card">

            <!-- Lokasi -->
            <div class="filter-column">
              <p class="filter-label">
                Lokasi
              </p>

              <p class="filter-value">
                {{ locationName }}
              </p>
            </div>


            <!-- Periode -->
            <button
              type="button"
              class="period-button"
              @click="openPeriodPicker"
            >

              <div class="period-content">

                <p class="filter-label">
                  Periode
                </p>

                <p class="filter-value">
                  {{ selectedPeriodLabel }}
                </p>

              </div>

              <span
                class="period-chevron"
                :class="{
                  open: isPeriodPickerOpen
                }"
              >
                ⌄
              </span>

            </button>

          </div>


          <!-- =========================
               GRAPH CARD
          ========================== -->
          <div class="chart-card">

            <p class="section-title">
              Tinggi Gelombang dari Waktu ke Waktu
            </p>


            <!-- Tidak ada data -->
            <div
              v-if="waveData.length === 0"
              class="empty-chart"
            >
              <p>
                Belum ada data tinggi gelombang
                pada periode ini.
              </p>
            </div>


            <!-- Ada data -->
            <template v-else>

              <div
                ref="chartScrollRef"
                class="chart-scroll"
              >

                <svg
                  class="wave-chart"
                  :width="chartWidth"
                  height="160"
                  :viewBox="`0 0 ${chartWidth} 160`"
                  preserveAspectRatio="xMinYMin meet"
                >

                  <!-- GRID -->
                  <line
                    v-for="line in gridLines"
                    :key="`grid-${line.y}`"
                    x1="45"
                    :y1="line.y"
                    :x2="chartWidth - 20"
                    :y2="line.y"
                    class="grid-line"
                  />


                  <!-- Y AXIS LABEL -->
                  <text
                    v-for="line in gridLines"
                    :key="`label-${line.y}`"
                    x="3"
                    :y="line.y + 4"
                    class="y-label"
                  >
                    {{ line.label }}
                  </text>


                  <!-- LINE -->
                  <polyline
                    v-if="wavePoints.length > 1"
                    :points="wavePointsString"
                    fill="none"
                    class="wave-line"
                  />


                  <!-- POINT -->
                  <circle
                    v-for="point in wavePoints"
                    :key="point.id"
                    :cx="point.x"
                    :cy="point.y"
                    r="4"
                    class="wave-point"
                  />


                  <!-- X AXIS LABEL -->
                  <text
                    v-for="point in visibleXAxisLabels"
                    :key="`x-${point.id}`"
                    :x="point.x"
                    y="151"
                    text-anchor="middle"
                    class="x-label"
                  >
                    {{ point.label }}
                  </text>

                </svg>

              </div>


              <!-- Scroll hint -->
              <div
                v-if="waveData.length > 5"
                class="scroll-hint"
              >
                Geser grafik ke samping untuk
                melihat data lainnya →
              </div>

            </template>

          </div>


          <!-- =========================
               TIMELINE
          ========================== -->
          <div class="timeline-section">

            <p class="section-title timeline-title">
              Linimasa Observasi
            </p>


            <!-- Tidak ada observasi -->
            <div
              v-if="filteredObservations.length === 0"
              class="empty-timeline"
            >
              Belum ada observasi pada
              periode ini.
            </div>


            <!-- Ada observasi -->
            <div
              v-else
              class="timeline"
            >

              <!-- Garis timeline -->
              <div class="timeline-line"></div>


              <div
                v-for="observation in filteredObservations"
                :key="observation.id"
                class="timeline-item"
              >

                <!-- Titik -->
                <div class="timeline-dot"></div>


                <!-- Observation card -->
                <div class="observation-card">

                  <div class="observation-header">

                    <span class="observation-date">
                      {{
                        formatDateShort(
                          observation.observation_date
                        )
                      }}
                    </span>


                    <span
                      class="water-badge"
                      :class="
                        getWaterClass(
                          observation.water_condition
                        )
                      "
                    >
                      {{ observation.water_condition }}
                    </span>

                  </div>


                  <p class="observation-location">
                    {{ observation.location }}
                  </p>


                  <div class="observation-meta">

                    <span
                      class="waste-badge"
                      :class="
                        getWasteClass(
                          observation.waste_level
                        )
                      "
                    >
                      Sampah:
                      {{ observation.waste_level }}
                    </span>


                    <span
                      v-if="
                        observation.wave_height !== null &&
                        observation.wave_height !== undefined
                      "
                      class="wave-badge"
                    >
                      🌊
                      {{
                        Number(
                          observation.wave_height
                        ).toFixed(1)
                      }}
                      m
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        <!-- =================================================
             PERIOD BOTTOM SHEET
        ================================================== -->
        <div
          v-if="isPeriodPickerOpen"
          class="sheet-overlay"
          @click="closePeriodPicker"
        >

          <div
            class="period-sheet"
            @click.stop
          >

            <!-- Handle -->
            <div class="sheet-handle"></div>


            <!-- Header -->
            <div class="sheet-header">

              <h2>
                Pilih Periode
              </h2>

              <button
                type="button"
                class="close-sheet"
                @click="closePeriodPicker"
              >
                ×
              </button>

            </div>


            <!-- Period list -->
            <div
              v-if="availablePeriods.length > 0"
              class="period-options"
            >

              <button
                v-for="period in availablePeriods"
                :key="period.value"
                type="button"
                class="period-option"
                :class="{
                  selected:
                    selectedPeriod ===
                    period.value
                }"
                @click="
                  selectPeriod(period.value)
                "
              >

                <div class="period-option-left">

                  <span
                    class="radio-circle"
                    :class="{
                      selected:
                        selectedPeriod ===
                        period.value
                    }"
                  >

                    <span
                      v-if="
                        selectedPeriod ===
                        period.value
                      "
                      class="radio-dot"
                    ></span>

                  </span>


                  <span>
                    {{ period.label }}
                  </span>

                </div>


                <span
                  v-if="
                    selectedPeriod ===
                    period.value
                  "
                  class="check-icon"
                >
                  ✓
                </span>

              </button>

            </div>


            <div
              v-else
              class="empty-period"
            >
              Belum ada periode observasi.
            </div>

          </div>

        </div>

      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import {
  computed,
  onMounted,
  ref
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import {
  getLocations,
  getObservations
} from '../data/database'


/* =====================================================
   ROUTER
===================================================== */

const route = useRoute()
const router = useRouter()


/* =====================================================
   TYPES
===================================================== */

interface LocationData {
  id: number
  name: string
  latitude: number
  longitude: number
  description?: string
}


interface Observation {
  id: number
  location_id: number
  location: string
  observation_date: string
  water_condition: string
  waste_level: string
  marine_life: string
  weather_condition: string
  wave_height: number | null
  notes: string
}


interface PeriodOption {
  value: string
  label: string
}


/* =====================================================
   STATE
===================================================== */

const locationName = ref('Lokasi')

const observations =
  ref<Observation[]>([])

const selectedPeriod =
  ref('')

const isPeriodPickerOpen =
  ref(false)

const chartScrollRef =
  ref<HTMLElement | null>(null)


/* =====================================================
   LOCATION ID
===================================================== */

const locationId = computed(() => {

  return Number(
    route.query.locationId
  )

})


/* =====================================================
   LOAD HISTORY
===================================================== */

const loadHistory = async () => {

  try {

    /*
      Ambil semua lokasi
    */

    const locations =
      await getLocations()


    /*
      Cari lokasi yang sedang
      dibuka.
    */

    const selectedLocation =
      locations.find(
        (location: LocationData) =>
          Number(location.id) ===
          locationId.value
      )


    if (selectedLocation) {

      locationName.value =
        selectedLocation.name

    }


    /*
      Ambil semua observasi
    */

    const data =
      await getObservations()


    /*
      Ambil observasi khusus
      lokasi ini.
    */

    observations.value =
      data
        .map((item: any) => ({
          id: Number(item.id),

          location_id:
            Number(item.location_id),

          location:
            item.location ?? '',

          observation_date:
            item.observation_date,

          water_condition:
            item.water_condition ?? '',

          waste_level:
            item.waste_level ?? '',

          marine_life:
            item.marine_life ?? '',

          weather_condition:
            item.weather_condition ?? '',

          wave_height:
            item.wave_height !== null &&
            item.wave_height !== undefined
              ? Number(item.wave_height)
              : null,

          notes:
            item.notes ?? ''
        }))
        .filter(
          (item: Observation) =>
            item.location_id ===
            locationId.value
        )
        .sort(
          (
            a: Observation,
            b: Observation
          ) =>
            new Date(
              a.observation_date
            ).getTime() -
            new Date(
              b.observation_date
            ).getTime()
        )


    /*
      Setelah data selesai dimuat,
      tentukan periode terbaru
      sebagai pilihan awal.
    */

    if (
      availablePeriods.value.length > 0
    ) {

      selectedPeriod.value =
        availablePeriods.value[0].value

    }

  } catch (error) {

    console.error(
      'Gagal memuat riwayat:',
      error
    )

  }

}


/* =====================================================
   AVAILABLE PERIODS
===================================================== */

/*
  Membuat daftar periode berdasarkan
  data observasi yang benar-benar ada.

  Contoh:

  2024-09-10
  2024-09-11
  2024-12-03
  2025-02-10

  menjadi:

  September 2024
  Desember 2024
  Februari 2025
*/

const availablePeriods =
  computed<PeriodOption[]>(() => {

    const periodMap =
      new Map<string, string>()


    for (
      const observation
      of observations.value
    ) {

      if (
        !observation.observation_date
      ) {
        continue
      }


      /*
        Ambil YYYY-MM dari
        tanggal observasi.
      */

      const value =
        observation.observation_date
          .slice(0, 7)


      if (
        !value ||
        value.length !== 7
      ) {
        continue
      }


      const [year, month] =
        value.split('-')


      /*
        Ubah menjadi nama bulan
        Bahasa Indonesia.
      */

      const date =
        new Date(
          Number(year),
          Number(month) - 1,
          1
        )


      const label =
        date.toLocaleDateString(
          'id-ID',
          {
            month: 'long',
            year: 'numeric'
          }
        )


      periodMap.set(
        value,
        label
      )

    }


    /*
      Urutkan terbaru → terlama.
    */

    return Array.from(
      periodMap.entries()
    )
      .sort(
        ([a], [b]) =>
          b.localeCompare(a)
      )
      .map(
        ([value, label]) => ({
          value,
          label:
            label.charAt(0)
              .toUpperCase() +
            label.slice(1)
        })
      )

  })


/* =====================================================
   SELECTED PERIOD LABEL
===================================================== */

const selectedPeriodLabel =
  computed(() => {

    const selected =
      availablePeriods.value.find(
        period =>
          period.value ===
          selectedPeriod.value
      )


    return (
      selected?.label ??
      'Pilih periode'
    )

  })


/* =====================================================
   FILTER OBSERVATIONS
===================================================== */

const filteredObservations =
  computed(() => {

    if (
      !selectedPeriod.value
    ) {
      return []
    }


    /*
      Contoh:

      selectedPeriod =
      "2024-09"

      Maka hanya:
      2024-09-01
      sampai
      2024-09-30
    */

    return observations.value
      .filter(
        observation =>
          observation
            .observation_date
            .slice(0, 7) ===
          selectedPeriod.value
      )
      .sort(
        (
          a,
          b
        ) =>
          new Date(
            b.observation_date
          ).getTime() -
          new Date(
            a.observation_date
          ).getTime()
      )

  })


/* =====================================================
   OPEN PERIOD PICKER
===================================================== */

const openPeriodPicker = () => {

  isPeriodPickerOpen.value =
    true

}


/* =====================================================
   CLOSE PERIOD PICKER
===================================================== */

const closePeriodPicker = () => {

  isPeriodPickerOpen.value =
    false

}


/* =====================================================
   SELECT PERIOD
===================================================== */

const selectPeriod = (
  value: string
) => {

  selectedPeriod.value =
    value

  isPeriodPickerOpen.value =
    false


  /*
    Setelah ganti periode,
    kembalikan posisi grafik
    ke paling kiri.
  */

  setTimeout(() => {

    if (
      chartScrollRef.value
    ) {

      chartScrollRef.value
        .scrollTo({
          left: 0,
          behavior: 'smooth'
        })

    }

  }, 50)

}


/* =====================================================
   WAVE DATA
===================================================== */

const waveData = computed(() => {

  return [
    ...filteredObservations.value
  ]
    .filter(
      item =>
        item.wave_height !== null &&
        item.wave_height !== undefined
    )
    .sort(
      (
        a,
        b
      ) =>
        new Date(
          a.observation_date
        ).getTime() -
        new Date(
          b.observation_date
        ).getTime()
    )
    .map(item => ({
      id: item.id,

      date:
        item.observation_date,

      height:
        Number(
          item.wave_height
        )
    }))

})


/* =====================================================
   CHART WIDTH
===================================================== */

/*
  Grafik dibuat lebih lebar daripada
  layar jika datanya banyak.

  Setiap observasi:
  ±65 px.

  Contoh:
  4 data  → sekitar 360 px
  10 data → sekitar 650 px
  20 data → sekitar 1300 px
  30 data → sekitar 1950 px

  Karena container memiliki
  overflow-x: auto, grafik
  dapat digeser.
*/

const chartWidth = computed(() => {

  const minimumWidth =
    360

  const widthPerPoint =
    65

  const calculatedWidth =
    65 +
    waveData.value.length *
      widthPerPoint


  return Math.max(
    minimumWidth,
    calculatedWidth
  )

})


/* =====================================================
   MAX WAVE
===================================================== */

const maxWaveHeight =
  computed(() => {

    if (
      waveData.value.length === 0
    ) {
      return 1
    }


    const maximum =
      Math.max(
        ...waveData.value.map(
          item => item.height
        )
      )


    /*
      Beri sedikit ruang
      di atas grafik.
    */

    return Math.max(
      1,
      Math.ceil(
        maximum * 1.2 * 10
      ) / 10
    )

  })


/* =====================================================
   GRID LINES
===================================================== */

const gridLines =
  computed(() => {

    const values = [
      0,
      0.25,
      0.5,
      0.75,
      1
    ]


    return values.map(
      value => {

        const y =
          125 -
          value * 105


        const height =
          maxWaveHeight.value *
          value


        return {
          y,
          label:
            `${height.toFixed(1)} m`
        }

      }
    )

  })


/* =====================================================
   WAVE POINTS
===================================================== */

const wavePoints =
  computed(() => {

    if (
      waveData.value.length === 0
    ) {
      return []
    }


    const chartLeft = 45

    const chartRight =
      chartWidth.value - 20

    const chartTop = 20

    const chartBottom = 125


    const usableWidth =
      chartRight -
      chartLeft


    const step =
      waveData.value.length === 1
        ? 0
        : usableWidth /
          (
            waveData.value.length -
            1
          )


    return waveData.value.map(
      (
        item,
        index
      ) => {

        const x =
          chartLeft +
          index * step


        const ratio =
          item.height /
          maxWaveHeight.value


        const y =
          chartBottom -
          ratio *
            (
              chartBottom -
              chartTop
            )


        return {
          id: item.id,

          x,

          y,

          label:
            formatChartDate(
              item.date
            )
        }

      }
    )

  })


/* =====================================================
   WAVE LINE
===================================================== */

const wavePointsString =
  computed(() => {

    return wavePoints.value
      .map(
        point =>
          `${point.x},${point.y}`
      )
      .join(' ')

  })


/* =====================================================
   X AXIS LABEL
===================================================== */

/*
  Semua titik tetap ada.

  Yang dikurangi hanya LABEL tanggalnya
  supaya tidak bertumpuk.
*/

const visibleXAxisLabels =
  computed(() => {

    const points =
      wavePoints.value


    if (
      points.length <= 7
    ) {
      return points
    }


    let step = 2


    if (
      points.length > 14
    ) {
      step = 3
    }


    if (
      points.length > 21
    ) {
      step = 5
    }


    if (
      points.length > 30
    ) {
      step = 7
    }


    return points.filter(
      (
        _,
        index
      ) =>
        index % step === 0 ||
        index ===
          points.length - 1
    )

  })


/* =====================================================
   DATE FORMAT
===================================================== */

const formatChartDate = (
  date: string
) => {

  const parsed =
    new Date(date)


  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return date
  }


  return parsed.toLocaleDateString(
    'id-ID',
    {
      day: '2-digit',
      month: 'short'
    }
  )

}


const formatDateShort = (
  date: string
) => {

  const parsed =
    new Date(date)


  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return date
  }


  return parsed.toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'short'
    }
  )

}


/* =====================================================
   WATER CLASS
===================================================== */

const getWaterClass = (
  condition: string
) => {

  if (
    condition === 'Jernih'
  ) {
    return 'water-good'
  }


  if (
    condition === 'Agak Keruh'
  ) {
    return 'water-medium'
  }


  if (
    condition === 'Keruh'
  ) {
    return 'water-bad'
  }


  return 'water-default'

}


/* =====================================================
   WASTE CLASS
===================================================== */

const getWasteClass = (
  waste: string
) => {

  if (
    waste === 'Tidak Ada'
  ) {
    return 'waste-none'
  }


  if (
    waste === 'Rendah'
  ) {
    return 'waste-low'
  }


  if (
    waste === 'Sedang'
  ) {
    return 'waste-medium'
  }


  if (
    waste === 'Tinggi'
  ) {
    return 'waste-high'
  }


  return 'waste-default'

}


/* =====================================================
   BACK
===================================================== */

const goBack = () => {

  router.back()

}


/* =====================================================
   INITIAL LOAD
===================================================== */

onMounted(
  loadHistory
)

</script>


<style scoped>

/* =====================================================
   PAGE
===================================================== */

.history-page {
  min-height: 100%;
  background: #EEF4FB;
  color: #0A2342;
}


/* =====================================================
   TOP BAR
===================================================== */

.top-bar {
  height: 68px;
  background: #0A2342;
  display: flex;
  align-items: center;
  padding: calc(env(safe-area-inset-top, 0px) + 14px) 20px 14px;
  gap: 12px;
  box-sizing: border-box;
}

.top-bar h1 {
  margin: 0;

  color: white;

  font-size: 20px;

  font-weight: 700;
}


.back-button {
  width: 36px;
  height: 36px;

  border: 0;

  background: transparent;

  color: white;

  font-size: 32px;

  line-height: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}


/* =====================================================
   CONTENT
===================================================== */

.content-area {
  padding:
    18px 20px 32px;
}


/* =====================================================
   FILTER CARD
===================================================== */

.filter-card {
  background: white;

  border:
    1px solid #E2EDF8;

  border-radius: 16px;

  padding: 16px;

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 12px;

  margin-bottom: 16px;
}


.filter-column {
  min-width: 0;
}


.filter-label {
  margin:
    0 0 4px;

  color: #5C7A9A;

  font-size: 12px;
}


.filter-value {
  margin: 0;

  color: #0A2342;

  font-size: 14px;

  font-weight: 600;

  text-transform: capitalize;
}


/* =====================================================
   PERIOD BUTTON
===================================================== */

.period-button {
  border: 0;

  background: transparent;

  padding: 0;

  text-align: right;

  display: flex;

  align-items: center;

  justify-content: flex-end;

  gap: 7px;

  cursor: pointer;
}


.period-content {
  text-align: right;
}


.period-chevron {
  color: #5C7A9A;

  font-size: 17px;

  transition:
    transform 0.2s ease;
}


.period-chevron.open {
  transform:
    rotate(180deg);
}


/* =====================================================
   CHART CARD
===================================================== */

.chart-card {
  background: white;

  border:
    1px solid #E2EDF8;

  border-radius: 16px;

  padding: 16px;

  box-shadow:
    0 2px 8px
    rgba(10, 35, 66, 0.04);

  margin-bottom: 20px;

  overflow: hidden;
}


.section-title {
  margin:
    0 0 14px;

  color: #0A2342;

  font-size: 14px;

  font-weight: 700;
}


/* =====================================================
   HORIZONTAL GRAPH
===================================================== */

.chart-scroll {
  width: 100%;

  overflow-x: auto;

  overflow-y: hidden;

  scrollbar-width: thin;

  -webkit-overflow-scrolling:
    touch;

  padding-bottom: 5px;
}


.chart-scroll::-webkit-scrollbar {
  height: 5px;
}


.chart-scroll::-webkit-scrollbar-thumb {
  background: #B8D6EA;

  border-radius: 999px;
}


.wave-chart {
  display: block;

  min-width: 360px;

  height: 160px;
}


/* =====================================================
   GRAPH
===================================================== */

.grid-line {
  stroke: #E2EDF8;

  stroke-width: 1;

  vector-effect:
    non-scaling-stroke;
}


.wave-line {
  stroke: #00B4D8;

  stroke-width: 2.5;

  vector-effect:
    non-scaling-stroke;
}


.wave-point {
  fill: #00B4D8;

  stroke: white;

  stroke-width: 2;

  vector-effect:
    non-scaling-stroke;
}


.y-label {
  fill: #5C7A9A;

  font-size: 9px;
}


.x-label {
  fill: #5C7A9A;

  font-size: 9px;
}


.scroll-hint {
  margin-top: 8px;

  text-align: center;

  color: #7A94AE;

  font-size: 10px;
}


.empty-chart {
  height: 160px;

  display: flex;

  align-items: center;

  justify-content: center;

  text-align: center;

  color: #7A94AE;

  font-size: 12px;
}


/* =====================================================
   TIMELINE
===================================================== */

.timeline-section {
  margin-top: 4px;
}


.timeline-title {
  margin-bottom: 14px;
}


.timeline {
  position: relative;
}


.timeline-line {
  position: absolute;

  left: 6px;

  top: 8px;

  bottom: 8px;

  width: 1px;

  background: #C8DCF0;
}


.timeline-item {
  position: relative;

  padding-left: 26px;

  margin-bottom: 16px;
}


.timeline-dot {
  position: absolute;

  left: 1px;

  top: 14px;

  width: 12px;

  height: 12px;

  border-radius: 50%;

  background: white;

  border:
    2px solid #00B4D8;

  z-index: 2;
}


.observation-card {
  background: white;

  border:
    1px solid #E2EDF8;

  border-radius: 16px;

  padding: 14px;

  box-shadow:
    0 2px 8px
    rgba(10, 35, 66, 0.04);
}


.observation-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 8px;

  margin-bottom: 8px;
}


.observation-date {
  color: #5C7A9A;

  font-size: 11px;
}


.observation-location {
  margin:
    0 0 9px;

  color: #0A2342;

  font-size: 12px;

  font-weight: 700;
}


.observation-meta {
  display: flex;

  flex-wrap: wrap;

  gap: 6px;
}


.water-badge,
.waste-badge,
.wave-badge {
  display: inline-flex;

  align-items: center;

  padding:
    4px 8px;

  border-radius: 999px;

  font-size: 10px;

  font-weight: 600;
}


/* =====================================================
   WATER
===================================================== */

.water-good {
  background: #E6F8F3;
  color: #16866D;
}


.water-medium {
  background: #FFF6DC;
  color: #9A7315;
}


.water-bad {
  background: #FDECEC;
  color: #C84B4B;
}


.water-default {
  background: #EEF4FB;
  color: #5C7A9A;
}


/* =====================================================
   WASTE
===================================================== */

.waste-none {
  background: #E6F8F3;
  color: #16866D;
}


.waste-low {
  background: #EAF6FB;
  color: #197D99;
}


.waste-medium {
  background: #FFF6DC;
  color: #9A7315;
}


.waste-high {
  background: #FDECEC;
  color: #C84B4B;
}


.waste-default {
  background: #EEF4FB;
  color: #5C7A9A;
}


.wave-badge {
  background: #E8F8FC;
  color: #0086A2;
}


/* =====================================================
   EMPTY TIMELINE
===================================================== */

.empty-timeline {
  background: white;

  border:
    1px solid #E2EDF8;

  border-radius: 16px;

  padding: 24px;

  text-align: center;

  color: #7A94AE;

  font-size: 12px;
}


/* =====================================================
   BOTTOM SHEET OVERLAY
===================================================== */

.sheet-overlay {
  position: fixed;

  inset: 0;

  z-index: 60;

  max-width: 430px;

  margin: 0 auto;

  display: flex;

  align-items: flex-end;

  background:
    rgba(10, 35, 66, 0.55);

  backdrop-filter:
    blur(2px);

  -webkit-backdrop-filter:
    blur(2px);
}


/* =====================================================
   BOTTOM SHEET
===================================================== */

.period-sheet {
  width: 100%;

  max-height: 75vh;

  overflow-y: auto;

  background: #EEF4FB;

  border-radius:
    24px 24px 0 0;

  padding:
    12px 20px 30px;

  box-shadow:
    0 -10px 30px
    rgba(10, 35, 66, 0.15);

  animation:
    slideUp 0.22s ease-out;
}


@keyframes slideUp {

  from {
    transform:
      translateY(100%);
  }

  to {
    transform:
      translateY(0);
  }

}


/* =====================================================
   SHEET HANDLE
===================================================== */

.sheet-handle {
  width: 42px;

  height: 4px;

  margin:
    0 auto 18px;

  border-radius: 999px;

  background: #B7C9DA;
}


/* =====================================================
   SHEET HEADER
===================================================== */

.sheet-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 12px;
}


.sheet-header h2 {
  margin: 0;

  color: #0A2342;

  font-size: 18px;

  font-weight: 700;
}


.close-sheet {
  width: 34px;

  height: 34px;

  border: 0;

  border-radius: 50%;

  background: white;

  color: #5C7A9A;

  font-size: 22px;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;
}


/* =====================================================
   PERIOD OPTIONS
===================================================== */

.period-options {
  display: flex;

  flex-direction: column;

  gap: 8px;
}


.period-option {
  width: 100%;

  min-height: 52px;

  border:
    1px solid transparent;

  border-radius: 16px;

  background: white;

  padding:
    0 15px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  color: #0A2342;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}


.period-option.selected {
  background: #E4F7FC;

  border-color:
    #00B4D8;
}


.period-option-left {
  display: flex;

  align-items: center;

  gap: 12px;
}


.radio-circle {
  width: 20px;

  height: 20px;

  border-radius: 50%;

  border:
    2px solid #B8CBDD;

  display: flex;

  align-items: center;

  justify-content: center;
}


.radio-circle.selected {
  border-color:
    #00B4D8;
}


.radio-dot {
  width: 10px;

  height: 10px;

  border-radius: 50%;

  background:
    #00B4D8;
}


.check-icon {
  color:
    #00B4D8;

  font-size: 18px;

  font-weight: 800;
}


/* =====================================================
   EMPTY PERIOD
===================================================== */

.empty-period {
  background: white;

  border-radius: 16px;

  padding: 20px;

  text-align: center;

  color: #7A94AE;

  font-size: 12px;
}

</style>