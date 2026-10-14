export interface WeatherCurrentData {
  time: string
  temperature: number | null
  humidity: number | null
  precipitation: number | null
  weatherCode: number | null
  windSpeed: number | null
  windDirection: number | null
}

export const getWeatherCurrent = async (
  latitude: number,
  longitude: number
): Promise<WeatherCurrentData> => {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),

    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m'
    ].join(','),

    timezone: 'auto',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm'
  })

  const url =
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Weather API gagal: ${response.status}`
    )
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(
      data.reason || 'Weather API mengembalikan error.'
    )
  }

  return {
    time: data.current?.time ?? '',
    temperature:
      data.current?.temperature_2m ?? null,
    humidity:
      data.current?.relative_humidity_2m ?? null,
    precipitation:
      data.current?.precipitation ?? null,
    weatherCode:
      data.current?.weather_code ?? null,
    windSpeed:
      data.current?.wind_speed_10m ?? null,
    windDirection:
      data.current?.wind_direction_10m ?? null
  }
}