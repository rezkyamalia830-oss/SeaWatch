<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <main class="page-container">

        <!-- HERO -->
        <section class="hero">

                    <button
            class="back-button"
            @click="goBack"
          >
            ‹
          </button>

          <button
            class="menu-button"
            @click="showLocationMenu = !showLocationMenu"
          >
            <ion-icon :icon="ellipsisVerticalOutline" />
          </button>

          <div
            v-if="showLocationMenu"
            class="menu-backdrop"
            @click="showLocationMenu = false"
          ></div>

          <div
            v-if="showLocationMenu"
            class="location-menu"
          >
            <button
              type="button"
              class="location-menu-item"
              @click="openEditModal"
            >
              <ion-icon :icon="createOutline" />
              Edit Lokasi
            </button>

            <div class="location-menu-divider"></div>

            <button
              type="button"
              class="location-menu-item danger"
              :disabled="!canDeleteLocation"
              @click="openDeleteConfirm"
            >
              <ion-icon :icon="trashOutline" />
              Hapus Lokasi
            </button>
          </div>

          <div class="hero-content">

            <div class="hero-icon">
              <ion-icon :icon="locationOutline" />
            </div>

            <h1>{{ location?.name || 'Detail Lokasi' }}</h1>

            <p v-if="location">
              {{ Number(location.latitude).toFixed(4) }},
              {{ Number(location.longitude).toFixed(4) }}
            </p>

          </div>

        </section>

        <!-- CONTENT -->
        <div class="content">

          <!-- SUMMARY -->
          <div class="summary-grid">

            <div class="summary-card">
              <span class="summary-label">
                Observasi
              </span>

              <strong>
                {{ observations.length }}
              </strong>

              <small>
                tercatat
              </small>
            </div>

            <div class="summary-card">
              <span class="summary-label">
                Kondisi
              </span>

              <strong
                class="condition-text"
                :class="getConditionClass(latestCondition)"
              >
                {{ latestCondition }}
              </strong>

              <small>
                observasi terakhir
              </small>
            </div>

            <div class="summary-card">
  <span class="summary-label">
    Kecepatan Angin
  </span>

  <strong>
    <span v-if="weatherLoading">
      ...
    </span>

    <span v-else-if="weatherData?.windSpeed !== null">
      {{ weatherData?.windSpeed?.toFixed(1) }} km/h
    </span>

    <span v-else>
      —
    </span>
  </strong>

  <small>
    dari API
  </small>
</div>

          </div>

          <!-- KONDISI LAUT TERKINI -->
          <section class="section">

            <h2>Kondisi Laut Terkini</h2>

            <div class="current-card">

              <div class="current-row">
  <div>
    <span class="current-label">
      Tinggi Gelombang
    </span>

    <strong>
      <span v-if="marineLoading">
        ...
      </span>

      <span v-else-if="marineData?.waveHeight !== null">
        {{ marineData?.waveHeight?.toFixed(2) }} m
      </span>

      <span v-else>
        —
      </span>
    </strong>
  </div>

  <div class="current-icon">
    〰
  </div>
</div>
               

              <div class="divider"></div>

              <div class="current-row">
  <div>
    <span class="current-label">
      Suhu Laut
    </span>

    <strong>
      <span v-if="marineLoading">
        ...
      </span>

      <span v-else-if="marineData?.seaSurfaceTemperature !== null">
        {{ marineData?.seaSurfaceTemperature?.toFixed(1) }} °C
      </span>

      <span v-else>
        —
      </span>
    </strong>
  </div>

  <div class="current-icon">
    °C
  </div>
</div>

              <div class="divider"></div>

              <div class="current-row">
                <div>
                  <span class="current-label">
                    Kecepatan Arus
                  </span>

                  <strong>
  <span v-if="marineLoading">
    ...
  </span>

  <span v-else-if="marineData?.oceanCurrentVelocity !== null">
    {{ marineData?.oceanCurrentVelocity?.toFixed(1) }} km/h
  </span>

  <span v-else>
    —
  </span>
