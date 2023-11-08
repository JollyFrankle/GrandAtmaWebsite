import { Badge } from "@/cn/components/ui/badge"


export default class ReservasiFormatter {
    static generateStatusBadge(status: string, tanggalDL?: string|null) {
        switch(status) {
            case "pending-1": case "pending-2": case "pending-3":
                if (new Date().getTime() > new Date(tanggalDL ?? "").getTime()) {
                    return <Badge variant="danger">Kadaluarsa</Badge>
                }
                return <Badge variant="warning">Belum Selesai</Badge>
            case "expired":
                return <Badge variant="danger">Kadaluarsa</Badge>
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
            case "test":
                return <Badge variant="warning">Test</Badge>
            default:
                return <Badge>Tidak Diketahui</Badge>
        }
    }
}