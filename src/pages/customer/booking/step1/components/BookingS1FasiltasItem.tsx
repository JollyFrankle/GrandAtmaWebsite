import { FasilitasLayananTambahan, getImage } from "@/utils/ApiModels";
import Formatter from "@/utils/Formatter";
import { PBS1SelectedFasilitas } from "../PageBookingStep1";
import { Button } from "@/cn/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";


export default function BookingS1FasiltasItem({
    item,
    onAmountChange,
    selectedFasilitas,
    maxAmount = 5
}: {
    item: FasilitasLayananTambahan,
    onAmountChange: (id: number, amount: 1 | -1) => void,
    selectedFasilitas?: PBS1SelectedFasilitas,
    maxAmount?: number
}) {

    return (
        <li className="grid grid-cols-12 items-center border-b last:border-b-0" key={item.id}>
            <div className="col-span-12 md:col-span-4 lg:col-span-3 h-40">
                <img src={getImage(item.gambar)} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col xl:flex-row items-center gap-4 p-4">
                <div className="flex-1">
                    <div className="font-bold">{item.nama}</div>
                    <div className="text-sm mb-2 lg:line-clamp-3">{item.short_desc}</div>
                    <div className="text-muted-foreground">{Formatter.formatCurrency(item.tarif)} per {item.satuan}</div>
                </div>

                <div className="flex border rounded overflow-auto items-stretch w-fit h-fit">
                    <Button type="button" variant="ghost" className="rounded-none px-3" onClick={() => onAmountChange(item.id, -1)} disabled={!selectedFasilitas || selectedFasilitas.amount == 0}>
                        <MinusIcon className="w-4 h-4" />
                    </Button>
                    <span className="px-2 py-2 w-10 text-center">{!selectedFasilitas ? 0 : selectedFasilitas.amount}</span>
                    <Button type="button" variant="ghost" className="rounded-none px-3" onClick={() => onAmountChange(item.id, 1)} disabled={(selectedFasilitas?.amount ?? 0) >= maxAmount}>
                        <PlusIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </li>
    )
}