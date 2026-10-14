import {
  CapacitorSQLite,
  SQLiteConnection,
  type SQLiteDBConnection
} from '@capacitor-community/sqlite'

const sqlite = new SQLiteConnection(CapacitorSQLite)

let db: SQLiteDBConnection | null = null

export const initDatabase = async () => {
  if (db) {
    return db
  }

  db = await sqlite.createConnection(
    'seawatch',
    false,
    'no-encryption',
    1,
    false
  )

  await db.open()

  await db.execute(`
  ALTER TABLE observations
  ADD COLUMN wave_height REAL;
`).catch(() => {})

  await db.execute(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS observations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location_id INTEGER NOT NULL,
      observation_date TEXT NOT NULL,
      water_condition TEXT NOT NULL,
      waste_level TEXT NOT NULL,
      marine_life TEXT,
      weather_condition TEXT,
      notes TEXT,
      wave_height REAL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT,
      FOREIGN KEY (location_id)
        REFERENCES locations(id)
        ON DELETE CASCADE
    );
  `)

  // ==========================================
  // DATA LOKASI AWAL
  // ==========================================

  return db
  }
// ==========================================
// GET DATABASE
// ==========================================

export const getDatabase = async () => {
  if (!db) {
    await initDatabase()
  }

  return db!
}

// ==========================================
// GET LOCATIONS
// ==========================================

export const getLocations = async () => {
  const database = await getDatabase()

  const result = await database.query(`
    SELECT
      id,
      name,
      latitude,
      longitude,
      description,
      created_at
    FROM locations
    ORDER BY id ASC
  `)

  return result.values ?? []
}

// ==========================================
// ADD LOCATION
// ==========================================

export const addLocation = async (
  name: string,
  latitude: number,
  longitude: number,
  description: string
) => {
  const database = await getDatabase()

  const result = await database.run(
    `
      INSERT INTO locations (
        name,
        latitude,
        longitude,
        description
      )
      VALUES (?, ?, ?, ?)
    `,
    [
      name,
      latitude,
      longitude,
      description
    ]
  )

  return result.changes?.lastId
}

// ==========================================
// GET OBSERVATIONS
// ==========================================

export const getObservations = async () => {
  const database = await getDatabase()

  const result = await database.query(`
    SELECT
      observations.id,
      observations.location_id,
      locations.name AS location,
      observations.observation_date,
      observations.water_condition,
      observations.waste_level,
      observations.marine_life,
      observations.weather_condition,
      observations.notes,
      observations.wave_height,
      observations.created_at,
      observations.updated_at
    FROM observations
    INNER JOIN locations
      ON locations.id = observations.location_id
    ORDER BY observations.observation_date DESC
  `)

  return result.values ?? []
}

// ==========================================
// ADD OBSERVATION
// ==========================================

export const addObservation = async (
  locationId: number,
  observationDate: string,
  waterCondition: string,
  wasteLevel: string,
  marineLife: string[],
  weatherCondition: string,
  waveHeight: number | null,
  notes: string
) => {
  const database = await getDatabase()

  await database.run(
    `
      INSERT INTO observations (
        location_id,
        observation_date,
        water_condition,
        waste_level,
        marine_life,
        weather_condition,
        wave_height,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      locationId,
      observationDate,
      waterCondition,
      wasteLevel,
      JSON.stringify(marineLife),
      weatherCondition,
      waveHeight,
      notes
    ]
  )
}
/// ==========================================
// SEED DATA RIWAYAT SEMUA LOKASI
// ==========================================

