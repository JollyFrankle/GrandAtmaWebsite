import { getImage } from "@/utils/ApiModels";
import Formatter from "@/utils/Formatter";
import { PBS2GroupedFasilitas } from "../PageBookingStep2";

export default function BookingS2FasiltasItem({
    groupedFasilitas: groupedFasilitas
}: {
    groupedFasilitas?: PBS2GroupedFasilitas,
}) {
    const item = groupedFasilitas?.fasilitas
    return (
        <li className="grid grid-cols-6 items-center border-b last:border-b-0" key={item?.id}>
            <div className="col-span-2 md:col-span-1 h-24">
                <img src={getImage(item?.gambar)} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-4 md:col-span-5 flex flex-col xl:flex-row items-center gap-4 p-4">
                <div className="flex-1">
                    <div className="font-bold">{item?.nama}</div>
                    <div className="text-secondary-foreground">{groupedFasilitas?.amount} {item?.satuan} &times; {Formatter.formatCurrency((groupedFasilitas?.hargaTotal ?? 0) / (groupedFasilitas?.amount ?? 1))}</div>
                </div>

                <div className="flex border rounded overflow-auto items-stretch w-fit h-fit">
                    {Formatter.formatCurrency(groupedFasilitas?.hargaTotal ?? 0)}
                </div>
            </div>
        </li>
    )
}