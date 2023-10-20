export const BASE_URL = import.meta.env.VITE_API_URL;

export function getImage(uid: string) {
    return `${BASE_URL}/public/image/${uid}`;
}

export interface ApiResponse<T> {
    message: string
    data: T
}

export interface JenisKamar {
    id: number
    nama: string
    gambar: string
    short_desc: string
    rating: number
    fasilitas_unggulan: string[]
    fasilitas: KeyValue<string>
    rincian: string[]
    ukuran: number
    kapasitas: number
    harga_dasar: number
}

export interface LayananTambahan {
    id: number
    nama: string
    gambar: string
    short_desc: string
    satuan: string
    tarif: number
    created_at: Date
    updated_at: Date
}

interface KeyValue<T> {
    [key: string]: T
}