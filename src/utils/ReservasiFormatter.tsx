import { Badge } from "@/cn/components/ui/badge"


export default class ReservasiFormatter {
    static generateStatusBadge(status: string) {
        switch(status) {
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