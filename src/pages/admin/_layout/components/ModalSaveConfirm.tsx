import { Button } from "@/cn/components/ui/button"
import { Dialog, DialogFooter, DialogContent, DialogTitle } from "@/cn/components/ui/dialog"
import { BanIcon, CheckIcon } from "lucide-react"


export default function ModalSaveConfirm({
    open,
    onOpenChange,
    onConfirmed,
    title = "Konfirmasi",
    btnText = "Simpan",
    children = <p className="mb-4">Apakah yakin ingin menyimpan data ini?</p>
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onConfirmed: () => void
    title?: string,
    btnText?: string,
    children?: React.ReactNode,
}) {
    const onConfirm = () => {
        onConfirmed()
        onOpenChange(false)
    }

    return <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
        <DialogContent>
            <DialogTitle>{title}</DialogTitle>
            <div>
                {children}
            </div>
            <DialogFooter>
                <Button type="button" onClick={() => onOpenChange(false)} variant="secondary" className="me-2"><BanIcon className="h-4 w-4 me-2" /> Batal</Button>
                <Button type="button" variant="default" onClick={onConfirm}><CheckIcon className="h-4 w-4 me-2" /> {btnText}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}