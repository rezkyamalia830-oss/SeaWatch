export interface WebLocation {
  id: number
  name: string
  latitude: number
  longitude: number
  description: string
  created_at: string
}

export interface WebObservation {
  id: number
  location_id: number
  location: string
  observation_date: string
  water_condition: string
  waste_level: string
  marine_life: string
  weather_condition: string
  notes: string
  created_at: string
  updated_at: string
}

const LOCATIONS_KEY = 'seawatch_locations'
const OBSERVATIONS_KEY = 'seawatch_observations'

const defaultLocations: WebLocation[] = [
  {
    id: 1,
    name: 'T. Kendari',
    latitude: -3.9985,
    longitude: 122.5129,
    description: 'Teluk Kendari',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'P. Nambo',
    latitude: -4.0254,
    longitude: 122.5485,
    description: 'Pantai Nambo',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Tj. Tiram',
    latitude: -3.9588,
    longitude: 122.5734,
    description: 'Tanjung Tiram',
    created_at: new Date().toISOString()
  }
]

const getStoredLocations = (): WebLocation[] => {
  const stored = localStorage.getItem(LOCATIONS_KEY)

  if (!stored) {
    localStorage.setItem(
      LOCATIONS_KEY,
      JSON.stringify(defaultLocations)
    )

    return [...defaultLocations]
  }

  return JSON.parse(stored)
}

const getStoredObservations = (): WebObservation[] => {
  const stored = localStorage.getItem(OBSERVATIONS_KEY)

  if (!stored) {
    return []
  }

  return JSON.parse(stored)
}

export const getWebLocations = (): WebLocation[] => {
  return getStoredLocations()
}

export const addWebLocation = (
  name: string,
  latitude: number,
  longitude: number,
  description: string
) => {
  const locations = getStoredLocations()

  const nextId =
    locations.length > 0
      ? Math.max(...locations.map(item => item.id)) + 1
      : 1

  const newLocation: WebLocation = {
    id: nextId,
    name,
    latitude,
    longitude,
    description,
    created_at: new Date().toISOString()
  }

  locations.push(newLocation)

  localStorage.setItem(
    LOCATIONS_KEY,
    JSON.stringify(locations)
  )

  return newLocation.id
}

export const getWebObservations = (): WebObservation[] => {
  const observations = getStoredObservations()

  return observations
    .map(item => ({
      ...item,
      location:
        getStoredLocations().find(
          location => location.id === item.location_id
        )?.name ?? 'Lokasi tidak ditemukan'
    }))
    .sort(
      (a, b) =>
        new Date(b.observation_date).getTime() -
        new Date(a.observation_date).getTime()
    )
}

export const addWebObservation = (
  locationId: number,
  observationDate: string,
  waterCondition: string,
  wasteLevel: string,
  marineLife: string[],
  weatherCondition: string,
  notes: string
) => {
  const observations = getStoredObservations()

  const nextId =
    observations.length > 0
      ? Math.max(...observations.map(item => item.id)) + 1
      : 1

  const newObservation: WebObservation = {
    id: nextId,
    location_id: locationId,
    location:
      getStoredLocations().find(
        location => location.id === locationId
      )?.name ?? 'Lokasi tidak ditemukan',
    observation_date: observationDate,
    water_condition: waterCondition,
    waste_level: wasteLevel,
    marine_life: JSON.stringify(marineLife),
    weather_condition: weatherCondition,
    notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  observations.push(newObservation)

  localStorage.setItem(
    OBSERVATIONS_KEY,
    JSON.stringify(observations)
  )
}

export const clearWebData = () => {
  localStorage.removeItem(LOCATIONS_KEY)
  localStorage.removeItem(OBSERVATIONS_KEY)
}