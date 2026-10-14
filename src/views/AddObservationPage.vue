<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="app-container">

        <!-- HEADER -->
        <header class="top-bar">
          <button class="back-button" @click="goBack">
            <ion-icon :icon="arrowBackOutline" />
          </button>

          <h1>
  {{ isEditMode ? 'Edit Observasi' : 'Tambah Observasi' }}
</h1>

          <div class="header-space"></div>
        </header>

        <main class="content">

          <!-- ========================= -->
          <!-- LOKASI -->
          <!-- ========================= -->
          <section class="form-section">

            <label class="section-label">LOKASI</label>

            <div class="location-options">

              <button
                v-for="locationItem in locations"
                :key="locationItem.id"
                class="option-button"
                :class="{
                  'selected-navy':
                    selectedLocationId === locationItem.id
                }"
                @click="selectedLocationId = locationItem.id"
              >
                {{ locationItem.name }}
              </button>

              <!-- TAMBAH LOKASI -->
              <button
                class="option-button add-location-button"
                @click="showLocationForm = true"
              >
                <ion-icon :icon="addOutline" />
                <span>Tambah Lokasi</span>
              </button>

            </div>

          </section>

          <!-- ========================= -->
          <!-- TANGGAL -->
          <!-- ========================= -->
          <section class="form-section">

            <label class="section-label">TANGGAL</label>

            <input
              v-model="observationDate"
              class="date-input"
              type="date"
              :max="getToday()"
            />

          </section>

          <!-- ========================= -->
          <!-- KONDISI AIR -->
          <!-- ========================= -->
          <section class="form-section">

            <label class="section-label">KONDISI AIR</label>

            <div class="option-grid three-columns">

              <button
                v-for="condition in waterConditions"
                :key="condition"
                class="option-button"
                :class="{
                  'selected-cyan':
                    waterCondition === condition
                }"
                @click="waterCondition = condition"
              >
                {{ condition }}
              </button>

            </div>

          </section>

          <!-- ========================= -->
          <!-- TINGKAT SAMPAH -->
          <!-- ========================= -->
          <section class="form-section">

            <label class="section-label">TINGKAT SAMPAH</label>

            <div class="option-grid four-columns">

              <button
                v-for="level in wasteLevels"
                :key="level"
                class="option-button"
                :class="{
                  'selected-navy':
                    wasteLevel === level
                }"
                @click="wasteLevel = level"
              >
                {{ level }}
              </button>

            </div>

          </section>

          <!-- ========================= -->
          <!-- BIOTA LAUT -->
          <!-- ========================= -->
          <section class="form-section">

            <label class="section-label">
              BIOTA LAUT TERAMATI
            </label>

            <div class="option-grid four-columns">

              <button
                v-for="item in marineLifeOptions"
                :key="item"
                class="option-button"
                :class="{
                  'selected-cyan':
                    marineLife.includes(item)
                }"
                @click="toggleMarineLife(item)"
              >
                {{ item }}
              </button>

            </div>

          </section>

          <!-- ========================= -->
          <!-- CUACA -->
          <!-- ========================= -->
          <section class="form-section">

            <label class="section-label">
              KONDISI CUACA
            </label>

            <div class="option-grid four-columns">

              <button
                v-for="weather in weatherOptions"
                :key="weather"
                class="option-button"
                :class="{
                  'selected-navy':
                    weatherCondition === weather
                }"
                @click="weatherCondition = weather"
              >
                {{ weather }}
              </button>

            </div>

          </section>

          <!-- ========================= -->
          <!-- CATATAN -->
          <!-- ========================= -->
          <section class="form-section">

            <label class="section-label">
              CATATAN
            </label>

            <textarea
              v-model="notes"
              class="notes-input"
              placeholder="Deskripsikan observasi Anda..."
            ></textarea>

          </section>

          <!-- ========================= -->
          <!-- SIMPAN -->
          <!-- ========================= -->
          <button
  class="save-observation-button"
  @click="saveObservation"
>
  <ion-icon :icon="checkmarkOutline" />

  {{
    saved
      ? 'Observasi Tersimpan!'
      : isEditMode
        ? 'Simpan Perubahan'
        : 'Simpan Observasi'
  }}
