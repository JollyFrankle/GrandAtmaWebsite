import { ReservasiLayanan, getImage } from "@/utils/ApiModels";
import Formatter from "@/utils/Formatter";

export default function BookingS2FasiltasItem({
    reservasiLayanan
}: {
    reservasiLayanan: ReservasiLayanan,
}) {
    const item = reservasiLayanan.layanan_tambahan
    return (
        <li className="grid grid-cols-6 items-center border-b last:border-b-0" key={item?.id}>
            <div className="col-span-2 md:col-span-1 h-24">
                <img src={getImage(item?.gambar)} className="w-full h-full object-cover" />
            </div>
            <div className="col-span-4 md:col-span-5 flex flex-col xl:flex-row items-center gap-4 p-4">
                <div className="flex-1">
                    <div className="font-bold">{item?.nama}</div>
                    <div className="text-muted-foreground">{reservasiLayanan?.qty} {item?.satuan} &times; {Formatter.formatCurrency((reservasiLayanan?.total ?? 0) / (reservasiLayanan?.qty ?? 1))}</div>
                </div>

                <div>
                    {Formatter.formatCurrency(reservasiLayanan?.total ?? 0)}
                </div>
            </div>
        </li>
    )
}