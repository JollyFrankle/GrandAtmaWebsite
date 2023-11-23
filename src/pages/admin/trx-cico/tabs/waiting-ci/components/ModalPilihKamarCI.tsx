import { Dialog, DialogContent, dialogSizeByClass } from "@/cn/components/ui/dialog";
import FOKetersediaanKamarPanel from "../../../../dashboard/fo/components/FOKetersediaanKamarPanel";
import { KamarAvailibility } from "@/utils/ApiModels";
import { CheckInKamar } from "./ModalCheckIn";


export default function ModalPilihKamarCI({
    idJenisKamar,
    open,
    currentlySelectedKamars,
    onOpenChange,
    onSelected
}: {
    open: boolean,
    idJenisKamar?: number,
    currentlySelectedKamars?: CheckInKamar[],
    onOpenChange: (open: boolean) => void,
    onSelected: (item: KamarAvailibility) => void
}) {
    return <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
        <DialogContent className={dialogSizeByClass("xl")}>
            <FOKetersediaanKamarPanel
                initIdJK={idJenisKamar?.toString()}
                containerClassName="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 mt-4 text-center"
                onKamarClicked={onSelected}
                currentlySelectedKamars={currentlySelectedKamars}
                />
        </DialogContent>
    </Dialog>
}