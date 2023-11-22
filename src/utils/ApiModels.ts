import axios from "axios";
import AuthHelper from "./AuthHelper";
import { toast } from "react-toastify";

export const BASE_URL = import.meta.env.VITE_API_URL;

export function getImage(uid?: string | null) {
    return `${BASE_URL}/public/image/${uid}`;
}

export const apiPublic = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: 'application/json'
    }
});

export const apiAuthenticated = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: 'application/json',
    }
});

apiPublic.interceptors.response.use(
    response => response,
    error => {
        console.error(error)
        if (error.response?.data) {
            const data = error.response?.data as ApiErrorResponse
            toast.error(data.message)
        } else {
            toast.error(error.message)
        }
        return Promise.reject(error);
    }
)

apiAuthenticated.interceptors.response.use(
    response => response,
    error => {
        console.error(error)
        if (error.response.status === 401) {
            AuthHelper.logout();
            window.location.href = '/login';
        } else if (error.response?.data) {
            const data = error.response?.data as ApiErrorResponse
            toast.error(data.message)
        } else {
            toast.error(error.message)
        }
        return Promise.reject(error);
    }
)

apiAuthenticated.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${AuthHelper.getToken()}`;
    return config;
});

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
    tipe_bed: string
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
    departure_date: string
    jumlah_malam: number
    jumlah_dewasa: number
    jumlah_anak: number
    tanggal_dl_booking: string|null
    tanggal_dp: string|null
    jumlah_dp: number|null
    status: string
    total: number
    permintaan_tambahan: string|null
    created_at: string
    updated_at: string
    bukti_transfer: string|null
    reservasi_layanan?: ReservasiLayanan[]
    reservasi_rooms?: ReservasiRoom[]
    reservasi_cico?: ReservasiCICO
    invoice?: Invoice
    user_customer?: UserCustomer
    user_pegawai?: UserPegawai
}

export interface ReservasiCICO {
    id_reservasi: number
    id_fo: number
    checked_in_at: string
    checked_out_at: string|null
    deposit: number
    gambar_identitas: string
    reservasi?: Reservasi
    user_pegawai?: UserPegawai
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

export interface RincianTarif {
    jumlah_kamar: number
    harga_diskon: number
    harga: number
    catatan: { type: "w" | "e", message: string }[]
}

export interface KamarAvailibility {
    no_kamar: string,
    reservasi: Reservasi | null,
    jenis_kamar: {
        id: number,
        nama: string
    },
    detail: {
        smoking: boolean,
        bed: string,
    }
    status: 'TSD' | 'TRS' | 'COT' | 'UNV'
}

export interface CICOListResponse {
    min_date: string,
    max_date: string,
    reservasi: Reservasi[]
}

export interface KeyValue<T> {
    [key: string]: T
}