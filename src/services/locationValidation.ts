export interface SeaValidationResult {
  valid: boolean
  message: string
}

export const validateSeaLocation = async (
  latitude: number,
  longitude: number
): Promise<SeaValidationResult> => {
  try {
    const radiusMeters = 3000 // toleransi ±3 km dari garis pantai

    const query = `
      [out:json][timeout:15];
      (
        way["natural"="coastline"](around:${radiusMeters},${latitude},${longitude});
        way["natural"="bay"](around:${radiusMeters},${latitude},${longitude});
        way["natural"="beach"](around:${radiusMeters},${latitude},${longitude});
        relation["natural"="bay"](around:${radiusMeters},${latitude},${longitude});
      );
      out ids 1;
    `

    const response = await fetch(
      'https://overpass-api.de/api/interpreter',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: query
      }
    )

    if (!response.ok) {
      throw new Error('Gagal memeriksa lokasi.')
    }

    const data = await response.json()

    const isNearCoast =
      Array.isArray(data?.elements) &&
      data.elements.length > 0

    if (!isNearCoast) {
      return {
        valid: false,
        message:
          `Koordinat tidak terdeteksi dekat garis pantai/laut (radius ${radiusMeters / 1000} km). Periksa kembali titik lokasi.`
      }
    }

    return {
      valid: true,
      message: 'Lokasi terdeteksi berada di area pesisir/laut.'
    }
  } catch (error) {
    console.error('Validasi lokasi laut gagal:', error)

    return {
      valid: false,
      message:
        'Lokasi tidak dapat diverifikasi. Periksa koneksi internet dan coba lagi.'
    }
  }
}