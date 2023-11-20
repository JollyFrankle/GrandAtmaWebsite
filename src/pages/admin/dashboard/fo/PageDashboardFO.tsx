import IconSelect from "@/components/IconSelect";
import { HashIcon } from "lucide-react";
import { useState } from "react";
import FOCurrentTime from "./components/FOCurrentTime";
import usePageTitle from "@/hooks/usePageTitle";
import FOKetersediaanKamarPanel from "./components/FOKetersediaanKamarPanel";
import FOListCIToday from "./components/FOListCIToday";
import FOListCOToday from "./components/FOListCOToday";


export default function PageDashboardFO() {

    const [lantai, setLantai] = useState("0")

    usePageTitle("Dashboard – Front Office")

    return <>
        <div className="lg:grid grid-cols-12 gap-4">
            <div className="lg:col-span-8 xl:col-span-9">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-2">
                    <h2 className="text-2xl font-bold">Ketersediaan Kamar Saat Ini</h2>
                    <IconSelect
                        className="mb-0"
                        icon={<HashIcon className="w-full h-full" />}
                        placeholder="Pilih Nomor Lantai"
                        value={lantai}
                        onValueChange={setLantai}
                        values={[
                            { value: "0", label: "Semua Lantai" },
                            { value: "1", label: "Lantai 1" },
                            { value: "2", label: "Lantai 2" },
                            { value: "3", label: "Lantai 3" },
                            { value: "4", label: "Lantai 4" },
                        ]}
                        />
                </div>

                <div className="flex items-center flex-nowrap gap-4 overflow-x-auto">
                    <div className="flex gap-2 items-center whitespace-nowrap">
                        <div className="w-4 h-4 bg-green-500 rounded" />
                        Tersedia
                    </div>
                    <div className="flex gap-2 items-center whitespace-nowrap">
                        <div className="w-4 h-4 bg-yellow-500 rounded" />
                        Terisi
                    </div>
                    <div className="flex gap-2 items-center whitespace-nowrap">
                        <div className="w-4 h-4 bg-red-500 rounded" />
                        Terisi <small>(Check Out Hari Ini)</small>
                    </div>
                    <div className="flex gap-2 items-center whitespace-nowrap">
                        <div className="w-4 h-4 bg-gray-500 rounded" />
                        Dalam Perawatan
                    </div>
                </div>

                <div className="my-4 text-muted-foreground">Klik pada salah satu kamar untuk melihat yang sedang menginap saat ini.</div>

                <FOKetersediaanKamarPanel noLantai={lantai} />
            </div>
            <div className="lg:col-span-4 xl:col-span-3">
                <FOCurrentTime className="mb-4" />

                <div className="mb-4">
                    <h4 className="text-xl font-bold mb-2 text-center">Check In Hari Ini</h4>
                    <FOListCIToday />
                </div>

                <div className="mb-4">
                    <h4 className="text-xl font-bold mb-2 text-center">Check Out Hari Ini</h4>
                    <FOListCOToday />
                </div>
            </div>
        </div>
    </>
}