<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="page-wrapper">
        <!-- =========================
             TOP BAR
        ========================== -->
        <div class="top-bar">
          <button
            type="button"
            class="back-button"
            @click="goBack"
            aria-label="Kembali"
          >
            <ion-icon :icon="arrowBackOutline" />
          </button>
        </div>

        <!-- =========================
             CONTENT
        ========================== -->
        <div class="content">
          <!-- =========================
               HEADER AI
          ========================== -->
          <div class="ai-header-card">
            <div class="ai-header-top">
              <div class="ai-icon">
                <ion-icon :icon="sparklesOutline" />
              </div>

              <div>
                <p class="ai-title">Analisis AI Kelautan</p>

                <p class="ai-subtitle">Pengenalan pola dari catatan Anda</p>
              </div>
            </div>

            <!-- Statistik -->
            <div class="stats-row">
              <div class="stat-box">
                <p class="stat-number">
                  {{ totalObservations }}
                </p>

                <p class="stat-label">Observasi</p>
              </div>

              <div class="stat-box">
                <p class="stat-number">
                  {{ totalDays }}
                </p>

                <p class="stat-label">Hari</p>
              </div>

              <div class="stat-box">
                <p class="stat-number">
                  {{ totalLocations }}
                </p>

                <p class="stat-label">Lokasi</p>
              </div>
            </div>
          </div>

          <!-- =========================
               PERINGATAN
          ========================== -->
          <div class="ai-warning">
            <ion-icon :icon="informationCircleOutline" />

            <p>
              Wawasan AI didasarkan pada observasi yang Anda catat saja — bukan
              diagnosis ilmiah.
            </p>
          </div>

          <!-- =========================
               LOADING
          ========================== -->
          <div v-if="loading" class="loading-card">
            <div class="loading-spinner"></div>

            <p>Menganalisis data observasi...</p>
          </div>

          <!-- =========================
               HASIL ANALISIS
          ========================== -->
          <template v-else>
            <!-- 1. RINGKASAN -->
            <div class="analysis-card summary-card">
              <div class="card-title-row">
                <div class="title-line"></div>

                <p>Ringkasan</p>
              </div>

              <p class="analysis-text">
                {{ analysis.summary }}
              </p>
            </div>

            <!-- 2. TREN KONDISI AIR -->
            <div class="analysis-card">
              <div class="analysis-heading">
                <div class="analysis-icon cyan">
                  <ion-icon :icon="waterOutline" />
                </div>

                <p>Tren Kondisi Air</p>
              </div>

              <p class="analysis-text">
                {{ analysis.waterTrend }}
              </p>
            </div>

            <!-- 3. TREN SAMPAH -->
            <div class="analysis-card">
              <div class="analysis-heading">
                <div class="analysis-icon orange">
                  <ion-icon :icon="trashOutline" />
                </div>

                <p>Tren Observasi Sampah</p>
              </div>

              <p class="analysis-text">
                {{ analysis.wasteTrend }}
              </p>
            </div>

            <!-- 4. CUACA + SAMPAH -->
            <div class="analysis-card">
              <div class="analysis-heading">
                <div class="analysis-icon yellow">
                  <ion-icon :icon="rainyOutline" />
                </div>

                <p>Hubungan Cuaca dan Sampah</p>
              </div>

              <p class="analysis-text">
                {{ analysis.weatherWasteRelation }}
              </p>
            </div>

            <!-- 5. GELOMBANG -->
            <div class="analysis-card">
              <div class="analysis-heading">
                <div class="analysis-icon blue">
                  <ion-icon :icon="boatOutline" />
                </div>

                <p>Kondisi Gelombang</p>
              </div>

              <p class="analysis-text">
                {{ analysis.waveCondition }}
              </p>
            </div>

            <!-- 6. LOKASI -->
            <div class="analysis-card">
              <div class="analysis-heading">
                <div class="analysis-icon cyan">
                  <ion-icon :icon="locationOutline" />
                </div>

                <p>Lokasi Paling Sering</p>
              </div>

              <p class="analysis-text">
                {{ analysis.mostFrequentLocation }}
              </p>
            </div>

            <!-- 7. SARAN -->
            <div class="analysis-card recommendation-card">
              <p class="recommendation-title">Saran Observasi Lanjutan</p>

              <div class="recommendation-list">
                <div
                  v-for="(recommendation, index) in analysis.recommendations"
                  :key="index"
                  class="recommendation-item"
                >
                  <div class="recommendation-number">
                    {{ index + 1 }}
                  </div>

                  <p>
                    {{ recommendation }}
                  </p>
                </div>
              </div>
            </div>

            <!-- =========================
                 ANALISIS ULANG
            ========================== -->
            <button
              type="button"
              class="reanalyze-button"
              :disabled="reanalyzing"
              @click="reanalyze"
            >
              <span v-if="reanalyzing" class="button-loading">
                <span class="small-spinner"></span>
                Menganalisis…
              </span>

              <span v-else> Analisis Ulang Observasi </span>
            </button>
          </template>
        </div>

        <!-- =========================
             BOTTOM NAV
        ========================== -->
        <nav class="bottom-nav">
          <button type="button" class="nav-item" @click="goTo('/')">
            <ion-icon :icon="homeOutline" />
            <span>Beranda</span>
          </button>

          <button type="button" class="nav-item" @click="goTo('/observations')">
            <ion-icon :icon="clipboardOutline" />
            <span>Observasi</span>
          </button>

          <button type="button" class="nav-item" @click="goTo('/locations')">
            <ion-icon :icon="locationOutline" />
            <span>Lokasi</span>
          </button>

          <button
            type="button"
            class="nav-item active"
            @click="goTo('/statistics')"
          >
            <ion-icon :icon="barChartOutline" />
            <span>Statistik</span>
          </button>
        </nav>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon, onIonViewWillEnter } from "@ionic/vue";

