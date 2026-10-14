// src/services/aiRuleEngine.ts

// ==========================================
// TIPE DATA
// ==========================================

export interface ObservationForAI {
  id?: number
  location?: string | null
  observation_date?: string | null
  water_condition?: string | null
  waste_level?: string | null
  weather_condition?: string | null
  wave_height?: number | null
  marine_life?: string | null
  notes?: string | null
}

export interface AIAnalysisResult {
  summary: string
  waterTrend: string
  wasteTrend: string
  weatherWasteRelation: string
  waveCondition: string
  mostFrequentLocation: string
  recommendations: string[]
}


// ==========================================
// HELPER
// ==========================================

const normalize = (value: unknown): string => {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}


// ==========================================
// 1. RINGKASAN
// ==========================================

const analyzeSummary = (
  observations: ObservationForAI[]
): string => {

  if (observations.length === 0) {
    return 'Belum tersedia data observasi yang cukup untuk menghasilkan ringkasan.'
  }

  const totalObservations = observations.length

  const dates = new Set(
    observations
      .map(item => item.observation_date)
      .filter(Boolean)
  )

  const locations = new Set(
    observations
      .map(item => item.location)
      .filter(Boolean)
  )

  // Kondisi air yang paling sering
  const waterCounts: Record<string, number> = {}

  observations.forEach(item => {

    const condition =
      item.water_condition?.trim()

    if (!condition) return

    waterCounts[condition] =
      (waterCounts[condition] || 0) + 1
  })

  const dominantWater =
    Object.entries(waterCounts)
      .sort((a, b) => b[1] - a[1])[0]

  // Tingkat sampah yang paling sering
  const wasteCounts: Record<string, number> = {}

  observations.forEach(item => {

    const waste =
      item.waste_level?.trim()

    if (!waste) return

    wasteCounts[waste] =
      (wasteCounts[waste] || 0) + 1
  })

  const dominantWaste =
    Object.entries(wasteCounts)
      .sort((a, b) => b[1] - a[1])[0]

  const waterText = dominantWater
    ? `Kondisi air yang paling sering tercatat adalah ${dominantWater[0].toLowerCase()}`
    : 'Kondisi air belum memiliki data yang cukup'

  const wasteText = dominantWaste
    ? `tingkat sampah yang paling sering ditemukan adalah ${dominantWaste[0].toLowerCase()}`
    : 'tingkat sampah belum memiliki data yang cukup'

  return (
    `Berdasarkan ${totalObservations} observasi ` +
    `selama ${dates.size} hari pengamatan di ${locations.size} lokasi, ` +
    `${waterText}, sedangkan ${wasteText}.`
  )
}


// ==========================================
// 2. TREN KONDISI AIR
// ==========================================

const analyzeWaterTrend = (
  observations: ObservationForAI[]
): string => {

  const validObservations =
    observations.filter(
      item => item.water_condition
    )

  if (validObservations.length === 0) {
    return 'Belum tersedia data kondisi air yang cukup untuk dianalisis.'
  }

  const counts: Record<string, number> = {}

  validObservations.forEach(item => {

    const condition =
      item.water_condition!.trim()

    counts[condition] =
      (counts[condition] || 0) + 1
  })

  const sorted =
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])

  const dominant = sorted[0]

  const percentage =
    Math.round(
      (dominant[1] / validObservations.length) * 100
    )

  return (
    `Kondisi ${dominant[0].toLowerCase()} ` +
    `merupakan kondisi air yang paling sering teramati, ` +
    `dengan ${dominant[1]} dari ${validObservations.length} ` +
    `observasi (${percentage}%).`
  )
}


// ==========================================
// 3. TREN OBSERVASI SAMPAH
// ==========================================

const analyzeWasteTrend = (
  observations: ObservationForAI[]
): string => {

  const validObservations =
    observations.filter(
      item => item.waste_level
    )

  if (validObservations.length === 0) {
    return 'Belum tersedia data tingkat sampah yang cukup untuk dianalisis.'
  }

  const counts: Record<string, number> = {}

  validObservations.forEach(item => {

    const waste =
      item.waste_level!.trim()

    counts[waste] =
      (counts[waste] || 0) + 1
  })

  const sorted =
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])

  const dominant = sorted[0]

  const percentage =
    Math.round(
      (dominant[1] / validObservations.length) * 100
    )

  return (
    `Tingkat sampah ${dominant[0].toLowerCase()} ` +
    `merupakan kondisi yang paling sering tercatat, ` +
    `dengan ${dominant[1]} dari ${validObservations.length} ` +
    `observasi (${percentage}%).`
  )
}


