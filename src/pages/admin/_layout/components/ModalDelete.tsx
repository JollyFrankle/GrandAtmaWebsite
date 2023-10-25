import { Button } from "@/cn/components/ui/button"
import { Dialog, DialogFooter, DialogContent, DialogTitle } from "@/cn/components/ui/dialog"
import { BanIcon, Trash2Icon } from "lucide-react"


export default function ModalDelete({
    open,
    onOpenChange,
    onConfirmed,
    title = "Konfirmasi Penghapusan",
    children
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onConfirmed: () => void
    title?: string,
    children: React.ReactNode,
}) {
    const onDeleteConfirmed = () => {
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
                <Button type="button" variant="destructive" onClick={onDeleteConfirmed}><Trash2Icon className="h-4 w-4 me-2" /> Hapus</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}