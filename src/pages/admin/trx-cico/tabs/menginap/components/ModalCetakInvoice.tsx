import { Button } from "@/cn/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogTitle, dialogSizeByClass } from "@/cn/components/ui/dialog"
import { BASE_URL } from "@/utils/ApiModels"
import { BanIcon, PrinterIcon } from "lucide-react"


export default function ModalCetakInvoice({
    open,
    urlInvoice,
    onOpenChange,
}: {
    open: boolean
    urlInvoice: string
    onOpenChange: (open: boolean) => void
}) {

    const cetakInvoice = () => {
        window.open(`${BASE_URL}/public/pdf/invoice/${urlInvoice}`, "_blank")
        onOpenChange(false)
    }

    return <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
        <DialogContent className={dialogSizeByClass("sm")}>
            <DialogTitle className="mb-4">Invoice</DialogTitle>

            <div>
                Apakah Anda ingin mencetak invoice?
            </div>

            <DialogFooter className="mt-4 gap-2">
                <Button variant="secondary" onClick={() => onOpenChange(false)}><BanIcon className="w-4 h-4 me-2" /> Tidak</Button>
                <Button onClick={cetakInvoice}><PrinterIcon className="w-4 h-4 me-2" /> Cetak</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}