// ==========================================
// 4. HUBUNGAN CUACA DAN SAMPAH
// ==========================================

const analyzeWeatherWasteRelation = (
  observations: ObservationForAI[]
): string => {

  const validObservations =
    observations.filter(
      item =>
        item.weather_condition &&
        item.waste_level
    )

  if (validObservations.length === 0) {
    return 'Belum tersedia data cuaca dan tingkat sampah yang cukup untuk melihat pola.'
  }

  // Menghitung kombinasi cuaca + sampah
  const combinations: Record<string, number> = {}

  validObservations.forEach(item => {

    const weather =
      normalize(item.weather_condition)

    const waste =
      normalize(item.waste_level)

    const key =
      `${weather}|${waste}`

    combinations[key] =
      (combinations[key] || 0) + 1
  })

  const sorted =
    Object.entries(combinations)
      .sort((a, b) => b[1] - a[1])

  const dominant = sorted[0]

  if (!dominant) {
    return 'Belum ditemukan pola hubungan cuaca dan tingkat sampah.'
  }

  const [weather, waste] =
    dominant[0].split('|')

  // Rule khusus: hujan + sampah tinggi
  if (
    weather.includes('hujan') &&
    waste.includes('tinggi')
  ) {

    return (
      `Sampah tinggi tercatat sebanyak ${dominant[1]} kali ` +
      `pada observasi dengan kondisi hujan. ` +
      `Data ini menunjukkan adanya pola kemunculan ` +
      `sampah tinggi bersamaan dengan kondisi hujan, ` +
      `namun tidak menunjukkan hubungan sebab-akibat.`
    )
  }

  return (
    `Kombinasi kondisi ${weather} dan tingkat sampah ` +
    `${waste} merupakan pola yang paling sering tercatat, ` +
    `sebanyak ${dominant[1]} observasi. ` +
    `Pola ini merupakan hubungan berdasarkan catatan observasi ` +
    `dan tidak menunjukkan hubungan sebab-akibat.`
  )
}


// ==========================================
// 5. KONDISI GELOMBANG
// ==========================================

const analyzeWaveCondition = (
  observations: ObservationForAI[]
): string => {

  const waveValues =
    observations
      .map(item => item.wave_height)
      .filter(
        (value): value is number =>
          value !== null &&
          value !== undefined &&
          Number.isFinite(Number(value))
      )
      .map(Number)

  if (waveValues.length === 0) {
    return 'Belum tersedia data tinggi gelombang yang cukup untuk dianalisis.'
  }

  const average =
    waveValues.reduce(
      (sum, value) => sum + value,
      0
    ) / waveValues.length

  const max =
    Math.max(...waveValues)

  const highWaveCount =
    waveValues.filter(
      value => value >= 1
    ).length

  let condition = 'rendah'

  if (average >= 1) {
    condition = 'tinggi'
  } else if (average >= 0.5) {
    condition = 'sedang'
  }

  let result =
    `Rata-rata tinggi gelombang yang tercatat adalah ` +
    `${average.toFixed(2)} meter dengan nilai tertinggi ` +
    `mencapai ${max.toFixed(2)} meter. ` +
    `Secara umum, kondisi gelombang berdasarkan rata-rata ` +
    `termasuk kategori ${condition}.`

  if (highWaveCount > 0) {

    result +=
      ` Terdapat ${highWaveCount} observasi ` +
      `dengan tinggi gelombang mencapai 1 meter atau lebih.`
  }

  return result
}


// ==========================================
// 6. LOKASI PALING SERING
// ==========================================

const analyzeMostFrequentLocation = (
  observations: ObservationForAI[]
): string => {

  const validObservations =
    observations.filter(
      item => item.location
    )

  if (validObservations.length === 0) {
    return 'Belum tersedia data lokasi yang cukup untuk dianalisis.'
  }

  const counts: Record<string, number> = {}

  validObservations.forEach(item => {

    const location =
      item.location!.trim()

    counts[location] =
      (counts[location] || 0) + 1
  })

  const sorted =
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])

  const dominant = sorted[0]

  const percentage =
    Math.round(
      (dominant[1] / validObservations.length) * 100
    )

  return (
    `${dominant[0]} merupakan lokasi dengan ` +
    `frekuensi observasi tertinggi, yaitu ${dominant[1]} ` +
    `dari ${validObservations.length} observasi (${percentage}%).`
  )
}


