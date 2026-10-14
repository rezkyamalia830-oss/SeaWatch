<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="page-wrapper">

        <div class="content">

          <!-- ========================= -->
          <!-- HEADER (disederhanakan) -->
          <!-- ========================= -->

          <h1 class="page-title">Observasi</h1>

          <div class="content-inner">

          <!-- ========================= -->
          <!-- SEARCH -->
          <!-- ========================= -->

          <div class="search-row">

            <div class="search-box">
              <ion-icon :icon="searchOutline" />

              <input
                v-model="search"
                type="text"
                placeholder="Cari observasi…"
              />
            </div>

            <button
              type="button"
              class="filter-button"
              @click="showFilter = !showFilter"
            >
              <ion-icon :icon="filterOutline" />
            </button>

          </div>


          <!-- ========================= -->
          <!-- FILTER CONDITION -->
          <!-- ========================= -->

          <div class="filter-chips">

            <button
              v-for="condition in conditions"
              :key="condition"
              type="button"
              class="filter-chip"
              :class="{
                active: filterCondition === condition
              }"
              @click="filterCondition = condition"
            >
              {{ condition }}
            </button>

          </div>


          <!-- ========================= -->
          <!-- JUMLAH DATA -->
          <!-- ========================= -->

          <p class="result-count">
            {{ filteredObservations.length }} observasi ditemukan
          </p>


          <!-- ========================= -->
          <!-- LOADING -->
          <!-- ========================= -->

          <div
            v-if="loading"
            class="empty-state"
          >
            <p>Memuat data observasi...</p>
          </div>


          <!-- ========================= -->
          <!-- EMPTY -->
          <!-- ========================= -->

          <div
            v-else-if="filteredObservations.length === 0"
            class="empty-state"
          >
            <div class="empty-icon">
              <ion-icon :icon="waterOutline" />
            </div>

            <h3>Tidak ada observasi</h3>

            <p>
              Belum ada data observasi yang sesuai
              dengan pencarian atau filter.
            </p>
          </div>


          <!-- ========================= -->
          <!-- OBSERVATION CARDS -->
          <!-- ========================= -->

          <div
            v-else
            class="observation-list"
          >

            <div
              v-for="observation in filteredObservations"
              :key="observation.id"
              class="observation-card"
            >

              <!-- CARD HEADER -->

              <div class="card-header">

                <div>

                  <div class="location-row">

                    <ion-icon
                      :icon="locationOutline"
                    />

                    <p>
                      {{ observation.location }}
                    </p>

                  </div>

                  <p class="observation-date">
                    {{
                      formatDate(observation.date)
                    }}
                  </p>

                </div>


                <!-- WATER BADGE -->

                <span
                  class="water-badge"
                  :class="getWaterBadgeClass(
                    observation.waterCondition
                  )"
                >
                  {{ observation.waterCondition }}
                </span>

              </div>


              <!-- WASTE -->

              <div class="waste-row">

                <span
                  class="waste-badge"
                  :class="getWasteBadgeClass(
                    observation.wasteLevel
                  )"
                >
                  Sampah: {{ observation.wasteLevel }}
                </span>

              </div>


              <!-- NOTES -->

              <p
                v-if="observation.notes"
                class="notes"
              >
                {{ observation.notes }}
              </p>


              <!-- ACTION -->

              <div class="card-actions">

                <!-- EDIT -->
                <button
                  v-if="canEditObservation(observation)"
                  type="button"
                  class="edit-button"
                  @click="handleEdit(observation)"
                >
                  Edit
                </button>

                <!-- INFO JIKA SUDAH LEWAT 5 BULAN -->
                <span
                  v-else
                  class="locked-label"
                >
                  <ion-icon :icon="lockClosedOutline" />
                  Tidak dapat diedit
                </span>


                <!-- DELETE -->

                <button
                  type="button"
                  class="delete-button"
                  @click="handleDelete(observation)"
                >
                  Hapus
                </button>

              </div>

            </div>

          </div>

          </div>

        </div>


        <!-- ========================= -->
        <!-- FAB TAMBAH -->
        <!-- ========================= -->

        <button
          type="button"
          class="add-fab"
          @click="handleAdd"
        >
          <ion-icon :icon="addOutline" />
        </button>

