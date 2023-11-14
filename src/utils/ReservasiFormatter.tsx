import { Badge } from "@/cn/components/ui/badge"
import Formatter from "./Formatter"
import { Reservasi } from "./ApiModels"


export enum CancelableStatus {
    YES_REFUND,
    NO_REFUND,
    NO_CONSEQUENCE,
    NOT_CANCELABLE,
}

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

    static isReservasiCancelable(reservasi: Reservasi) {
        const tglArrival = new Date(reservasi.arrival_date)
        const tglDeparture = new Date(reservasi.departure_date)

        // if > 7 days, allow refund
        const diffDays = (tglDeparture.getTime() - tglArrival.getTime()) / (1000 * 3600 * 24)
        const isOverCheckOut = new Date().getTime() > tglDeparture.setHours(12, 0, 0, 0)
        const isOverDl = new Date().getTime() > new Date(reservasi.tanggal_dl_booking ?? "").getTime()
        const isReservasiUncancelable = ["checkin", "batal", "expired", "selesai"].includes(reservasi.status)

        if (reservasi.status.startsWith('pending-') && !isOverDl) {
            return CancelableStatus.NO_CONSEQUENCE
        } else if (diffDays > 7) {
            return CancelableStatus.YES_REFUND
        } else if (isOverCheckOut || isReservasiUncancelable) {
            return CancelableStatus.NOT_CANCELABLE
        } else {
            return CancelableStatus.NO_REFUND
        }
    }
}