</button>

        </main>

        <!-- ========================= -->
        <!-- MODAL TAMBAH LOKASI -->
        <!-- ========================= -->
        <div
          v-if="showLocationForm"
          class="modal-overlay"
          @click.self="closeLocationForm"
        >

          <div class="location-modal">

            <div class="modal-header">

              <div>
                <h2>Tambah Lokasi</h2>
                <p>Tambahkan lokasi pengamatan baru</p>
              </div>

              <button
                class="close-button"
                @click="closeLocationForm"
              >
                ×
              </button>

            </div>

            <!-- NAMA -->
            <label class="modal-label">
              Nama Lokasi
            </label>

            <input
              v-model="newLocation.name"
              class="modal-input"
              type="text"
              placeholder="Contoh: Pantai Toronipa"
            />

            <!-- KOORDINAT -->
            <div class="coordinate-row">

              <div>
                <label class="modal-label">
                  Latitude
                </label>

                <input
                  v-model="newLocation.latitude"
                  class="modal-input"
                  type="number"
                  step="any"
                  placeholder="-3.87"
                />
              </div>

              <div>
                <label class="modal-label">
                  Longitude
                </label>

                <input
                  v-model="newLocation.longitude"
                  class="modal-input"
                  type="number"
                  step="any"
                  placeholder="122.63"
                />
              </div>

            </div>

            <!-- DESKRIPSI -->
            <label class="modal-label">
              Deskripsi
            </label>

            <textarea
              v-model="newLocation.description"
              class="modal-textarea"
              placeholder="Deskripsi lokasi..."
            ></textarea>

            <!-- BUTTON -->
            <div class="modal-actions">

              <button
                class="cancel-button"
                @click="closeLocationForm"
              >
                Batal
              </button>

              <button
                class="modal-save-button"
                @click="addNewLocation"
              >
                Simpan Lokasi
              </button>

            </div>

          </div>

        </div>

        <!-- ========================= -->
        <!-- NOTIF SUKSES (AUTO HILANG) -->
        <!-- ========================= -->
        <div
          v-if="showSuccessToast"
          class="success-overlay"
        >
          <div class="success-card">
            <p>{{ successMessage }}</p>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import {
  IonPage,
  IonContent,
  IonIcon
} from '@ionic/vue'

import {
  arrowBackOutline,
  addOutline,
  checkmarkOutline
} from 'ionicons/icons'

import {
  ref,
  computed,
  watch,
  onMounted
} from 'vue'

import { useRouter, useRoute } from 'vue-router'

import {
  getLocations,
  addLocation,
  addObservation,
  getObservationById,
  updateObservation,
  isObservationEditable
} from '../data/database'

import {
  getMarineCurrent
} from '../data/marineApi'

import { validateSeaLocation } from '../services/locationValidation'


// ==========================================
// ROUTER
// ==========================================

const router = useRouter()
const route = useRoute()

const editingObservationId = ref<number | null>(null)
const originalObservationDate = ref('')

const isEditMode = computed(() => {
  return editingObservationId.value !== null
})

const goBack = () => {
  router.back()
}


// ==========================================
// VALIDASI KOORDINAT
// ==========================================

const validateCoordinates = (
  latitude: string | number,
  longitude: string | number
) => {

  const lat = Number(latitude)
  const lon = Number(longitude)

  if (latitude === '' || longitude === '') {
    return {
      valid: false,
      message:
        'Latitude dan longitude wajib diisi.'
    }
  }

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon)
  ) {
    return {
      valid: false,
      message:
        'Latitude dan longitude harus berupa angka.'
    }
  }

  if (lat < -90 || lat > 90) {
    return {
      valid: false,
      message:
        'Latitude harus berada antara -90 sampai 90.'
    }
  }

  if (lon < -180 || lon > 180) {
    return {
      valid: false,
      message:
        'Longitude harus berada antara -180 sampai 180.'
    }
  }

  return {
    valid: true,
    message: ''
  }
}


// ==========================================
// LOKASI
// ==========================================

interface Location {
  id: number
  name: string
  latitude: number
  longitude: number
  description: string
}

const locations = ref<Location[]>([])

const selectedLocationId =
  ref<number>(0)

const showLocationForm =
  ref(false)

const newLocation = ref({
  name: '',
  latitude: '',
  longitude: '',
  description: ''
})


// ==========================================
// DATA TINGGI GELOMBANG
// ==========================================

const waveHeight =
  ref<number | null>(null)

const waveLoading =
  ref(false)