<!-- ========================= -->
        <!-- BOTTOM NAVIGATION -->
        <!-- ========================= -->

        <nav class="bottom-nav">

          <!-- BERANDA -->
          <button
            type="button"
            class="nav-item"
            @click="router.push('/')"
          >
            <ion-icon :icon="homeOutline" />
            <span>Beranda</span>
          </button>


          <!-- OBSERVASI -->
          <button
            type="button"
            class="nav-item active"
            @click="router.push('/observations')"
          >
            <ion-icon :icon="clipboardOutline" />
            <span>Observasi</span>
          </button>


          <!-- LOKASI -->
          <button
            type="button"
            class="nav-item"
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


      </div>
    </ion-content>




    <!-- ========================= -->
    <!-- DELETE CONFIRMATION -->
    <!-- ========================= -->

    <ion-alert
      :is-open="deleteDialogOpen"
      header="Hapus Observasi?"
      :message="deleteMessage"
      :buttons="deleteButtons"
      @didDismiss="deleteDialogOpen = false"
    />

  </ion-page>
</template>


<script setup lang="ts">

import {
  IonPage,
  IonContent,
  IonIcon,
  IonAlert,
  onIonViewWillEnter
} from '@ionic/vue'

import {
  addOutline,
  searchOutline,
  filterOutline,
  locationOutline,
  waterOutline,
  lockClosedOutline,
  homeOutline,
  clipboardOutline,
  barChartOutline
} from 'ionicons/icons'

import {
  ref,
  computed,
  onMounted
} from 'vue'

import { useRouter } from 'vue-router'

import {
  getObservations,
  deleteObservation,
  isObservationEditable
} from '../data/database'


// ==========================================
// ROUTER
// ==========================================

const router = useRouter()


// ==========================================
// TYPE
// ==========================================

interface Observation {
  id: number
  location: string
  date: string
  waterCondition: string
  wasteLevel: string
  marineLife: string
  weatherCondition: string
  waveHeight: number | null
  notes: string
}


// ==========================================
// STATE
// ==========================================

const observations = ref<Observation[]>([])

const loading = ref(false)

const search = ref('')

const filterCondition = ref('Semua')

const showFilter = ref(false)

const deleteDialogOpen = ref(false)

const selectedObservation = ref<Observation | null>(null)


// ==========================================
// FILTER OPTIONS
// ==========================================

const conditions = [
  'Semua',
  'Jernih',
  'Agak Keruh',
  'Keruh'
]


// ==========================================
// LOAD OBSERVATIONS
// ==========================================

const loadObservations = async () => {

  loading.value = true

  try {

    const data = await getObservations()

    observations.value = data.map(
      (item: any) => ({
        id: Number(item.id),

        location: item.location,

        date: item.observation_date,

        waterCondition:
          item.water_condition ?? '',

        wasteLevel:
          item.waste_level ?? '',

        marineLife:
          item.marine_life ?? '',

        weatherCondition:
          item.weather_condition ?? '',

        waveHeight:
          item.wave_height !== null &&
          item.wave_height !== undefined
            ? Number(item.wave_height)
            : null,

        notes:
          item.notes ?? ''
      })
    )

  } catch (error) {

    console.error(
      'Gagal mengambil data observasi:',
      error
    )

  } finally {

    loading.value = false

  }

}


// ==========================================
// SEARCH + FILTER
// ==========================================

const filteredObservations = computed(() => {

  const keyword =
    search.value
      .trim()
      .toLowerCase()

  return observations.value.filter(
    observation => {

      const matchSearch =
        observation.location
          .toLowerCase()
          .includes(keyword) ||

        observation.notes
          .toLowerCase()
          .includes(keyword)

      const matchCondition =
        filterCondition.value === 'Semua' ||

        observation.waterCondition ===
          filterCondition.value

      return (
        matchSearch &&
        matchCondition
      )

    }
  )

})


// ==========================================
// FORMAT DATE
// ==========================================

const formatDate = (
  date: string
) => {

  if (!date) return '-'

  const parsedDate =
    new Date(`${date}T00:00:00`)

  return parsedDate.toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  )

}


// ==========================================
// CHECK EDITABLE
// ==========================================

const canEditObservation = (
  observation: Observation
) => {

  return isObservationEditable(
    observation.date
  )

}


// ==========================================
// EDIT
// ==========================================

const handleEdit = (
  observation: Observation
) => {

  if (
    !canEditObservation(observation)
  ) {

    return

  }

  router.push({
    path: '/add-observation',
    query: {
      id: String(observation.id)
    }
  })

}