import {
  arrowBackOutline,
  sparklesOutline,
  informationCircleOutline,
  waterOutline,
  trashOutline,
  rainyOutline,
  boatOutline,
  locationOutline,
  homeOutline,
  clipboardOutline,
  barChartOutline,
} from "ionicons/icons";

import { ref, computed } from "vue";

import { useRouter } from "vue-router";

import { getObservations } from "../data/database";

import {
  analyzeObservations,
  type AIAnalysisResult,
  type ObservationForAI,
} from "../services/aiRuleEngine";

// ==========================================
// ROUTER
// ==========================================

const router = useRouter();

// ==========================================
// STATE
// ==========================================

const observations = ref<ObservationForAI[]>([]);

const loading = ref(false);

const reanalyzing = ref(false);

// ==========================================
// HASIL ANALISIS
// ==========================================

const analysis = ref<AIAnalysisResult>(analyzeObservations([]));

// ==========================================
// STATISTIK HEADER
// ==========================================

const totalObservations = computed(() => observations.value.length);

const totalDays = computed(() => {
  const dates = new Set(
    observations.value.map((item) => item.observation_date).filter(Boolean),
  );

  return dates.size;
});

const totalLocations = computed(() => {
  const locations = new Set(
    observations.value.map((item) => item.location).filter(Boolean),
  );

  return locations.size;
});

// ==========================================
// LOAD DATA
// ==========================================

const loadAnalysis = async () => {
  try {
    loading.value = true;

    const data = await getObservations();

    observations.value = data.map((item) => ({
      id: item.id,
      location: item.location,
      observation_date: item.observation_date,
      water_condition: item.water_condition,
      waste_level: item.waste_level,
      weather_condition: item.weather_condition,
      wave_height:
        item.wave_height !== null && item.wave_height !== undefined
          ? Number(item.wave_height)
          : null,
      marine_life: item.marine_life,
      notes: item.notes,
    }));

    // ==================================
    // JALANKAN RULE ENGINE
    // ==================================

    analysis.value = analyzeObservations(observations.value);
  } catch (error) {
    console.error("Gagal menganalisis data:", error);
  } finally {
    loading.value = false;
  }
};

// ==========================================
// ANALISIS ULANG
// ==========================================

const reanalyze = async () => {
  const startTime = Date.now();

  reanalyzing.value = true;

  // Beri Vue kesempatan merender tombol loading
  await new Promise(resolve => setTimeout(resolve, 50));

  try {
    await loadAnalysis();
  } finally {
    const elapsed = Date.now() - startTime;
    const minimumLoadingTime = 1000;

    if (elapsed < minimumLoadingTime) {
      await new Promise(resolve =>
        setTimeout(resolve, minimumLoadingTime - elapsed)
      );
    }

    reanalyzing.value = false;
  }
};

// ==========================================
// NAVIGATION
// ==========================================

const goBack = () => {
  router.push("/statistics");
};

const goTo = (path: string) => {
  router.push(path);
};

// ==========================================
// LOAD SAAT HALAMAN DIBUKA
// ==========================================

onIonViewWillEnter(async () => {
  await loadAnalysis();
});
</script>

<style scoped>
/* ==========================================
   PAGE
========================================== */

