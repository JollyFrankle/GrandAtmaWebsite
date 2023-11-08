import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTitle } from "@/cn/components/ui/alert-dialog"
import { BanIcon, Trash2Icon } from "lucide-react"


export default function ModalDelete({
    open,
    onOpenChange,
    onConfirmed,
    title = "Konfirmasi Penghapusan",
    deleteButton = <><Trash2Icon className="h-4 w-4 me-2" /> Hapus</>,
    children
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onConfirmed: () => void
    title?: string,
    deleteButton?: React.ReactNode,
    children: React.ReactNode,
}) {
    const onDeleteConfirmed = () => {
        onConfirmed()
        onOpenChange(false)
    }

    return <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <div>
                {children}
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel type="button" onClick={() => onOpenChange(false)} className="me-2"><BanIcon className="h-4 w-4 me-2" /> Batal</AlertDialogCancel>
                <AlertDialogAction type="button" onClick={onDeleteConfirmed}>{deleteButton}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}