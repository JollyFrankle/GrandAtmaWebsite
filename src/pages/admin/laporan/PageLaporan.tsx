import { useEffect, useState } from "react";
import AuthHelper from "@/utils/AuthHelper";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import IconSelect from "@/components/IconSelect";
import { CalendarClockIcon, CalendarRangeIcon, PrinterIcon, RefreshCwIcon } from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle";
import { Button } from "@/cn/components/ui/button";
import { getLaporanProperties } from "./LaporanHelper";
import { BASE_URL } from "@/utils/ApiModels";

import "./PageLaporan.css"
import AbstractBG from "@/assets/images/abstract-bg.jpg"

const monthFormatter = new Intl.DateTimeFormat("id-ID", { month: "long" })
const dropdownTahun: { value: string, label: string }[] = []
const dropdownBulan: { value: string, label: string }[] = []

for (let i = 2023; i <= new Date().getFullYear(); i++) {
    dropdownTahun.push({
        value: i.toString(),
        label: i.toString()
    })
}

for (let i = 1; i <= 12; i++) {
    dropdownBulan.push({
        value: i.toString(),
        label: monthFormatter.format(new Date(2023, i - 1))
    })
}

export default function PageLaporan1() {
    const navigate = useNavigate()
    const params = useParams<{ nomor: string }>()
    const { nomor: nomorLaporan } = params

    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState("")
    const [pageTitle, setPageTitle] = useState("")
    const [laporanTitle, setLaporanTitle] = useState("")
    const [tahun, setTahun] = useState(new Date().getFullYear().toString())
    const [bulan, setBulan] = useState((new Date().getMonth() + 1).toString())
    const [showInputBulan, setShowInputBulan] = useState(false)

    usePageTitle(pageTitle)

    const fetchLaporan = () => {
        let baseUrl = `${BASE_URL}/public/pdf/laporan/${nomorLaporan}`
        const params = new URLSearchParams({
            token: AuthHelper.getToken()!!,
            readonly: "true",
            tahun: tahun,
            bulan: bulan,
            ts: Date.now().toString()
        })

        let { title, showBulan } = getLaporanProperties(+(nomorLaporan ?? 0))

        setShowInputBulan(showBulan)
        setLoading(true)
        setPageTitle(`${title} – Grand Atma Hotel`)
        setLaporanTitle(title)
        setUrl(baseUrl + "?" + params.toString())
    }

    const onIframeLoadHandler = () => {
        setLoading(false)
    }

    const onIframeErrorHandler = () => {
        setLoading(false)
        toast.error("Terjadi kesalahan saat memuat laporan.")
    }

    const printLaporan = () => {
        let baseUrl = `${BASE_URL}/public/pdf/laporan/${nomorLaporan}`
        const params = new URLSearchParams({
            token: AuthHelper.getToken()!!,
            tahun: tahun,
            bulan: bulan
        })
        window.open(baseUrl + "?" + params.toString(), "_blank")
    }

    useEffect(() => {
        if (AuthHelper.authorize(["owner", "gm"])) {
            fetchLaporan()
        } else {
            toast.error("Anda tidak memiliki akses ke halaman ini. Insiden ini telah dilaporkan.")
            navigate("/admin/")
        }
    }, [nomorLaporan, tahun, bulan])

    return <>
        <img src={AbstractBG} alt="Abstract background" className="dark:hidden select-none fixed top-0 left-0 right-0 bottom-0 w-full h-full object-cover opacity-50" />
        <section className="max-w-[210mm] mx-auto overflow-x-auto shadow-md relative">
            <div className="flex justify-between items-center bg-secondary px-4 py-2 w-[210mm]">
                <h1 className="text-lg font-bold me-4">{laporanTitle}</h1>
                <div className="flex items-center gap-2 shrink-0">
                    <IconSelect
                        icon={<CalendarClockIcon />}
                        values={dropdownTahun}
                        value={tahun}
                        onValueChange={setTahun}
                        placeholder="Tahun"
                        className=""
                        inputClassName="w-32"
                        />
                    {showInputBulan && (
                        <IconSelect
                            icon={<CalendarRangeIcon />}
                            values={dropdownBulan}
                            value={bulan}
                            onValueChange={setBulan}
                            placeholder="Bulan"
                            className=""
                            inputClassName="w-32"
                            />
                    )}
                    <div className="btn-group">
                        <Button onClick={fetchLaporan} variant="outline" type="button" title="Refresh laporan">
                            <RefreshCwIcon className="w-4 h-4" />
                        </Button>
                        <Button onClick={printLaporan} variant="outline" type="button" title="Cetak laporan">
                            <PrinterIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="w-[210mm] h-[297mm] overflow-auto bg-white p-[.5in] select-none">
                {loading && (
                    <div className="flex justify-center items-center w-full h-full">
                        <LoadingSpinner />
                    </div>
                )}
                <iframe src={url} className={`w-full h-full ${loading && 'hidden'}`} onLoad={onIframeLoadHandler} onError={onIframeErrorHandler} />
            </div>
        </section>
    </>
}