</strong>

                </div>

                <div class="current-icon">
                  ↝
                </div>
              </div>

              <p class="source-text">
                Sumber: Open-Meteo Marine API
              </p>
              <p
  v-if="marineError"
  class="api-error"
>
  Data kelautan sementara tidak tersedia.
</p>

            </div>

          </section>

          <!-- OBSERVASI TERAKHIR -->
          <section class="section">

            <div class="section-title-row">
              <h2>Observasi Terakhir</h2>

              <span v-if="latestObservation">
                {{ formatDate(latestObservation.observation_date) }}
              </span>
            </div>

            <div
              v-if="latestObservation"
              class="observation-card"
            >

              <div class="badge-row">

                <span class="badge water-badge">
                  {{ latestObservation.water_condition }}
                </span>

                <span class="badge waste-badge">
                  Sampah:
                  {{ latestObservation.waste_level }}
                </span>

              </div>

              <p
                v-if="latestObservation.notes"
                class="notes"
              >
                {{ latestObservation.notes }}
              </p>

              <div
                v-if="latestObservation.marine_life"
                class="detail-item"
              >
                <span>Biota laut</span>

                <span>
                  {{ formatMarineLife(latestObservation.marine_life) }}
                </span>
              </div>

              <div
                v-if="latestObservation.weather_condition"
                class="detail-item"
              >
                <span>Cuaca</span>

                <span>
                  {{ latestObservation.weather_condition }}
                </span>
              </div>

            </div>

            <div
              v-else
              class="empty-observation"
            >
              <ion-icon :icon="clipboardOutline" />

              <p>
                Belum ada observasi di lokasi ini.
              </p>
            </div>

          </section>

          <!-- ACTION -->
          <div class="actions">

            <button
              class="secondary-button"
              @click="viewHistory"
            >
              Lihat Riwayat
            </button>

            <button
              class="primary-button"
              @click="addNewObservation"
            >
              Tambah Obs.
            </button>

          </div>

                </div>

        <!-- ========================= -->
        <!-- KONFIRMASI HAPUS LOKASI -->
        <!-- ========================= -->
        <div
          v-if="showDeleteConfirm"
          class="modal-overlay"
          @click.self="showDeleteConfirm = false"
        >
          <div class="delete-sheet">

            <div class="delete-icon">
              <ion-icon :icon="trashOutline" />
            </div>

            <h2>Hapus lokasi?</h2>

            <p>
              {{ location?.name }} dan {{ observations.length }} observasi
              yang terkait akan dihapus permanen.
            </p>

            <div class="delete-actions">
              <button
                type="button"
                class="cancel-button"
                @click="showDeleteConfirm = false"
              >
                Batal
              </button>

              <button
                type="button"
                class="delete-button"
                @click="confirmDeleteLocation"
              >
                Ya, Hapus
              </button>
            </div>

          </div>
        </div>

        <!-- ========================= -->
        <!-- MODAL EDIT LOKASI -->
        <!-- ========================= -->
        <div
          v-if="showEditModal"
          class="modal-overlay"
          @click.self="closeEditModal"
        >
          <div class="edit-sheet">

            <div class="modal-header">
              <h2>Edit Lokasi</h2>
              <button
                type="button"
                class="close-button"
                @click="closeEditModal"
              >
                ×
              </button>
            </div>

            <p
              v-if="editError"
              class="edit-error"
            >
              {{ editError }}
            </p>

            <label class="modal-label">Nama Lokasi</label>
            <input
              v-model="editName"
              class="modal-input"
              type="text"
              placeholder="Contoh: Pantai Nambo"
            />

            <div class="coordinate-row">
              <div>
                <label class="modal-label">Latitude</label>
                <input
                  v-model="editLatitude"
                  class="modal-input"
                  type="number"
                  step="any"
                />
              </div>

              <div>
                <label class="modal-label">Longitude</label>
                <input
                  v-model="editLongitude"
                  class="modal-input"
                  type="number"
                  step="any"
                />
              </div>
            </div>

            <button
              type="button"
              class="save-edit-button"
              @click="saveLocationEdit"
            >
              Simpan Perubahan
            </button>

          </div>
        </div>

      </main>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  IonPage,
  IonContent,
  IonIcon
} from '@ionic/vue'

