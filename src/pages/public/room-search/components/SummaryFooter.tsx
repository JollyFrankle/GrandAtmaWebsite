import Formatter from "@/utils/Formatter"
import { RoomSearchData } from "../../_layout/components/RoomSearch"
import { KamarDipesan, SummaryKamarDipesan } from "../PageRoomSearch"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/cn/components/ui/button"


export default function SummaryFooter({
    kamarDipesan,
    jumlahMalam,
    show,
    summaryKamarDipesan,
    onButtonPesanClick,
    initData
}: {
    kamarDipesan: KamarDipesan[],
    jumlahMalam: number,
    show: boolean,
    summaryKamarDipesan: SummaryKamarDipesan,
    onButtonPesanClick: () => void,
    initData?: Required<RoomSearchData>
}) {
    return (
        <footer className={`fixed left-0 bottom-0 w-full transition-transform duration-500 ease-in-out transform ${(kamarDipesan.length > 0 && show) ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="container py-4 rounded-xl bg-background shadow-lg mb-4">
                <div className="md:flex justify-between items-center">
                    <div className="hidden md:block">
                        <div className="text-sm text-muted-foreground">Kamar yang dipesan:</div>
                        <div className="text-lg font-bold">{kamarDipesan.map((item) => `${item.count} ${item.nama}`).join(", ")}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="hidden md:block md:me-6">
                            <div className="flex items-center">
                                <span className="w-24 text-muted-foreground">Check in:</span>
                                <strong>{Formatter.formatDate(initData?.date.from!!)}</strong>
                            </div>
                            <div className="flex items-center border-b">
                                <span className="w-24 text-muted-foreground">Check out:</span>
                                <strong>{Formatter.formatDate(initData?.date.to!!)}</strong>
                            </div>
                            <div className="flex items-center">
                                <span>{initData?.date && jumlahMalam} malam, {initData?.dewasa} dewasa, {initData?.anak} anak</span>
                            </div>
                        </div>
                        <div className="md:me-4 md:text-end">
                            <div className="text-sm text-muted-foreground">Harga per malam:</div>
                            {summaryKamarDipesan.hargaDiskon < summaryKamarDipesan.hargaNormal ? <>
                                <div className="text-gray-400 -mb-1 line-through">{Formatter.formatCurrency(summaryKamarDipesan.hargaNormal)}</div>
                                <div className="text-green-600 font-bold text-xl">{Formatter.formatCurrency(summaryKamarDipesan.hargaDiskon)}</div>
                            </> : (
                                <div className="font-bold text-xl">{Formatter.formatCurrency(summaryKamarDipesan.hargaDiskon)}</div>
                            )}
                        </div>
                        <div className="text-center">
                            <Button variant="default" className="px-8 py-3 rounded flex items-center md:w-32" disabled={kamarDipesan.length === 0 || summaryKamarDipesan.totalKamarSaatIni !== +(initData?.jumlahKamar ?? "0")} onClick={onButtonPesanClick}>
                                Pesan <ArrowRightIcon className="ms-2 w-4 h-4" />
                            </Button>
                            {summaryKamarDipesan.totalKamarSaatIni < +(initData?.jumlahKamar ?? "0") ? (
                                <div className="mt-1 text-sm md:w-32"><strong>{summaryKamarDipesan.totalKamarSaatIni}/{initData?.jumlahKamar ?? "0"}</strong> kamar terpilih.</div>
                            ) : summaryKamarDipesan.totalKamarSaatIni > +(initData?.jumlahKamar ?? "0") && (
                                <div className="mt-1 text-sm md:w-32 text-red-500">Kamar terlalu banyak</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}