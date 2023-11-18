import IconSelect from "@/components/IconSelect";
import { HashIcon } from "lucide-react";
import { useState } from "react";
import FOCurrentTime from "./components/FOCurrentTime";
import usePageTitle from "@/hooks/usePageTitle";
import FOKetersediaanKamarPanel from "./components/FOKetersediaanKamarPanel";


export default function PageDashboardFO() {

    const [lantai, setLantai] = useState("0")
    const [isKKSILoading, setIsKKSILoading] = useState(false)

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

                <div className="flex items-center gap-4">
                    <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 bg-green-500 rounded" />
                        Tersedia
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 bg-yellow-500 rounded" />
                        Terisi
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 bg-red-500 rounded" />
                        Terisi <small>(Check Out Hari Ini)</small>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 bg-gray-500 rounded" />
                        Tidak Tersedia
                    </div>
                </div>

                <FOKetersediaanKamarPanel />
            </div>
            <div className="lg:col-span-4 xl:col-span-3">
                <FOCurrentTime />
            </div>
        </div>
    </>
}