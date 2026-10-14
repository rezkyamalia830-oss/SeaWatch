import { Capacitor } from '@capacitor/core'

import {
  getLocations,
  addLocation,
  getObservations,
  addObservation
} from './database'

import {
  getWebLocations,
  addWebLocation,
  getWebObservations,
  addWebObservation
} from './webStorage'

export const isNative = () => {
  return Capacitor.isNativePlatform()
}

export const getAppLocations = async () => {
  if (isNative()) {
    return await getLocations()
  }

  return getWebLocations()
}

export const addAppLocation = async (
  name: string,
  latitude: number,
  longitude: number,
  description: string
) => {
  if (isNative()) {
    return await addLocation(
      name,
      latitude,
      longitude,
      description
    )
  }

  return addWebLocation(
    name,
    latitude,
    longitude,
    description
  )
}

export const getAppObservations = async () => {
  if (isNative()) {
    return await getObservations()
  }

  return getWebObservations()
}

export const addAppObservation = async (
  locationId: number,
  observationDate: string,
  waterCondition: string,
  wasteLevel: string,
  marineLife: string[],
  weatherCondition: string,
  waveHeight: number,
  notes: string
) => {
  if (isNative()) {
    return await addObservation(
      locationId,
      observationDate,
      waterCondition,
      wasteLevel,
      marineLife,
      weatherCondition,
      waveHeight,
      notes
    )
  }

  return addWebObservation(
    locationId,
    observationDate,
    waterCondition,
    wasteLevel,
    marineLife,
    weatherCondition,
    notes
  )
}