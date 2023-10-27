import { Badge } from "@/cn/components/ui/badge"


export default class ReservasiFormatter {
    static generateStatusBadge(status: string) {
        switch(status) {
            case "belum":
                return <Badge variant="warning">Belum Dibayar</Badge>
            case "dp": // hanya untuk reservasi customer group
                return <Badge variant="info">Sudah DP</Badge>
            case "lunas": // hanya untuk reservasi customer personal
                return <Badge variant="info">Lunas</Badge>
            case "batal":
                return <Badge variant="danger">Batal</Badge>
            case "checkin":
                return <Badge variant="default">Check-in</Badge>
            case "selesai":
                return <Badge variant="success">Selesai</Badge>
            default:
                return <Badge>Tidak Diketahui</Badge>
        }
    }

    static getTanggalDeparture(arrivalDate: Date, jumlahMalam: number) {
        const date = new Date(arrivalDate)
        date.setDate(date.getDate() + jumlahMalam)
        return date
    }
}