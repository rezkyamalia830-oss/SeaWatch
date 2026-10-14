export interface MarineCurrentData {
  time: string
  waveHeight: number | null
  seaSurfaceTemperature: number | null
  oceanCurrentVelocity: number | null
  waveDirection: number | null
  wavePeriod: number | null
}

export const getMarineCurrent = async (
  latitude: number,
  longitude: number
): Promise<MarineCurrentData> => {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'wave_height',
      'sea_surface_temperature',
      'ocean_current_velocity',
      'wave_direction',
      'wave_period'
    ].join(','),
    timezone: 'auto',
    length_unit: 'metric'
  })

  const url =
    `https://marine-api.open-meteo.com/v1/marine?${params.toString()}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Marine API gagal: ${response.status}`
    )
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(
      data.reason || 'Marine API mengembalikan error.'
    )
  }

  return {
    time: data.current?.time ?? '',
    waveHeight:
      data.current?.wave_height ?? null,
    seaSurfaceTemperature:
      data.current?.sea_surface_temperature ?? null,
    oceanCurrentVelocity:
      data.current?.ocean_current_velocity ?? null,
    waveDirection:
      data.current?.wave_direction ?? null,
    wavePeriod:
      data.current?.wave_period ?? null
  }
}