import {
  locationOutline,
  clipboardOutline,
  ellipsisVerticalOutline,
  createOutline,
  trashOutline
} from 'ionicons/icons'

import {
  getLocations,
  getObservations,
  updateLocation,
  deleteLocation
} from '../data/database'

import {
  getWeatherCurrent,
  type WeatherCurrentData
} from '../data/weatherApi'

import {
  getMarineCurrent,
  type MarineCurrentData
} from '../data/marineApi'

const route = useRoute()
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
  location_id: number
  location: string
  observation_date: string
  water_condition: string
  waste_level: string
  marine_life: string
  weather_condition: string
  notes: string
}

const weatherData = ref<WeatherCurrentData | null>(null)
const weatherLoading = ref(false)
const weatherError = ref(false)

const location = ref<Location | null>(null)
const observations = ref<Observation[]>([])

const latestObservation = ref<Observation | null>(null)

const marineData = ref<MarineCurrentData | null>(null)

const marineLoading = ref(false)
const marineError = ref(false)

const latestCondition = ref('Belum ada data')

// ==========================================
// MENU, EDIT, HAPUS LOKASI
// ==========================================

const showLocationMenu = ref(false)
const showDeleteConfirm = ref(false)
const showEditModal = ref(false)

const allLocationsCount = ref(0)

const canDeleteLocation = computed(() => {
  return allLocationsCount.value > 1
})

const editName = ref('')
const editLatitude = ref('')
const editLongitude = ref('')
const editError = ref('')

const openEditModal = () => {
  if (!location.value) return

  editName.value = location.value.name
  editLatitude.value = String(location.value.latitude)
  editLongitude.value = String(location.value.longitude)
  editError.value = ''

  showLocationMenu.value = false
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editError.value = ''
}

const openDeleteConfirm = () => {
  if (!canDeleteLocation.value) return

  showLocationMenu.value = false
  showDeleteConfirm.value = true
}

const saveLocationEdit = async () => {
  if (!location.value) return

  const name = editName.value.trim()
  const lat = Number(editLatitude.value)
  const lon = Number(editLongitude.value)

  if (!name) {
    editError.value = 'Nama lokasi wajib diisi.'
    return
  }

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    editError.value = 'Latitude harus berada antara -90 sampai 90.'
    return
  }

  if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
    editError.value = 'Longitude harus berada antara -180 sampai 180.'
    return
  }

  try {
    await updateLocation(
      location.value.id,
      name,
      lat,
      lon,
      location.value.description
    )

    location.value = {
      ...location.value,
      name,
      latitude: lat,
      longitude: lon
    }

    showEditModal.value = false
  } catch (error) {
    console.error('Gagal memperbarui lokasi:', error)
    editError.value = 'Gagal menyimpan perubahan lokasi.'
  }
}

const confirmDeleteLocation = async () => {
  if (!location.value) return

  try {
    await deleteLocation(location.value.id)

    showDeleteConfirm.value = false

    router.replace('/locations')
  } catch (error) {
    console.error('Gagal menghapus lokasi:', error)
    alert('Gagal menghapus lokasi.')
  }
}

const loadMarineData = async () => {
  if (!location.value) return

  marineLoading.value = true
  marineError.value = false

  try {
    marineData.value = await getMarineCurrent(
      location.value.latitude,
      location.value.longitude
    )

    console.log(
      'Data Marine API:',
      marineData.value
    )

  } catch (error) {
    console.error(
      'Gagal mengambil data Marine API:',
      error
    )

    marineError.value = true
    marineData.value = null

  } finally {
    marineLoading.value = false
  }
}