// ==========================================
// AMBIL DATA TINGGI GELOMBANG
// ==========================================

const loadWaveHeight = async () => {

  if (!selectedLocationId.value) {
    waveHeight.value = null
    return
  }

  const selectedLocation =
    locations.value.find(
      location =>
        Number(location.id) ===
        Number(selectedLocationId.value)
    )

  if (!selectedLocation) {
    waveHeight.value = null
    return
  }

  waveLoading.value = true

  try {

    const marineData =
      await getMarineCurrent(
        Number(selectedLocation.latitude),
        Number(selectedLocation.longitude)
      )

    waveHeight.value =
      marineData.waveHeight

    console.log(
      '🌊 Tinggi gelombang:',
      marineData.waveHeight
    )

  } catch (error) {

    console.error(
      'Gagal mengambil tinggi gelombang:',
      error
    )

    waveHeight.value = null

  } finally {

    waveLoading.value = false

  }
}


// ==========================================
// KETIKA LOKASI BERUBAH
// ==========================================

watch(
  selectedLocationId,
  async () => {
    await loadWaveHeight()
  }
)


// ==========================================
// LOAD LOKASI DARI SQLITE
// ==========================================

const loadLocations = async () => {

  try {

    const data =
      await getLocations()

    locations.value =
      data as Location[]

    // ==============================
    // CEK APAKAH DATANG DARI DETAIL LOKASI
    // ==============================

    const locationIdFromQuery =
      Number(route.query.locationId)

    const isValidLocationFromQuery =
      Number.isFinite(locationIdFromQuery) &&
      locations.value.some(
        location => location.id === locationIdFromQuery
      )

    if (isValidLocationFromQuery && !selectedLocationId.value) {

      selectedLocationId.value = locationIdFromQuery

    } else if (
      locations.value.length > 0 &&
      !selectedLocationId.value
    ) {

      // Pilih lokasi pertama otomatis (perilaku lama,
      // dipakai kalau tidak datang dari detail lokasi)

      selectedLocationId.value =
        locations.value[0].id

    }

  } catch (error) {

    console.error(
      'Gagal mengambil lokasi dari SQLite:',
      error
    )

    alert(
      'Gagal memuat data lokasi.'
    )

  }
}


// ==========================================
// TAMBAH LOKASI BARU
// ==========================================

const addNewLocation = async () => {

  const name =
    newLocation.value.name.trim()

  const latitude =
    Number(
      newLocation.value.latitude
    )

  const longitude =
    Number(
      newLocation.value.longitude
    )

  const description =
    newLocation.value.description.trim()


  // ----------------------------------------
  // VALIDASI NAMA
  // ----------------------------------------

  if (!name) {

    alert(
      'Nama lokasi wajib diisi.'
    )

    return
  }


  // ----------------------------------------
  // VALIDASI KOORDINAT
  // ----------------------------------------

  if (
    !newLocation.value.latitude ||
    !newLocation.value.longitude ||
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  ) {

    alert(
      'Latitude dan longitude wajib diisi dengan angka.'
    )

    return
  }


  try {

    // --------------------------------------
    // VALIDASI RENTANG KOORDINAT
    // --------------------------------------

    const coordinateValidation =
      validateCoordinates(
        newLocation.value.latitude,
        newLocation.value.longitude
      )

    if (!coordinateValidation.valid) {

      alert(
        coordinateValidation.message
      )

      return
    }


    // --------------------------------------
    // KONVERSI KOORDINAT
    // --------------------------------------

    const lat =
      Number(
        newLocation.value.latitude
      )

    const lon =
      Number(
        newLocation.value.longitude
      )


    // --------------------------------------
    // VALIDASI LOKASI LAUT
    // --------------------------------------

    const seaValidation =
      await validateSeaLocation(
        lat,
        lon
      )

    if (!seaValidation.valid) {

      alert(
        seaValidation.message
      )

      return
    }


    // --------------------------------------
    // SIMPAN LOKASI KE SQLITE
    // --------------------------------------

    const newId =
      await addLocation(
        name,
        lat,
        lon,
        description ||
          'Lokasi pengamatan laut.'
      )


    // --------------------------------------
    // LOAD ULANG LOKASI
    // --------------------------------------

    await loadLocations()


    // --------------------------------------
    // PILIH LOKASI BARU
    // --------------------------------------

    if (newId) {

      selectedLocationId.value =
        Number(newId)

    }


    // --------------------------------------
    // RESET FORM
    // --------------------------------------

    newLocation.value = {
      name: '',
      latitude: '',
      longitude: '',
      description: ''
    }

    showLocationForm.value =
      false

  } catch (error) {

    console.error(
      'Gagal menambahkan lokasi:',
      error
    )

    alert(
      'Gagal menyimpan lokasi.'
    )

  }
}


