import { Dialog, DialogContent, DialogTitle, dialogSizeByClass } from "@/cn/components/ui/dialog"
import { Reservasi } from "@/utils/ApiModels"
import CatatanKeuangan from "./CatatanKeuangan"
import DetailCustomerMini from "./DetailCustomerMini"


export default function ModalCK({
    open,
    reservasi,
    onOpenChange
}: {
    open: boolean,
    reservasi?: Reservasi,
    onOpenChange: (open: boolean) => void
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            <DialogContent className={dialogSizeByClass("lg")}>
                <DialogTitle className="mb-4">Catatan Keuangan</DialogTitle>

                <DetailCustomerMini reservasi={reservasi} />

                <CatatanKeuangan reservasi={reservasi} />

            </DialogContent>
        </Dialog>
    )
}