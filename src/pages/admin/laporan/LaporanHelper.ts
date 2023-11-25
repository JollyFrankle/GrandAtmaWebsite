
export const LaporanList = [
    {
        id: 1,
        nama: 'Laporan Customer Baru'
    },
    {
        id: 2,
        nama: 'Laporan Pendapatan Bulanan'
    },
    {
        id: 3,
        nama: 'Laporan Jumlah Tamu'
    },
    {
        id: 4,
        nama: 'Laporan 5 Customer dengan Reservasi Terbanyak'
    }

]

export function getLaporanProperties(nomorLaporan: number) {
    let title = ''
    let showBulan = false
    const laporan = LaporanList.find(laporan => laporan.id === nomorLaporan)
    if (laporan) {
        title = laporan.nama
    }

    // Show bulan
    if ([3].includes(nomorLaporan)) {
        showBulan = true
    }

    return {
        title,
        showBulan
    }
}