const loadLocationDetail = async () => {
  try {
    const locationId = Number(route.query.id)

    if (!locationId) {
      console.error('ID lokasi tidak ditemukan.')
      return
    }

    const locationData = await getLocations()

    allLocationsCount.value = locationData.length

    const selectedLocation = locationData.find(
      (item: any) =>
        Number(item.id) === locationId
    )

    if (!selectedLocation) {
      console.error('Lokasi tidak ditemukan.')
      return
    }

    const loadWeatherData = async () => {
  if (!location.value) return

  weatherLoading.value = true
  weatherError.value = false

  try {
    weatherData.value = await getWeatherCurrent(
      location.value.latitude,
      location.value.longitude
    )

    console.log('Data Weather API:', weatherData.value)
  } catch (error) {
    console.error('Gagal mengambil Weather API:', error)

    weatherError.value = true
    weatherData.value = null
  } finally {
    weatherLoading.value = false
  }
}

    location.value = {
      id: Number(selectedLocation.id),
      name: selectedLocation.name,
      latitude: Number(selectedLocation.latitude),
      longitude: Number(selectedLocation.longitude),
      description: selectedLocation.description ?? ''
    }

    await loadMarineData()
    await loadWeatherData()

    const observationData = await getObservations()

    observations.value = observationData.filter(
      (item: any) =>
        Number(item.location_id) === locationId
    )

    latestObservation.value =
      observations.value.length > 0
        ? observations.value[0]
        : null

    if (latestObservation.value) {
      latestCondition.value =
        convertCondition(
          latestObservation.value.water_condition
        )
    }

  } catch (error) {
    console.error(
      'Gagal memuat detail lokasi:',
      error
    )

    alert('Gagal memuat detail lokasi.')
  }
}

const convertCondition = (waterCondition: string) => {
  if (waterCondition === 'Jernih') {
    return 'Baik'
  }

  if (waterCondition === 'Agak Keruh') {
    return 'Sedang'
  }

  if (waterCondition === 'Keruh') {
    return 'Buruk'
  }

  return waterCondition || 'Belum ada data'
}

const getConditionClass = (condition: string) => {
  if (condition === 'Baik') {
    return 'good'
  }

  if (condition === 'Sedang') {
    return 'medium'
  }

  if (condition === 'Buruk') {
    return 'bad'
  }

  return 'unknown'
}

const formatDate = (date: string) => {
  if (!date) return '-'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString(
    'id-ID',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  )
}

const formatMarineLife = (value: string) => {
  try {
    const parsed = JSON.parse(value)

    if (Array.isArray(parsed)) {
      return parsed.join(', ')
    }

    return value
  } catch {
    return value
  }
}

const goBack = () => {
  router.back()
}

const viewHistory = () => {
  if (!location.value) return

  router.push({
    path: '/history',
    query: {
      locationId: String(location.value.id)
    }
  })
}


const addNewObservation = () => {
  if (!location.value) return

  router.push({
    path: '/add-observation',
    query: {
      locationId: String(location.value.id)
    }
  })
}

onMounted(async () => {
  await loadLocationDetail()
})
</script>

<style scoped>
.page-container {
  min-height: 100%;
  background: #EEF4FB;
  padding-bottom: 30px;
}
.api-error {
  margin: 6px 0 0;

  color: #DC2626;

  font-size: 9px;

  text-align: right;
}


/* HERO */

.hero {
  position: relative;

  min-height: 210px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  background:
    linear-gradient(
      145deg,
      #0A2342 0%,
      #075985 55%,
      #00B4D8 100%
    );

  color: white;
}

.hero::after {
  content: '';

  position: absolute;

  width: 280px;
  height: 280px;

  border-radius: 50%;

  right: -100px;
  bottom: -170px;

  border: 35px solid rgba(255,255,255,0.07);
}

.back-button {
  position: absolute;

  top: 48px;
  left: 18px;

  z-index: 2;

  width: 38px;
  height: 38px;

  border: none;
  border-radius: 50%;

  background: rgba(255,255,255,0.16);

  color: white;

  font-size: 30px;
  line-height: 1;

  cursor: pointer;
}

.hero-content {
  position: relative;
  z-index: 1;

  text-align: center;

  padding: 45px 20px 25px;
}

.hero-icon {
  width: 52px;
  height: 52px;

  margin: 0 auto 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: rgba(255,255,255,0.15);

  font-size: 25px;
}

