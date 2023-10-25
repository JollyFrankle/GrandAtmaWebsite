export const BASE_URL = import.meta.env.VITE_API_URL;

export function getImage(uid: string) {
    return `${BASE_URL}/public/image/${uid}`;
}

export interface ApiResponse<T> {
    message: string
    data: T
}

export interface ApiErrorResponse {
    message: string
    errors: KeyValue<string>|null
}

export interface JenisKamar {
    id: number
    nama: string
    gambar: string
    short_desc: string
    rating: number
    fasilitas_unggulan: any
    fasilitas: any
    rincian: any
    ukuran: number
    kapasitas: number
    harga_dasar: number
}

export interface FasilitasLayananTambahan {
    id: number
    nama: string
    gambar: string|null
    short_desc: string
    satuan: string
    tarif: number
    created_at: string
    updated_at: string
}

export interface UserCustomer {
    id: number
    type: 'p' | 'g'
    nama: string
    nama_institusi?: string
    no_identitas: string
    jenis_identitas: string
    no_telp: string
    email: string
    alamat: string
    password?: string
    password_last_changed?: string
}

export interface UserPegawai {
    id: number
    role: string
    nama: string
    email: string
    password?: string
}

export interface Reservasi {
    id: number
    id_customer: number
    id_sm: number|null
    id_booking: string|null
    arrival_date: string
    checked_in: string|null
    checked_out: string|null
    jumlah_malam: number
    jumlah_dewasa: number
    jumlah_anak: number
    tanggal_dp: string|null
    jumlah_dp: number|null
    status: string
    total: number
    deposit: number
    permintaan_tambahan: string|null
    created_at: string
    updated_at: string
    bukti_transfer: string|null
    reservasi_layanan?: ReservasiLayanan[]
    reservasi_rooms?: ReservasiRoom[]
    invoice?: Invoice
}

export interface ReservasiLayanan {
    id: number
    id_reservasi: number
    id_layanan: number
    tanggal_pakai: string
    qty: number
    total: number
    layanan_tambahan?: FasilitasLayananTambahan
}

export interface ReservasiRoom {
    id: number
    id_reservasi: number
    no_kamar: string
    id_jenis_kamar: number
    harga_per_malam: number
    jenis_kamar?: JenisKamar
    // kamar?: Kamar
}

export interface Invoice {
    id_reservasi: number
    id_fo: number
    no_invoice: string
    tanggal_lunas: string
    total_kamar: number
    total_layanan: number
    pajak_layanan: number
    grand_total: number
    created_at: string
    reservasi?: Reservasi
}

export interface Kamar {
    no_kamar: string
    id_jenis_kamar: number
    jenis_bed: string
    no_lantai: number
    is_smoking: number
    created_at: string
    updated_at: string
    jenis_kamar?: JenisKamar
}

export interface Season {
    id: number
    type: 'l' | 'h'
    nama: string
    tanggal_start: string
    tanggal_end: string
    created_at: string
    updated_at: string
    tarif?: Tarif[]
}

export interface Tarif {
    id: number
    id_jenis_kamar: number
    id_season: number
    harga: number
    jenis_kamar?: JenisKamar
    season?: Season
}

export interface KeyValue<T> {
    [key: string]: T
}