// ==========================================
// ADD
// ==========================================

const handleAdd = () => {

  router.push(
    '/add-observation'
  )

}


// ==========================================
// DELETE
// ==========================================

const handleDelete = (
  observation: Observation
) => {

  selectedObservation.value =
    observation

  deleteDialogOpen.value = true

}


const deleteMessage = computed(() => {

  if (
    !selectedObservation.value
  ) {
    return ''
  }

  return `
    Observasi di ${selectedObservation.value.location}
    pada ${formatDate(
      selectedObservation.value.date
    )}
    akan dihapus secara permanen.
  `

})


const deleteButtons = [

  {
    text: 'Batal',
    role: 'cancel'
  },

  {
    text: 'Hapus',
    role: 'destructive',

    handler: async () => {

      if (
        !selectedObservation.value
      ) {
        return
      }

      try {

        await deleteObservation(
          selectedObservation.value.id
        )

        await loadObservations()

      } catch (error) {

        console.error(
          'Gagal menghapus observasi:',
          error
        )

      } finally {

        selectedObservation.value =
          null

      }

    }

  }

]


// ==========================================
// WATER BADGE
// ==========================================

const getWaterBadgeClass = (
  condition: string
) => {

  switch (condition) {

    case 'Jernih':
      return 'water-clear'

    case 'Agak Keruh':
      return 'water-medium'

    case 'Keruh':
      return 'water-murky'

    default:
      return ''

  }

}


// ==========================================
// WASTE BADGE
// ==========================================

const getWasteBadgeClass = (
  level: string
) => {

  switch (level) {

    case 'Tidak Ada':
      return 'waste-none'

    case 'Rendah':
      return 'waste-low'

    case 'Sedang':
      return 'waste-medium'

    case 'Tinggi':
      return 'waste-high'

    default:
      return ''

  }

}


// ==========================================
// LIFECYCLE
// ==========================================

onIonViewWillEnter(async () => {

  await loadObservations()

})

</script>


<style scoped>

/* ==========================================
   PAGE
========================================== */

ion-content {
  --background: #EEF4FB;
}

.page-wrapper {
  min-height: 100%;
  max-width: 430px;
  margin: 0 auto;
  background: #EEF4FB;
  color: #0A2342;
  padding-bottom: 100px;
}


/* ==========================================
   CONTENT
========================================== */

.content {
  padding: 20px 20px 20px;
  padding-top: max(28px, calc(env(safe-area-inset-top, 0px) + 20px));
}

.content-inner {
  display: flex;
  flex-direction: column;
  gap: 16px; /* setara space-y-4 */
}


/* ==========================================
   PAGE TITLE (pengganti TopBar)
========================================== */

.page-title {
  margin: 0 0 16px;
  text-align: center;
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 0.3px;
  color: #0A2342;
}


/* ==========================================
   SEARCH
========================================== */

.search-row {
  display: flex;
  gap: 12px;
}

.search-box {
  flex: 1;
  height: 44px; /* h-11 */
  display: flex;
  align-items: center;
  gap: 8px; /* gap-2 */
  padding: 0 12px; /* px-3 */
  background: white;
  border: 1px solid #E2EDF8;
  border-radius: 12px; /* rounded-xl */
}

.search-box ion-icon {
  color: #5C7A9A;
  font-size: 18px;
}

.search-box input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #0A2342;
  font-size: 14px;
}

.search-box input::placeholder {
  color: #5C7A9A;
}

