
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTitle } from "@/cn/components/ui/alert-dialog"
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

    return <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <div>
                {children}
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel type="button" onClick={() => onOpenChange(false)} className="me-2"><BanIcon className="h-4 w-4 me-2" /> Batal</AlertDialogCancel>
                <AlertDialogAction autoFocus type="button" onClick={onConfirm}><CheckIcon className="h-4 w-4 me-2" /> {btnText}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}