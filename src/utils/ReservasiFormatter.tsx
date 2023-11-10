import { Badge } from "@/cn/components/ui/badge"
import Formatter from "./Formatter"


export default class ReservasiFormatter {
    static generateStatusBadge(status: string, tanggalDL?: string|null) {
        switch(status) {
            case "pending-1": case "pending-2": case "pending-3":
                const dateDL = new Date(tanggalDL ?? "")
                if (new Date().getTime() > dateDL.getTime()) {
                    return <Badge variant="danger">Kedaluwarsa</Badge>
                }
                return <>
                    <Badge variant="info" className="whitespace-nowrap">Belum Dibayar</Badge>
                    <div className="text-xs mt-1">Kedaluwarsa:</div>
                    <div className="text-xs font-bold">{Formatter.formatDateTimeShort(dateDL)}</div>
                </>
            case "expired":
                return <Badge variant="danger">Kedaluwarsa</Badge>
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