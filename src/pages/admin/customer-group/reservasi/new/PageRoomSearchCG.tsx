import useQuery from "@/hooks/useQuery"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import usePageTitle from "@/hooks/usePageTitle"
import { Skeleton } from "@/cn/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/cn/components/ui/card"
import { Button } from "@/cn/components/ui/button"
import Formatter from "@/utils/Formatter"
import { AxiosError } from "axios"
import { ApiErrorResponse, ApiResponse, JenisKamar, Reservasi, ReservasiRoom, RincianTarif, apiAuthenticated, getImage } from "@/utils/ApiModels"
import { ArrowRightIcon, BanIcon, HomeIcon, InfoIcon } from "lucide-react"
import Converter from "@/utils/Converter"
import { Dialog, DialogContent, DialogFooter } from "@/cn/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/cn/components/ui/alert"
import { toast } from "react-toastify"
import Lottie from "lottie-react";

import { Separator } from "@/cn/components/ui/separator"
import TarifKamarCard from "./components/TarifKamarCard"
// import SummaryFooter from "./components/SummaryFooter"
import LottieNoData from "@/assets/lottie/Animation - 1699364588857.json"
import GeneralLoadingDialog from "@/components/GeneralLoadingDialog"
import { RoomSearchData } from "@/pages/public/_layout/components/RoomSearch"
import RoomSearchCG from "./components/RoomSearchCG"
import SummaryFooter from "./components/SummaryFooter"

export interface KamarDipesan {
    idJK: number,
    nama: string,
    gambar: string,
    count: number,
    harga: number,
    harga_diskon: number
}

export interface TarifKamar {
    jenis_kamar: JenisKamar,
    rincian_tarif: RincianTarif
}

export interface SummaryKamarDipesan {
    hargaDiskon: number,
    hargaNormal: number,
    totalKamarSaatIni: number
}

