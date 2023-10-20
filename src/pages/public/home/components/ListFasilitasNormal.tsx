import { Card, CardContent } from "@/cn/components/ui/card";
import { AirVentIcon, DumbbellIcon, UtensilsIcon, WavesIcon } from "lucide-react";

const fasilitas: { icon: React.ReactNode; title: string; description: string }[] = [
    {
        title: 'AC',
        description: 'Semua kamar dilengkapi dengan pendingin ruangan yang sejuk!',
        icon: <AirVentIcon className="w-8 h-8" />
    },
    {
        title: 'Kolam Renang',
        description: 'Puaskan diri Anda dengan berenang di kolam renang kami!',
        icon: <WavesIcon className="w-8 h-8" />
    },
    {
        title: 'Gym',
        description: 'Tetap sehat dan bugar! Gym kami memiliki peralatan yang lengkap.',
        icon: <DumbbellIcon className="w-8 h-8" />
    },
    {
        title: 'Breakfast & Restaurant',
        description: 'Sarapan gratis untuk Anda! Jangan takut kelaparan, restoran kami buka 24 jam.',
        icon: <UtensilsIcon className="w-8 h-8" />
    }
]
export default function ListFasilitasNormal() {
    return fasilitas.map((item, index) => (
            <div className="w-full mt-4" key={index}>
                <Card className="w-full md:text-start transition-all hover:scale-110">
                    <CardContent className="p-4 md:flex items-center">
                        <div className="mb-3 md:mb-0 w-fit mx-auto md:mx-0">
                            {item.icon}
                        </div>
                        <div className="md:ms-4">
                            <h3 className="font-bold">{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        ))
}