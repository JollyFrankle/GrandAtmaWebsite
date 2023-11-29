import { Dialog, DialogContent, DialogHeader, dialogSizeByClass } from "@/cn/components/ui/dialog"
import { Reservasi } from "@/utils/ApiModels"
import DetailReservasi from "../reservasi/DetailReservasi"
import ModalDialogLoading from "../loading/ModalDialogLoading"

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
            <ModalDialogLoading />
        </DialogContent>
    ) : (
        <DialogContent className={dialogSizeByClass("lg")}>
            <DialogHeader>Detail Pemesanan</DialogHeader>
            <DetailReservasi data={data} />
        </DialogContent>
    )}
</Dialog>
}