export default function PageRoomSearchCG() {
    const params = useParams<{ id: string }>()
    const { id: idC } = params

    const query = useQuery()
    const [kamarDipesan, setKamarDipesan] = useState<KamarDipesan[]>([])
    const [initData, setInitData] = useState<Required<RoomSearchData>>()
    const [data, setData] = useState<TarifKamar[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isReady, setIsReady] = useState(false)
    const [showDialogConfirm, setShowDialogConfirm] = useState(false)
    const [showDialogMengamankanHarga, setShowDialogMengamankanHarga] = useState(false)
    const [jumlahMalam, setJumlahMalam] = useState(0)
    const [summaryKamarDipesan, setSummaryKamarDipesan] = useState<SummaryKamarDipesan>({
        hargaDiskon: 0,
        hargaNormal: 0,
        totalKamarSaatIni: 0
    })
    const [pageTitle, setPageTitle] = useState("Grand Atma Hotel - Cari Kamar")

    const memoizedParams = useMemo(() => query, [query.get('from'), query.get('to'), query.get('dewasa'), query.get('anak'), query.get('jumlahKamar'), query.get("ts")])
    const navigate = useNavigate()

    usePageTitle(pageTitle)

    const fetchData = async () => {
        if (!initData) {
            return
        }
        setIsLoading(true)
        setIsReady(false)
        apiAuthenticated.post(`pegawai/booking/search/${idC}`, {
            check_in: Formatter.dateToYMD(initData.date.from!!),
            check_out: Formatter.dateToYMD(initData.date.to!!),
            jumlah_kamar: +initData.jumlahKamar,
            jumlah_dewasa: +initData.dewasa,
            jumlah_anak: +initData.anak
        }).then(res => {
            const data = res.data as ApiResponse<TarifKamar[]>
            setData(data.data)
            console.log(res.data)

            // Update harga kamar dipesan
            setKamarDipesan(prev => {
                const newKamarDipesan = [...prev]
                data.data.forEach(item => {
                    const index = newKamarDipesan.findIndex(kamar => kamar.idJK === item.jenis_kamar.id)
                    if (index !== -1) {
                        newKamarDipesan[index].harga = item.rincian_tarif.harga
                        newKamarDipesan[index].harga_diskon = item.rincian_tarif.harga_diskon
                        newKamarDipesan[index].nama = item.jenis_kamar.nama
                        newKamarDipesan[index].gambar = item.jenis_kamar.gambar

                        // If lebih banyak dari jumlah kamar yang tersedia, set ke jumlah kamar yang tersedia
                        if (newKamarDipesan[index].count > item.rincian_tarif.jumlah_kamar) {
                            newKamarDipesan[index].count = item.rincian_tarif.jumlah_kamar
                        }
                    }
                })
                return newKamarDipesan
            })

            setIsReady(true)
        }).catch((err: AxiosError) => {
            setData([])
            if (err.response?.data) {
                const data = err.response?.data as ApiErrorResponse
                toast(data.message, {
                    type: "error"
                })
            } else {
                toast(err.message, {
                    type: "error"
                })
            }
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const createBooking = async () => {
        setShowDialogMengamankanHarga(true)
        apiAuthenticated.post(`pegawai/booking/${idC}`, {
            jenis_kamar: kamarDipesan.map(item => ({
                id_jk: item.idJK,
                jumlah: item.count,
                harga: item.harga_diskon,
            })),
            detail: {
                arrival_date: Formatter.dateToYMD(initData?.date.from!!),
                departure_date: Formatter.dateToYMD(initData?.date.to!!),
                jumlah_dewasa: +initData?.dewasa!!,
                jumlah_anak: +initData?.anak!!,
            }
        }).then(res => {
            const data = res.data as ApiResponse<{ reservasi: Reservasi, kamar: ReservasiRoom[] }>
            navigate(`/booking/${data.data.reservasi.id_customer}/${data.data.reservasi.id}/step-1`)
        }).catch(err => {
            if (err.response?.data) {
                const data = err.response?.data as ApiErrorResponse
                toast(data.message, {
                    type: "error"
                })
            } else {
                toast(err.message, {
                    type: "error"
                })
            }
            setShowDialogMengamankanHarga(false)
        })
    }

    const updateKamarDipesan = (tarifKamar: TarifKamar, count: number) => {
        const jenisKamar = tarifKamar.jenis_kamar
        const rincianTarif = tarifKamar.rincian_tarif
        const index = kamarDipesan.findIndex(item => item.idJK === jenisKamar.id)

        let additionalKamarCount = 0
        if (count === 0) {
            // Bulk add this kamar
            additionalKamarCount = +(initData?.jumlahKamar ?? 0) - summaryKamarDipesan.totalKamarSaatIni
            const totalKamar = +(kamarDipesan[index]?.count ?? 0) + additionalKamarCount
            console.log(totalKamar, rincianTarif.jumlah_kamar)
            if (totalKamar > rincianTarif.jumlah_kamar) {
                additionalKamarCount = rincianTarif.jumlah_kamar - (kamarDipesan[index]?.count ?? 0)
            }
        } else {
            additionalKamarCount = count
        }
        if (index === -1) {
            setKamarDipesan(prev => {
                const newKamarDipesan = [...prev]
                newKamarDipesan.push({
                    idJK: jenisKamar.id,
                    nama: jenisKamar.nama,
                    gambar: jenisKamar.gambar,
                    count: additionalKamarCount,
                    harga: rincianTarif.harga,
                    harga_diskon: rincianTarif.harga_diskon
                })
                return newKamarDipesan
            })
        } else {
            setKamarDipesan(prev => {
                const newKamarDipesan = [...prev]
                newKamarDipesan[index].count += additionalKamarCount
                if (newKamarDipesan[index].count === 0) {
                    newKamarDipesan.splice(index, 1)
                }
                return newKamarDipesan
            })
        }
    }

    useEffect(() => {
        const fromAsTime = +(memoizedParams.get("from") ?? new Date().getTime())
        const toAsTime = +(memoizedParams.get("to") ?? new Date().getTime())
        const fromDate = new Date(fromAsTime)
        const toDate = (toAsTime <= fromAsTime) ? new Date(fromAsTime + 24 * 60 * 60 * 1000) : new Date(toAsTime)
        setInitData({
            date: {
                from: fromDate,
                to: toDate
            },
            dewasa: memoizedParams.get("dewasa") ?? "2",
            anak: memoizedParams.get("anak") ?? "0",
            jumlahKamar: memoizedParams.get("jumlahKamar") ?? "2"
        })
        setJumlahMalam(Converter.jumlahMalamFromDateRange(fromDate, toDate))

        setPageTitle(`Cari Kamar ${Formatter.formatDateShort(fromDate)} - ${Formatter.formatDateShort(toDate)}`)
    }, [memoizedParams])

    useEffect(() => {
        fetchData()
    }, [initData])

    useEffect(() => {
        let hargaDiskon = 0
        let hargaNormal = 0
        let totalKamarSaatIni = 0
        kamarDipesan.forEach(item => {
            hargaDiskon += item.harga_diskon * item.count
            hargaNormal += item.harga * item.count
            totalKamarSaatIni += item.count
        })

        setSummaryKamarDipesan({
            hargaDiskon,
            hargaNormal,
            totalKamarSaatIni
        })
    }, [kamarDipesan])

    return <>
        <h3 className="text-3xl font-bold mb-4">
            Pencarian Kamar
        </h3>
        <RoomSearchCG initData={initData} />

        <section className="py-4 border-b">
            <div className="flex flex-wrap lg:flex-row items-center gap-1 lg:gap-4 lg:h-6">
                <p>Ketersediaan kamar untuk<span className="lg:hidden">:</span></p>
                <Separator orientation="vertical" />
                <strong>{Formatter.formatDate(initData?.date.from!!)} - {Formatter.formatDate(initData?.date.to!!)}<span className="ms-2 lg:hidden">&ndash;</span></strong>
                <Separator orientation="vertical" />
                <strong>{initData?.dewasa} dewasa, {initData?.anak} anak<span className="ms-2 lg:hidden">&ndash;</span></strong>
                <Separator orientation="vertical" />
                <strong>{initData?.jumlahKamar} kamar</strong>
            </div>
        </section>

        <section className="pt-8">
            <div className="relative">
                {!isLoading ? data.length > 0 ? data.map((item) => (
                    <TarifKamarCard kamarDipesan={kamarDipesan} item={item} key={item.jenis_kamar.id} jumlahKamarYangDipesan={+(initData?.jumlahKamar ?? 0)} jumlahKamarSaatIni={summaryKamarDipesan.totalKamarSaatIni} onKamarDipesanChange={updateKamarDipesan} />
                )) : (
                    <Card className="shadow-lg mb-8 overflow-auto text-center relative">
                        <CardHeader>
                            <Lottie animationData={LottieNoData} className="w-32 h-32 mx-auto" />
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2 text-lg font-bold">Tidak ada kamar yang tersedia untuk tanggal yang Anda pilih.</p>
                            <p className="mb-4">Pastikan kembali data yang telah Anda isi.</p>
                            <Button variant="default"><HomeIcon className="w-4 h-4 me-2" />Kembali ke halaman utama</Button>
                        </CardContent>
                    </Card>
                ) : [...Array(3)].map((_, index) => (
                    <Card className="shadow-lg mb-8 overflow-auto" key={index}>
                        <Skeleton className="col-span-1 min-h-[18rem] object-cover w-full h-full rounded-none" />
                    </Card>
                ))}
            </div>
        </section>

        <SummaryFooter kamarDipesan={kamarDipesan} initData={initData} jumlahMalam={jumlahMalam} onButtonPesanClick={() => setShowDialogConfirm(true)} show={isReady} summaryKamarDipesan={summaryKamarDipesan} />

        <Dialog modal={true} open={showDialogConfirm} onOpenChange={setShowDialogConfirm}>
            <DialogContent>
                <div className="pb-6">
                    <p>Rincian reservasi:</p>
                    <ul className="list-none mb-4">
                        <li className="flex items-center">
                            <span className="w-28 text-muted-foreground">Check in:</span>
                            <strong>{Formatter.formatDate(initData?.date.from!!)}</strong>
                        </li>
                        <li className="flex items-center">
                            <span className="w-28 text-muted-foreground">Check out:</span>
                            <strong>{Formatter.formatDate(initData?.date.to!!)} ({jumlahMalam} malam)</strong>
                        </li>
                        <li className="flex items-center">
                            <span className="w-28 text-muted-foreground">Jumlah tamu:</span>
                            <strong>{initData?.dewasa} dewasa, {initData?.anak} anak</strong>
                        </li>
                    </ul>

                    <p className="mb-2">Kamar yang akan dipesan:</p>
                    <ul className="list-none mb-4 border rounded overflow-auto">
                        {kamarDipesan.map((item, index) => (
                            <li key={index} className="flex border-b items-center">
                                <img src={getImage(item.gambar)} className="w-32 h-20 object-cover" />
                                <div className="px-4 py-2 flex-1">
                                    <div className="font-bold">{item.count} {item.nama}</div>
                                    <div className="text-sm">{Formatter.formatCurrency(item.harga_diskon)}/kamar/malam</div>
                                </div>
                                <div className="pe-4">
                                    {Formatter.formatCurrency(item.harga_diskon * item.count)}
                                </div>
                            </li>
                        ))}
                        <li className="flex items-center bg-secondary">
                            <div className="px-4 py-2 flex-1">
                                <div className="font-bold">Total</div>
                            </div>
                            <div className="pe-4 font-bold">
                                {Formatter.formatCurrency(summaryKamarDipesan.hargaDiskon)}
                            </div>
                        </li>
                    </ul>

                    <Alert variant="destructive">
                        <InfoIcon className="w-4 h-4 me-2" />
                        <AlertTitle className="mb-2">
                            Pastikan rincian di atas sudah benar sebelum melanjutkan ke halaman booking.
                        </AlertTitle>
                        <AlertDescription>
                            <p>Pastikan tamu ini telah setuju dengan rincian ini.</p>
                            <p>Akan diberi waktu 60 menit untuk menyelesaikan booking ini.</p>
                        </AlertDescription>
                    </Alert>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setShowDialogConfirm(false)}><BanIcon className="w-4 h-4 me-2" /> Batal</Button>
                    <Button variant="default" onClick={createBooking}>
                        Lanjutkan ke halaman booking <ArrowRightIcon className="ms-2 w-4 h-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <GeneralLoadingDialog show={showDialogMengamankanHarga} text="Mengamankan harga…" />
    </>
}