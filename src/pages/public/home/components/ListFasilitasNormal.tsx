import { AirVentIcon, DumbbellIcon, UtensilsIcon, WavesIcon } from "lucide-react";
import CardWithIcon from "../../_layout/components/CardWithIcon";

const fasilitas: { icon: React.ReactNode; title: string; content: string }[] = [
    {
        title: 'AC',
        content: 'Semua kamar dilengkapi dengan pendingin ruangan yang sejuk!',
        icon: <AirVentIcon className="w-full h-full" />
    },
    {
        title: 'Kolam Renang',
        content: 'Puaskan diri Anda dengan berenang di kolam renang kami!',
        icon: <WavesIcon className="w-full h-full" />
    },
    {
        title: 'Gym',
        content: 'Tetap sehat dan bugar! Gym kami memiliki peralatan yang lengkap.',
        icon: <DumbbellIcon className="w-full h-full" />
    },
    {
        title: 'Breakfast & Restaurant',
        content: 'Sarapan gratis untuk Anda! Jangan takut kelaparan, restoran kami buka 24 jam.',
        icon: <UtensilsIcon className="w-full h-full" />
    }
]
export default function ListFasilitasNormal() {
    return fasilitas.map((item, index) => (
            <div className="w-full mt-4" key={index}>
                <CardWithIcon item={item} />
            </div>
        ))
}