export const seedHistoryData = async () => {
  const database = await getDatabase()

  // Ambil SEMUA lokasi
  const locationResult = await database.query(`
    SELECT
      id,
      name
    FROM locations
    ORDER BY id ASC
  `)

  const locations = locationResult.values ?? []

  if (locations.length === 0) {
    console.log('Belum ada lokasi.')
    return
  }

  // Pola data observasi
  const historyTemplate = [
    {
      date: '2024-09-10',
      water: 'Agak Keruh',
      waste: 'Rendah',
      marineLife: ['Ikan kecil', 'Rumput laut'],
      weather: 'Cerah',
      wave: 0.8,
      notes: 'Kondisi laut cukup tenang.'
    },
    {
      date: '2024-09-11',
      water: 'Jernih',
      waste: 'Rendah',
      marineLife: ['Ikan kecil'],
      weather: 'Cerah',
      wave: 1.1,
      notes: 'Gelombang sedikit meningkat.'
    },
    {
      date: '2024-09-12',
      water: 'Agak Keruh',
      waste: 'Sedang',
      marineLife: ['Ikan kecil', 'Rumput laut'],
      weather: 'Berawan',
      wave: 0.9,
      notes: 'Kondisi air cukup stabil.'
    },
    {
      date: '2024-09-14',
      water: 'Jernih',
      waste: 'Tidak Ada',
      marineLife: ['Ikan kecil', 'Rumput laut'],
      weather: 'Cerah',
      wave: 0.6,
      notes: 'Kondisi laut relatif baik.'
    }
  ]

  // ==========================================
  // BUAT RIWAYAT UNTUK SETIAP LOKASI
  // ==========================================

  for (const location of locations) {
    const locationId = Number(location.id)

    console.log(
      `Memeriksa riwayat lokasi: ${location.name}`
    )

    for (const observation of historyTemplate) {

      // Cek apakah observasi tanggal tersebut
      // sudah ada untuk lokasi ini
      const existingResult = await database.query(
        `
          SELECT id
          FROM observations
          WHERE location_id = ?
          AND observation_date = ?
          LIMIT 1
        `,
        [
          locationId,
          observation.date
        ]
      )

      const existing =
        existingResult.values?.[0]

      if (existing) {

        // Kalau observasi sudah ada,
        // pastikan tinggi gelombangnya ada
        await database.run(
          `
            UPDATE observations
            SET wave_height = ?
            WHERE id = ?
          `,
          [
            observation.wave,
            existing.id
          ]
        )

      } else {

        // Kalau belum ada, buat observasi baru
        await database.run(
          `
            INSERT INTO observations (
              location_id,
              observation_date,
              water_condition,
              waste_level,
              marine_life,
              weather_condition,
              wave_height,
              notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            locationId,
            observation.date,
            observation.water,
            observation.waste,
            JSON.stringify(
              observation.marineLife
            ),
            observation.weather,
            observation.wave,
            observation.notes
          ]
        )
      }
    }

    console.log(
      `✓ Riwayat ${location.name} selesai`
    )
  }

  console.log(
    '✓ Seed riwayat SEMUA lokasi selesai.'
  )
}



export const deleteObservationsByYear = async (year: number) => {
  const database = await getDatabase()

  await database.run(
    `
      DELETE FROM observations
      WHERE observation_date LIKE ?
    `,
    [`${year}-%`]
  )

  console.log(`✓ Data observasi tahun ${year} berhasil dihapus.`)
}

// ==========================================
// UPDATE OBSERVATION
// ==========================================

export const updateObservation = async (
  id: number,
  locationId: number,
  observationDate: string,
  waterCondition: string,
  wasteLevel: string,
  marineLife: string[],
  weatherCondition: string,
  waveHeight: number | null,
  notes: string
) => {
  const database = await getDatabase()

  await database.run(
    `
      UPDATE observations
      SET
        location_id = ?,
        observation_date = ?,
        water_condition = ?,
        waste_level = ?,
        marine_life = ?,
        weather_condition = ?,
        wave_height = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [
      locationId,
      observationDate,
      waterCondition,
      wasteLevel,
      JSON.stringify(marineLife),
      weatherCondition,
      waveHeight,
      notes,
      id
    ]
  )

  console.log(`✓ Observasi ${id} berhasil diperbarui.`)
}


// ==========================================
// DELETE OBSERVATION
// ==========================================

export const deleteObservation = async (
  id: number
) => {
  const database = await getDatabase()

  await database.run(
    `
      DELETE FROM observations
      WHERE id = ?
    `,
    [id]
  )

  console.log(`✓ Observasi ${id} berhasil dihapus.`)
}

// ==========================================
// CHECK EDITABLE OBSERVATION
// ==========================================

export const isObservationEditable = (
  observationDate: string
) => {
  const observation = new Date(
    `${observationDate}T00:00:00`
  )

  const today = new Date()

  const cutoffDate = new Date(today)

  cutoffDate.setHours(0, 0, 0, 0)

  cutoffDate.setMonth(
    cutoffDate.getMonth() - 5
  )

  return observation >= cutoffDate
}

export const getObservationById = async (
  id: number
) => {
  const database = await getDatabase()

  const result = await database.query(
    `
      SELECT
        observations.id,
        observations.location_id,
        locations.name AS location,
        observations.observation_date,
        observations.water_condition,
        observations.waste_level,
        observations.marine_life,
        observations.weather_condition,
        observations.wave_height,
        observations.notes,
        observations.created_at,
        observations.updated_at
      FROM observations
      INNER JOIN locations
        ON locations.id = observations.location_id
      WHERE observations.id = ?
      LIMIT 1
    `,
    [id]
  )

  return result.values?.[0] ?? null
}

// ==========================================
// UPDATE LOCATION
// ==========================================

export const updateLocation = async (
  id: number,
  name: string,
  latitude: number,
  longitude: number,
  description: string
) => {
  const database = await getDatabase()

  await database.run(
    `
      UPDATE locations
      SET
        name = ?,
        latitude = ?,
        longitude = ?,
        description = ?
      WHERE id = ?
    `,
    [
      name,
      latitude,
      longitude,
      description,
      id
    ]
  )

  console.log(`✓ Lokasi ${id} berhasil diperbarui.`)
}

// ==========================================
// DELETE LOCATION
// ==========================================

export const deleteLocation = async (
  id: number
) => {
  const database = await getDatabase()

  // Hapus observasi terkait secara eksplisit
  // (selain ON DELETE CASCADE di skema, ini
  // jaga-jaga supaya tetap bersih meskipun
  // PRAGMA foreign_keys tidak aktif di sesi ini).
  await database.run(
    `
      DELETE FROM observations
      WHERE location_id = ?
    `,
    [id]
  )

  await database.run(
    `
      DELETE FROM locations
      WHERE id = ?
    `,
    [id]
  )

  console.log(`✓ Lokasi ${id} dan observasi terkait berhasil dihapus.`)
}