.filter-button {
  width: 44px; /* w-11 */
  height: 44px; /* h-11 */
  border: 1px solid #E2EDF8;
  border-radius: 12px; /* rounded-xl */
  background: white;
  color: #0A2342;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}


/* ==========================================
   FILTER
========================================== */

.filter-chips {
  display: flex;
  gap: 8px; /* gap-2 */
  overflow-x: auto;
  padding-bottom: 4px; /* pb-1 */
  scrollbar-width: none;
}

.filter-chips::-webkit-scrollbar {
  display: none;
}

.filter-chip {
  white-space: nowrap;
  padding: 6px 14px; /* py-1.5 px-3.5 */
  border-radius: 999px; /* rounded-full */
  border: 1px solid #E2EDF8;
  background: white;
  color: #5C7A9A;
  font-size: 12px; /* text-xs */
  font-weight: 500; /* font-medium */
  transition: all 0.15s ease;
}

.filter-chip.active {
  background: #0A2342;
  color: white;
  border-color: #0A2342;
}


/* ==========================================
   RESULT COUNT
========================================== */

.result-count {
  margin: 0;
  color: #5C7A9A;
  font-size: 12px; /* text-xs */
}


/* ==========================================
   CARDS
========================================== */

.observation-list {
  display: flex;
  flex-direction: column;
  gap: 12px; /* space-y-3 */
}

.observation-card {
  background: white;
  border-radius: 16px; /* rounded-2xl */
  padding: 16px; /* p-4 */
  border: 1px solid #E2EDF8;
  box-shadow: 0 1px 3px rgba(10, 35, 66, 0.06); /* shadow-sm */
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px; /* mb-2 */
}

.location-row {
  display: flex;
  align-items: center;
  gap: 6px; /* gap-1.5 */
  margin-bottom: 2px; /* mb-0.5 */
}

.location-row ion-icon {
  color: #00B4D8;
  font-size: 17px;
}

.location-row p {
  margin: 0;
  color: #0A2342;
  font-size: 14px;
  font-weight: 700;
}

.observation-date {
  margin: 0 0 0 20px; /* ml-5 */
  color: #5C7A9A;
  font-size: 12px; /* text-xs */
}


/* ==========================================
   WATER BADGE
========================================== */

.water-badge {
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.water-clear {
  background: #D9F5FB;
  color: #007EA7;
}

.water-medium {
  background: #FFF1CC;
  color: #A66A00;
}

.water-murky {
  background: #FFE5E5;
  color: #B42318;
}


/* ==========================================
   WASTE
========================================== */

.waste-row {
  display: flex;
  align-items: center;
  gap: 8px; /* gap-2 */
  margin-bottom: 8px; /* mb-2 */
}

.waste-badge {
  padding: 5px 9px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.waste-none {
  background: #E8F8EE;
  color: #18794E;
}

.waste-low {
  background: #E8F8EE;
  color: #18794E;
}

.waste-medium {
  background: #FFF1CC;
  color: #A66A00;
}

.waste-high {
  background: #FFE5E5;
  color: #B42318;
}


/* ==========================================
   NOTES
========================================== */

.notes {
  margin: 8px 0 0;
  color: #5C7A9A;
  font-size: 12px;
  line-height: 1.5;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


/* ==========================================
   ACTIONS
========================================== */

.card-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px; /* gap-2 */
  margin-top: 12px; /* mt-3 */
  padding-top: 12px; /* pt-3 */
  border-top: 1px solid #E2EDF8;
}

.edit-button {
  border: none;
  padding: 6px 12px; /* py-1.5 px-3 */
  border-radius: 8px; /* rounded-lg */
  background: #D4EEFF;
  color: #007EA7;
  font-size: 12px; /* text-xs */
  font-weight: 600; /* font-semibold */
}

.delete-button {
  border: none;
  padding: 6px 12px; /* py-1.5 px-3 */
  border-radius: 8px; /* rounded-lg */
  background: #FFE5D9;
  color: #C44B2A;
  font-size: 12px; /* text-xs */
  font-weight: 600; /* font-semibold */
}

.locked-label {
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #8AA0B8;
  font-size: 10px;
}

.locked-label ion-icon {
  font-size: 13px;
}


/* ==========================================
   EMPTY
========================================== */

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #5C7A9A;
}

.empty-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: #D4EEFF;
  color: #007EA7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
}

.empty-state h3 {
  margin: 0 0 6px;
  color: #0A2342;
  font-size: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}


/* ==========================================
   FAB
========================================== */

.add-fab {
  position: fixed;
  right: max(20px, calc((100vw - 430px) / 2 + 20px));
  bottom: calc(68px + env(safe-area-inset-bottom, 0px) + 32px);

  width: 56px;
  height: 56px;

  border: none;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  font-size: 24px;

  background: linear-gradient(
    135deg,
    #00B4D8,
    #0A2342
  );

  box-shadow:
    0 8px 20px rgba(10, 35, 66, 0.22);

  z-index: 40;
  transition: transform 0.15s ease;
}

.add-fab:active {
  transform: scale(0.95); /* active:scale-95 */
}

/* ==========================================
   BOTTOM NAVIGATION
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
  margin-top: -5px;

  border: none;
  background: transparent;

  color: #5C7A9A;

  font-family: inherit;
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