.hero h1 {
  margin: 0;

  font-family: 'DM Serif Display', Georgia, serif;

  font-size: 26px;
  font-weight: 400;
}

.hero p {
  margin: 7px 0 0;

  color: rgba(255,255,255,0.8);

  font-family: monospace;

  font-size: 11px;
}

/* CONTENT */

.content {
  padding: 16px 20px 30px;
}

/* SUMMARY */

.summary-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 9px;

  margin-bottom: 24px;
}

.summary-card {
  background: white;

  border: 1px solid #E2EDF8;

  border-radius: 13px;

  padding: 13px 8px;

  text-align: center;

  box-shadow:
    0 3px 12px rgba(10, 35, 66, 0.04);
}

.summary-label {
  display: block;

  color: #6B829A;

  font-size: 9px;

  margin-bottom: 6px;
}

.summary-card strong {
  display: block;

  color: #0A2342;

  font-size: 17px;
}

.summary-card small {
  display: block;

  margin-top: 3px;

  color: #8BA0B4;

  font-size: 8px;
}

.condition-text.good {
  color: #16A34A;
}

.condition-text.medium {
  color: #D97706;
}

.condition-text.bad {
  color: #DC2626;
}

.condition-text.unknown {
  color: #64748B;
}

/* SECTION */

.section {
  margin-bottom: 22px;
}

.section h2 {
  margin: 0 0 10px;

  color: #0A2342;

  font-size: 15px;

  font-weight: 600;
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 10px;
}

.section-title-row h2 {
  margin: 0;
}

.section-title-row span {
  color: #7890A7;

  font-size: 10px;
}

/* CURRENT */

.current-card {
  background: white;

  border: 1px solid #E2EDF8;

  border-radius: 15px;

  padding: 15px;

  box-shadow:
    0 3px 12px rgba(10, 35, 66, 0.04);
}

.current-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.current-label {
  display: block;

  color: #71869B;

  font-size: 10px;

  margin-bottom: 3px;
}

.current-row strong {
  color: #0A2342;

  font-size: 16px;
}

.current-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #E8F8FC;

  color: #00A6C7;

  font-size: 14px;
}

.divider {
  height: 1px;

  background: #EDF3F8;

  margin: 12px 0;
}

.source-text {
  margin: 13px 0 0;

  color: #94A3B8;

  font-size: 9px;

  text-align: right;
}

/* OBSERVATION */

.observation-card {
  background: white;

  border: 1px solid #E2EDF8;

  border-radius: 15px;

  padding: 15px;

  box-shadow:
    0 3px 12px rgba(10, 35, 66, 0.04);
}

.badge-row {
  display: flex;

  flex-wrap: wrap;

  gap: 7px;

  margin-bottom: 12px;
}

.badge {
  padding: 5px 9px;

  border-radius: 20px;

  font-size: 10px;

  font-weight: 600;
}

.water-badge {
  background: #E2F7FB;

  color: #0086A3;
}

.waste-badge {
  background: #FFF4D6;

  color: #9A6900;
}

.notes {
  margin: 0 0 12px;

  color: #40566D;

  font-size: 11px;

  line-height: 1.6;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-top: 9px;

  margin-top: 9px;

  border-top: 1px solid #EDF3F8;

  font-size: 10px;
}

.detail-item span:first-child {
  color: #7A8EA3;
}

.detail-item span:last-child {
  color: #0A2342;

  font-weight: 500;

  text-align: right;
}

.empty-observation {
  background: white;

  border: 1px solid #E2EDF8;

  border-radius: 15px;

  padding: 25px 15px;

  text-align: center;

  color: #8CA0B3;
}

.empty-observation ion-icon {
  font-size: 28px;

  color: #B4C7D8;

  margin-bottom: 5px;
}

.empty-observation p {
  margin: 0;

  font-size: 11px;
}

/* ACTIONS */

.actions {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;

  margin-top: 6px;
}

.actions button {
  height: 46px;

  border-radius: 12px;

  font-size: 12px;

  font-weight: 600;

  cursor: pointer;
}

.secondary-button {
  border: 1px solid #B9D1E5;

  background: white;

  color: #0A2342;
}