.page-wrapper {
  min-height: 100%;
  background: #eef4fb;
  color: #0a2342;
  padding-top: env(safe-area-inset-top);
  padding-bottom: calc(96px + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

/* ==========================================
   TOP BAR
========================================== */

.top-bar {
  height: 58px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  background: #FFFFFF;
  border-bottom: 1px solid #E2EDF8;
  box-sizing: border-box;
}

.top-bar h1 {
  margin: 0;
  font-family: "DM Serif Display", serif;
  font-size: 23px;
  font-weight: 400;
  color: #0a2342;
}

.back-button {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: #EEF4FB;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0A2342;
  font-size: 21px;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 2px 7px rgba(10, 35, 66, 0.08);
  transition: transform 0.15s ease, background 0.15s ease;
}

.back-button:active {
  transform: scale(0.92);
  background: #DDEAF6;
}

/* ==========================================
   CONTENT
========================================== */

.content {
  padding: 18px 20px 30px;
}

/* ==========================================
   AI HEADER
========================================== */

.ai-header-card {
  background: linear-gradient(135deg, #0a2342 0%, #0e3a6b 100%);

  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(10, 35, 66, 0.12);
}

.ai-header-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.ai-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(0, 180, 216, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00b4d8;
  font-size: 22px;
}

.ai-title {
  margin: 0;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

.ai-subtitle {
  margin: 3px 0 0;
  color: #90c4e8;
  font-size: 12px;
}

/* ==========================================
   STATISTICS
========================================== */

.stats-row {
  display: flex;
  gap: 10px;
}

.stat-box {
  flex: 1;
  padding: 12px 8px;
  text-align: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}

.stat-number {
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
}

.stat-label {
  margin: 3px 0 0;
  color: #90c4e8;
  font-size: 10px;
}

/* ==========================================
   WARNING
========================================== */

.ai-warning {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-top: 14px;
  padding: 11px 12px;
  border-radius: 12px;
  background: #fff3cd;
  color: #8b6914;
}

.ai-warning ion-icon {
  flex-shrink: 0;
  margin-top: 1px;
  font-size: 18px;
}

.ai-warning p {
  margin: 0;
  font-size: 11px;
  line-height: 1.55;
}

/* ==========================================
   ANALYSIS CARD
========================================== */

.analysis-card {
  margin-top: 14px;
  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e2edf8;
  box-shadow: 0 3px 10px rgba(10, 35, 66, 0.04);
}

.summary-card {
  border-color: rgba(0, 180, 216, 0.3);
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 11px;
}

.title-line {
  width: 6px;
  height: 21px;
  border-radius: 10px;
  background: #00b4d8;
}

.card-title-row p {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #0a2342;
}

/* ==========================================
   ANALYSIS HEADING
========================================== */

.analysis-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.analysis-heading > p {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #0a2342;
}

.analysis-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.analysis-icon.cyan {
  background: rgba(0, 180, 216, 0.12);
  color: #00b4d8;
}

.analysis-icon.orange {
  background: rgba(244, 162, 97, 0.15);
  color: #f4a261;
}

.analysis-icon.yellow {
  background: rgba(255, 193, 7, 0.15);
  color: #c58b00;
}

.analysis-icon.blue {
  background: rgba(72, 202, 228, 0.15);
  color: #1897b3;
}

/* ==========================================
   TEXT
========================================== */

.analysis-text {
  margin: 0;
  color: #5c7a9a;
  font-size: 13px;
  line-height: 1.65;
}

/* ==========================================
   RECOMMENDATION
========================================== */

.recommendation-title {
  margin: 0 0 13px;
  color: #0a2342;
  font-size: 14px;
  font-weight: 600;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.recommendation-item p {
  margin: 1px 0 0;
  color: #0a2342;
  font-size: 13px;
  line-height: 1.55;
}

.recommendation-number {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #d4eeff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #007ea7;
  font-size: 10px;
  font-weight: 700;
}

/* ==========================================
   LOADING
========================================== */

.loading-card {
  margin-top: 14px;
  padding: 40px 20px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e2edf8;
  text-align: center;
}

.loading-card p {
  margin: 14px 0 0;
  color: #5c7a9a;
  font-size: 13px;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  margin: 0 auto;
  border: 3px solid #d4eeff;
  border-top-color: #00b4d8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ==========================================
   REANALYZE BUTTON
========================================== */

.reanalyze-button {
  width: 100%;
  height: 52px;
  margin-top: 16px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #00b4d8, #0a2342);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  box-shadow: 0 7px 16px rgba(10, 35, 66, 0.12);
}

.reanalyze-button:disabled {
  opacity: 0.85;
}

.button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.small-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* ==========================================
   BOTTOM NAV
========================================== */

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
    10px
    8px
    calc(13px + env(safe-area-inset-bottom));

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
  color: #5c7a9a;
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
  color: #00b4d8;
}

.nav-item.active span {
  font-weight: 600;
}

/* ==========================================
   ANIMATION
========================================== */

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ==========================================
   MOBILE
========================================== */

@media (max-width: 430px) {
  .top-bar {
    padding: 0 18px;
  }

  .content {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
