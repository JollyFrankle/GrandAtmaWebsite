import FOCurrentTime from "./components/FOCurrentTime";
import usePageTitle from "@/hooks/usePageTitle";
import FOKetersediaanKamarPanel from "./components/FOKetersediaanKamarPanel";
import FOListCICOToday from "./components/FOListCICOToday";


export default function PageDashboardFO() {

    usePageTitle("Dashboard – Front Office")

    return <>
        <div className="lg:grid grid-cols-12 gap-4">
            <div className="lg:col-span-8 xl:col-span-9">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-2">
                    <h2 className="text-2xl font-bold">Ketersediaan Kamar Saat Ini</h2>
                </div>

                <div className="my-4 text-muted-foreground">Klik pada salah satu kamar untuk melihat detail reservasi tamu yang sedang menginap saat ini.</div>

                <FOKetersediaanKamarPanel />
            </div>
            <div className="lg:col-span-4 xl:col-span-3">
                <FOCurrentTime className="mb-4" />

                <div className="mb-4">
                    <FOListCICOToday />
                </div>
            </div>
        </div>
    </>
}