// ==========================================
// TUTUP FORM LOKASI
// ==========================================

const closeLocationForm = () => {

  showLocationForm.value =
    false

  newLocation.value = {
    name: '',
    latitude: '',
    longitude: '',
    description: ''
  }

}


// ==========================================
// TANGGAL
// ==========================================

const getToday = () => {

  const today =
    new Date()

  const year =
    today.getFullYear()

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, '0')

  const day =
    String(
      today.getDate()
    ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const observationDate =
  ref(getToday())


// ==========================================
// KONDISI AIR
// ==========================================

const waterConditions = [
  'Jernih',
  'Agak Keruh',
  'Keruh'
]

const waterCondition =
  ref('')


// ==========================================
// TINGKAT SAMPAH
// ==========================================

const wasteLevels = [
  'Tidak Ada',
  'Rendah',
  'Sedang',
  'Tinggi'
]

const wasteLevel =
  ref('')


// ==========================================
// BIOTA LAUT
// ==========================================

const marineLifeOptions = [
  'Ikan',
  'Terumbu',
  'Rumput Laut',
  'Lainnya'
]

const marineLife =
  ref<string[]>([])

const toggleMarineLife = (
  item: string
) => {

  if (
    marineLife.value.includes(item)
  ) {

    marineLife.value =
      marineLife.value.filter(
        value =>
          value !== item
      )

  } else {

    marineLife.value.push(item)

  }

}


// ==========================================
// CUACA
// ==========================================

const weatherOptions = [
  'Cerah',
  'Berawan',
  'Berangin',
  'Hujan'
]

const weatherCondition =
  ref('')


// ==========================================
// CATATAN
// ==========================================

const notes =
  ref('')


// ==========================================
// STATUS SIMPAN
// ==========================================

const saved =
  ref(false)

const showSuccessToast = ref(false)
const successMessage = ref('')


// --------------------------------------
// SIMPAN / UPDATE OBSERVASI
// --------------------------------------

const saveObservation = async () => {

  // ==============================
  // VALIDASI
  // ==============================

  if (!selectedLocationId.value) {
    alert('Silakan pilih lokasi observasi.')
    return
  }

  if (!observationDate.value) {
    alert('Tanggal observasi wajib diisi.')
    return
  }

  if (observationDate.value > getToday()) {
    alert('Tanggal observasi tidak boleh lebih dari hari ini.')
    return
  }

  if (!waterCondition.value) {
    alert('Silakan pilih kondisi air.')
    return
  }

  if (!wasteLevel.value) {
    alert('Silakan pilih tingkat sampah.')
    return
  }

  if (!weatherCondition.value) {
    alert('Silakan pilih kondisi cuaca.')
    return
  }


  // ==============================
  // PROSES SIMPAN
  // ==============================

  try {

    // Jika tinggi gelombang belum tersedia,
    // ambil dari Marine API
    if (waveHeight.value === null) {
      await loadWaveHeight()
    }


    // ==============================
    // MODE EDIT
    // ==============================

    if (editingObservationId.value !== null) {

      // Cek kembali tanggal ASLI observasi.
      // Jangan menggunakan observationDate.value
      // supaya batas 5 bulan tidak bisa dilewati
      // dengan mengubah tanggal observasi.

      const editable = isObservationEditable(
        originalObservationDate.value
      )

      if (!editable) {

        alert(
          'Data observasi yang sudah lebih dari 5 bulan tidak dapat diedit.'
        )

        return
      }


      await updateObservation(

        editingObservationId.value,

        selectedLocationId.value,

        observationDate.value,

        waterCondition.value,

        wasteLevel.value,

        marineLife.value,

        weatherCondition.value,

        waveHeight.value,

        notes.value.trim()

      )


      // ==============================
      // BERHASIL UPDATE
      // ==============================

            saved.value = true

      successMessage.value = 'Observasi berhasil diperbarui.'
      showSuccessToast.value = true

      setTimeout(() => {
        showSuccessToast.value = false
      }, 1800)

      setTimeout(() => {

        router.push('/observations')

      }, 500)

      return
    }


    // ==============================
    // MODE TAMBAH
    // ==============================

    await addObservation(

      selectedLocationId.value,

      observationDate.value,

      waterCondition.value,

      wasteLevel.value,

      marineLife.value,

      weatherCondition.value,

      waveHeight.value,

      notes.value.trim()

    )


    // ==============================
    // BERHASIL SIMPAN
    // ==============================

    saved.value = true

successMessage.value = 'Observasi berhasil disimpan.'
showSuccessToast.value = true

setTimeout(() => {
      showSuccessToast.value = false
    }, 1800)


    // ==============================
    // KEMBALI KE OBSERVASI
    // ==============================

    setTimeout(() => {

      router.push('/observations')

    }, 500)


  } catch (error) {

    console.error(
      'Gagal menyimpan observasi:',
      error
    )

    alert(
      isEditMode.value
        ? 'Gagal memperbarui observasi.'
        : 'Gagal menyimpan observasi ke database.'
    )

  }

}

const loadObservationForEdit = async () => {
  const id = Number(route.query.id)

  if (
    !Number.isFinite(id) ||
    id <= 0
  ) {
    return
  }

  try {

    const observation =
      await getObservationById(id)

    if (!observation) {

      alert(
        'Data observasi tidak ditemukan.'
      )

      router.back()

      return
    }


    // ==============================
    // CEK BATAS 5 BULAN
    // ==============================

    const editable =
      isObservationEditable(
        observation.observation_date
      )

    if (!editable) {

      alert(
        'Observasi ini sudah lebih dari 5 bulan dan tidak dapat diedit.'
      )

      router.back()

      return
    }


    // ==============================
    // SET ID EDIT
    // ==============================

    editingObservationId.value =
      Number(observation.id)


    // ==============================
    // ISI FORM
    // ==============================

    selectedLocationId.value =
      Number(observation.location_id)

    observationDate.value =
      observation.observation_date

      originalObservationDate.value =
  observation.observation_date

    waterCondition.value =
      observation.water_condition ?? ''

    wasteLevel.value =
      observation.waste_level ?? ''

    weatherCondition.value =
      observation.weather_condition ?? ''

    notes.value =
      observation.notes ?? ''


    // ==============================
    // MARINE LIFE
    // ==============================

    if (observation.marine_life) {

      try {

        const parsed =
          JSON.parse(
            observation.marine_life
          )

        marineLife.value =
          Array.isArray(parsed)
            ? parsed
            : []

      } catch {

        marineLife.value = []

      }

    } else {

      marineLife.value = []

    }


    // ==============================
    // WAVE HEIGHT
    // ==============================

    if (
      observation.wave_height !== null &&
      observation.wave_height !== undefined
    ) {

      waveHeight.value =
        Number(
          observation.wave_height
        )

    } else {

      waveHeight.value = null

    }

  } catch (error) {

    console.error(
      'Gagal memuat observasi:',
      error
    )

    alert(
      'Gagal memuat data observasi.'
    )

    router.back()

  }
}


// ==========================================
// LOAD AWAL
// ==========================================

onMounted(async () => {

  await loadLocations()

  await loadObservationForEdit()

})



</script>


<style scoped>

ion-content {
  --background: #cbd5e1;
}


.app-container {
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  margin: 0 auto;

  background: #eef4fb;
  color: #0a2342;

  padding-bottom: 40px;
}


/* ==========================================
   HEADER
========================================== */

.top-bar {

  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:  calc(env(safe-area-inset-top, 0px) + 14px) 20px 14px;
  box-sizing: border-box;
}


.top-bar h1 {

  margin: 0;

  font-size: 18px;

  font-weight: 700;

}


.back-button {

  width: 40px;
  height: 40px;

  border: none;
  background: transparent;

  color: #0a2342;

  font-size: 25px;

}


.header-space {

  width: 40px;
  height: 40px;

}


/* ==========================================
   CONTENT
========================================== */

.content {

  padding: 0 20px 30px;

}


.form-section {

  margin-bottom: 20px;

}


.section-label {
  display: block;
  margin-bottom: 8px;
  color: #4d6f92;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;

}


/* ==========================================
   LOCATION
========================================== */

.location-options {

  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 10px;

}


.option-grid {

  display: grid;

  gap: 10px;

}


.three-columns {

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

}


.four-columns {

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

}


.option-button {

  min-height: 41px;

  padding: 8px 7px;

  border-radius: 12px;

  border: 1px solid #dce8f4;

  background: white;

  color: #416384;

  font-family: inherit;

  font-size: 12px;

  transition: 0.15s ease;

}


.option-button:active {

  transform: scale(0.97);

}


.selected-navy {

  background: #0a2342;

  border-color: #0a2342;

  color: white;

}


.selected-cyan {

  background: #d4eeff;

  border-color: #00b4d8;

  color: #007ea7;

}


.add-location-button {

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 5px;

  color: #007ea7;

  border: 1px dashed #00b4d8;

  background: #f7fcff;

}


.add-location-button ion-icon {

  font-size: 17px;

}


/* ==========================================
   DATE
========================================== */

.date-input {

  width: 100%;

  height: 43px;

  box-sizing: border-box;

  padding: 0 15px;

  border-radius: 12px;

  border: 1px solid #dce8f4;

  background: white;

  color: #0a2342;

  font-family: inherit;

  font-size: 13px;

  outline: none;

}


/* ==========================================
   NOTES
========================================== */

.notes-input {

  width: 100%;

  min-height: 110px;

  box-sizing: border-box;

  padding: 13px 15px;

  border-radius: 12px;

  border: 1px solid #dce8f4;

  background: white;

  color: #0a2342;

  font-family: inherit;

  font-size: 13px;

  resize: none;

  outline: none;

}


.notes-input::placeholder {

  color: #7b96b2;

}


/* ==========================================
   SAVE BUTTON
========================================== */

.save-observation-button {

  width: 100%;

  height: 52px;

  margin-top: 4px;

  border: none;

  border-radius: 14px;

  background: #0a2342;

  color: white;

  font-family: inherit;

  font-size: 14px;

  font-weight: 600;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

}


.save-observation-button ion-icon {

  font-size: 19px;

}


.save-observation-button:active {

  transform: scale(0.98);

}


/* ==========================================
   MODAL
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


.location-modal {

  width: min(430px, 100%);

  box-sizing: border-box;

  padding: 22px 20px 25px;

  background: #eef4fb;

  border-radius:
    24px 24px 0 0;

  box-shadow:
    0 -8px 30px
    rgba(10, 35, 66, 0.15);

}


.modal-header {

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  margin-bottom: 18px;

}


.modal-header h2 {

  margin: 0;

  font-size: 18px;

  color: #0a2342;

}


.modal-header p {

  margin: 4px 0 0;

  color: #6b86a2;

  font-size: 12px;

}


.close-button {

  width: 34px;
  height: 34px;

  border: none;

  border-radius: 50%;

  background: #dce8f4;

  color: #0a2342;

  font-size: 22px;

}


.modal-label {

  display: block;

  margin: 12px 0 6px;

  color: #4d6f92;

  font-size: 11px;

  font-weight: 600;

}


.modal-input,
.modal-textarea {

  width: 100%;

  box-sizing: border-box;

  border: 1px solid #dce8f4;

  border-radius: 11px;

  background: white;

  color: #0a2342;

  font-family: inherit;

  outline: none;

}


.modal-input {

  height: 43px;

  padding: 0 12px;

}


.modal-textarea {

  min-height: 75px;

  padding: 11px 12px;

  resize: none;

}


.coordinate-row {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;

}


.modal-actions {

  display: flex;

  gap: 10px;

  margin-top: 20px;

}


.cancel-button,
.modal-save-button {

  flex: 1;

  height: 45px;

  border: none;

  border-radius: 12px;

  font-family: inherit;

  font-weight: 600;

}


.cancel-button {

  background: #dce8f4;

  color: #0a2342;

}


.modal-save-button {

  background: #0a2342;

  color: white;

}

/* ==========================================
   NOTIF SUKSES (mirip alert bawaan, auto hilang)
========================================== */

.success-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(10, 35, 66, 0.35);
}

.success-card {
  width: min(300px, 85%);

  padding: 24px 20px;

  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 10px 30px rgba(10, 35, 66, 0.2);

  text-align: center;

  animation: successFadeIn 0.15s ease-out;
}

.success-card p {
  margin: 0;

  color: #0a2342;

  font-size: 15px;
  font-weight: 500;

  line-height: 1.4;
}

@keyframes successFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

</style>