.primary-button {
  border: none;

  background: #0A2342;

  color: white;
}

.primary-button:active,
.secondary-button:active {
  transform: scale(0.98);
}

/* ==========================================
   MENU TITIK TIGA
========================================== */

.menu-button {
  position: absolute;
  top: 48px;
  right: 18px;
  z-index: 20;

  width: 38px;
  height: 38px;

  border: none;
  border-radius: 50%;

  background: rgba(255,255,255,0.16);

  color: white;

  font-size: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 15;
}

.location-menu {
  position: absolute;
  top: 90px;
  right: 18px;
  z-index: 20;

  width: 180px;

  background: white;

  border: 1px solid #E2EDF8;
  border-radius: 16px;

  box-shadow: 0 10px 30px rgba(10, 35, 66, 0.2);

  overflow: hidden;
}

.location-menu-item {
  width: 100%;

  padding: 13px 16px;

  display: flex;
  align-items: center;
  gap: 10px;

  border: none;
  background: transparent;

  color: #0A2342;

  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  text-align: left;

  cursor: pointer;
}

.location-menu-item.danger {
  color: #C44B2A;
}

.location-menu-item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.location-menu-divider {
  height: 1px;
  margin: 0 12px;
  background: #E2EDF8;
}

/* ==========================================
   MODAL OVERLAY (dipakai delete & edit)
========================================== */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  background: rgba(10, 35, 66, 0.45);
}

/* ==========================================
   KONFIRMASI HAPUS
========================================== */

.delete-sheet {
  width: min(430px, 100%);
  box-sizing: border-box;

  padding: 24px 20px 28px;

  background: white;

  border-radius: 24px 24px 0 0;

  box-shadow: 0 -8px 30px rgba(10, 35, 66, 0.15);
}

.delete-icon {
  width: 48px;
  height: 48px;

  margin-bottom: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background: #FFE5D9;
  color: #C44B2A;

  font-size: 22px;
}

.delete-sheet h2 {
  margin: 0 0 8px;

  font-size: 19px;
  color: #0A2342;
}

.delete-sheet p {
  margin: 0 0 20px;

  color: #5C7A9A;
  font-size: 13px;
  line-height: 1.6;
}

.delete-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.delete-actions .cancel-button {
  height: 48px;
  border-radius: 14px;
  border: 1px solid #C8DCF0;
  background: white;
  color: #0A2342;
  font-weight: 600;
  font-size: 13px;
}

.delete-actions .delete-button {
  height: 48px;
  border-radius: 14px;
  border: none;
  background: #C44B2A;
  color: white;
  font-weight: 600;
  font-size: 13px;
}

/* ==========================================
   MODAL EDIT LOKASI
========================================== */

.edit-sheet {
  width: min(430px, 100%);
  box-sizing: border-box;

  padding: 22px 20px 25px;

  background: #EEF4FB;

  border-radius: 24px 24px 0 0;

  box-shadow: 0 -8px 30px rgba(10, 35, 66, 0.15);
}

.edit-sheet .modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 16px;
}

.edit-sheet .modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #0A2342;
}

.edit-sheet .close-button {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: #dce8f4;
  color: #0a2342;
  font-size: 22px;
}

.edit-error {
  margin: 0 0 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #FFE5D9;
  color: #C44B2A;
  font-size: 12px;
}

.edit-sheet .modal-label {
  display: block;
  margin: 12px 0 6px;
  color: #4d6f92;
  font-size: 11px;
  font-weight: 600;
}

.edit-sheet .modal-input {
  width: 100%;
  box-sizing: border-box;
  height: 43px;
  padding: 0 12px;
  border: 1px solid #dce8f4;
  border-radius: 11px;
  background: white;
  color: #0a2342;
  font-family: inherit;
  outline: none;
}

.edit-sheet .coordinate-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.save-edit-button {
  width: 100%;
  height: 48px;
  margin-top: 20px;
  border: none;
  border-radius: 14px;
  background: #0a2342;
  color: white;
  font-weight: 600;
  font-size: 14px;
}
</style>