// ==========================================
// 7. SARAN OBSERVASI LANJUTAN
// ==========================================

const generateRecommendations = (
  observations: ObservationForAI[]
): string[] => {

  const recommendations: string[] = []

  // --------------------------------------
  // RULE A — DATA MASIH SEDIKIT
  // --------------------------------------

  if (observations.length < 5) {

    recommendations.push(
      'Tambahkan observasi secara berkala agar pola kondisi laut dapat dianalisis dengan lebih baik.'
    )
  }

  // --------------------------------------
  // RULE B — HUJAN + SAMPAH TINGGI
  // --------------------------------------

  const rainyHighWaste =
    observations.filter(item => {

      const weather =
        normalize(item.weather_condition)

      const waste =
        normalize(item.waste_level)

      return (
        weather.includes('hujan') &&
        waste.includes('tinggi')
      )

    }).length

  if (rainyHighWaste > 0) {

    recommendations.push(
      'Pantau tingkat sampah lebih sering setelah hujan untuk melihat perubahan kondisi di lokasi pengamatan.'
    )
  }

  // --------------------------------------
  // RULE C — DATA GELOMBANG
  // --------------------------------------

  const waveDataCount =
    observations.filter(
      item =>
        item.wave_height !== null &&
        item.wave_height !== undefined &&
        Number.isFinite(Number(item.wave_height))
    ).length

  if (
    observations.length > 0 &&
    waveDataCount < observations.length
  ) {

    recommendations.push(
      'Lengkapi pencatatan tinggi gelombang pada observasi berikutnya agar kondisi gelombang dapat dibandingkan.'
    )
  }

  // --------------------------------------
  // RULE D — LOKASI TERLALU TERPUSAT
  // --------------------------------------

  const locationCounts: Record<string, number> = {}

  observations.forEach(item => {

    if (!item.location) return

    const location =
      item.location.trim()

    locationCounts[location] =
      (locationCounts[location] || 0) + 1
  })

  const locationEntries =
    Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])

  if (locationEntries.length === 1) {

    recommendations.push(
      'Perluas pengamatan ke lokasi lain agar data kondisi laut lebih beragam.'
    )
  }

  // --------------------------------------
  // RULE E — KONDISI AIR KERUH
  // --------------------------------------

  const cloudyWaterCount =
    observations.filter(item =>
      normalize(item.water_condition)
        .includes('keruh')
    ).length

  if (
    observations.length > 0 &&
    cloudyWaterCount / observations.length >= 0.5
  ) {

    recommendations.push(
      'Lakukan pengamatan kondisi air lebih sering untuk memantau perubahan kekeruhan dari waktu ke waktu.'
    )
  }

  // --------------------------------------
  // DEFAULT
  // --------------------------------------

  if (recommendations.length === 0) {

    recommendations.push(
      'Lanjutkan observasi secara berkala untuk mempertahankan data pemantauan yang konsisten.'
    )

    recommendations.push(
      'Catat kondisi air, tingkat sampah, cuaca, dan tinggi gelombang pada setiap pengamatan.'
    )

    recommendations.push(
      'Lakukan pengamatan pada beberapa lokasi untuk mendapatkan gambaran kondisi laut yang lebih beragam.'
    )
  }

  // Maksimal 3 saran untuk UI
  return recommendations.slice(0, 3)
}


// ==========================================
// MAIN RULE ENGINE
// ==========================================

export const analyzeObservations = (
  observations: ObservationForAI[]
): AIAnalysisResult => {

  return {

    summary:
      analyzeSummary(observations),

    waterTrend:
      analyzeWaterTrend(observations),

    wasteTrend:
      analyzeWasteTrend(observations),

    weatherWasteRelation:
      analyzeWeatherWasteRelation(observations),

    waveCondition:
      analyzeWaveCondition(observations),

    mostFrequentLocation:
      analyzeMostFrequentLocation(observations),

    recommendations:
      generateRecommendations(observations)

  }
}

// ==========================================
// ANALISIS BERDASARKAN LOKASI
// ==========================================

export const analyzeLocationObservations = (
  observations: ObservationForAI[],
  locationName: string
): AIAnalysisResult => {

  const normalizedLocation =
    normalize(locationName)

  const locationObservations =
    observations.filter(item =>
      normalize(item.location) === normalizedLocation
    )

  return analyzeObservations(locationObservations)
}