import { JenisKamar } from "@/utils/ApiModels";
import CardWithIcon from "../../../../components/CardWithIcon";
import { BedSingleIcon, LandPlotIcon, UserIcon } from "lucide-react";
import Formatter from "@/utils/Formatter";
import Converter from "@/utils/Converter";


export default function InfoPentingRow({
    data,
    className = ""
}: {
    data?: JenisKamar,
    className?: string
}) {
    const jenisBed = Formatter.formatJSON<string[]>(data?.tipe_bed)
    return <div className={`grid grid-cols-1 gap-4 lg:grid-cols-3 ${className}`}>
        <div className="col-span-1">
            <CardWithIcon item={{
                icon: <UserIcon className="w-full h-full" />,
                title: "Kapasitas",
                content: data?.kapasitas + " orang"
            }} />
        </div>
        <div className="col-span-1">
            <CardWithIcon item={{
                icon: <LandPlotIcon className="w-full h-full" />,
                title: "Ukuran Kamar",
                content: <>{data?.ukuran} m<sup>2</sup> ({data?.ukuran && Formatter.formatNumber(Converter.mToFt(data?.ukuran))} ft<sup>2</sup>)</>
            }} />
        </div>
        <div className="col-span-1">
            <CardWithIcon item={{
                icon: <BedSingleIcon className="w-full h-full" />,
                title: "Jenis Bed",
                content: jenisBed?.map((bed) => Formatter.capitalizeFirstLetter(bed)).join(", ")
            }} />
        </div>
    </div>
}