import { JenisKamar } from "@/utils/ApiModels";
import CardWithIcon from "../../../../components/CardWithIcon";
import { LandPlotIcon, StarIcon, UserIcon } from "lucide-react";
import Formatter from "@/utils/Formatter";


export default function InfoPentingRow({
    data,
    className
}: {
    data?: JenisKamar,
    className?: string
}) {
    return <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 ${className}`}>
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
                content: <>{data?.ukuran} m<sup>2</sup></>
            }} />
        </div>
        <div className="col-span-1">
            <CardWithIcon item={{
                icon: <StarIcon className="w-full h-full" />,
                title: "Rating",
                content: Formatter.formatNumber(data?.rating!!) + " / 5"
            }} />
        </div>
    </div>
}