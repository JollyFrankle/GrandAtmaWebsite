import { Dialog, DialogContent, DialogHeader, dialogSizeByClass } from "@/cn/components/ui/dialog"
import { Skeleton } from "@/cn/components/ui/skeleton"
import { Reservasi } from "@/utils/ApiModels"
import DetailReservasi from "../reservasi/DetailReservasi"

export default function ModalDetailReservasi({
    loading,
    data,
    show,
    onOpenChange,
}: {
    loading: boolean,
    data?: Reservasi,
    show?: boolean,
    onOpenChange?: (open: boolean) => void
}) {
    return <Dialog open={show} onOpenChange={onOpenChange}>
    {loading ? (
        <DialogContent className={dialogSizeByClass("lg")}>
            <Skeleton className="w-full h-16 mb-2" />
            <Skeleton className="w-3/4 h-8 mb-2" />
            <Skeleton className="w-5/6 h-10" />
        </DialogContent>
    ) : (
        <DialogContent className={dialogSizeByClass("lg")}>
            <DialogHeader>Detail Pemesanan</DialogHeader>
            <DetailReservasi data={data} />
        </DialogContent>
    )}
</Dialog>
}