import useQuery from "@/hooks/useQuery"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import RoomSearch, { RoomSearchData } from "../_layout/components/RoomSearch"
import usePageTitle from "@/hooks/usePageTitle"
import { Skeleton } from "@/cn/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/cn/components/ui/card"
import { Button } from "@/cn/components/ui/button"
import Formatter from "@/utils/Formatter"
import { AxiosError } from "axios"
import { ApiErrorResponse, ApiResponse, JenisKamar, Reservasi, ReservasiRoom, RincianTarif, apiAuthenticated, apiPublic, getImage } from "@/utils/ApiModels"
import { ArrowRightIcon, BanIcon, HomeIcon, InfoIcon } from "lucide-react"
import Converter from "@/utils/Converter"
import { Dialog, DialogContent, DialogFooter } from "@/cn/components/ui/dialog"
import { Alert, AlertDescription } from "@/cn/components/ui/alert"
import AuthHelper from "@/utils/AuthHelper"
import { toast } from "react-toastify"
import Lottie from "lottie-react";

import AbstractBG from "@/assets/images/abstract-bg.jpg"
// import PetunjukPenggunaan from "@/assets/images/petunjuk-penggunaan.jpg"
import InlineLogo from "@/assets/images/gah-inline-logo.png"
import { Separator } from "@/cn/components/ui/separator"
import TarifKamarCard from "./components/TarifKamarCard"
import SummaryFooter from "./components/SummaryFooter"
import LottieNoData from "@/assets/lottie/Animation - 1699364588857.json"
import GeneralLoadingDialog from "@/components/GeneralLoadingDialog"

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

export default function PageRoomSearch() {
    const params = useQuery()
    const [userType, setUserType] = useState<"c" | "p" | null>(null)
    const [kamarDipesan, setKamarDipesan] = useState<KamarDipesan[]>([])
    const [initData, setInitData] = useState<Required<RoomSearchData>>()
    const [data, setData] = useState<TarifKamar[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isReady, setIsReady] = useState(false)
    const [showDialogConfirm, setShowDialogConfirm] = useState(false)
    const [showDialogLogin, setShowDialogLogin] = useState(false)
    const [showDialogMengamankanHarga, setShowDialogMengamankanHarga] = useState(false)
    const [jumlahMalam, setJumlahMalam] = useState(0)
    const [summaryKamarDipesan, setSummaryKamarDipesan] = useState<SummaryKamarDipesan>({
        hargaDiskon: 0,
        hargaNormal: 0,
        totalKamarSaatIni: 0
    })
    const [pageTitle, setPageTitle] = useState("Grand Atma Hotel - Cari Kamar")

    const memoizedParams = useMemo(() => params, [params.get('from'), params.get('to'), params.get('dewasa'), params.get('anak'), params.get('jumlahKamar')])
    const navigate = useNavigate()

    usePageTitle(pageTitle)

    const fetchData = async () => {
        if (!initData) {
            return
        }
        setIsLoading(true)
        setIsReady(false)
        apiPublic.post(`public/booking/search`, {
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
        if (userType === "c") {
            setShowDialogMengamankanHarga(true)
            apiAuthenticated.post(`customer/booking`, {
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
                navigate(`/booking/${data.data.reservasi.id}/step-1`)
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
            })
        } else if (userType === "p") {
            toast("Anda tidak dapat memesan kamar karena Anda login sebagai pegawai.", {
                type: "error"
            })
        } else {
            setShowDialogLogin(true)
        }
    }

    const redirectToLoginWithParams = () => {
        const redirectTo = new URLSearchParams()
        redirectTo.set("from", (initData?.date.from?.getTime() ?? 0).toString())
        redirectTo.set("to", (initData?.date.to?.getTime() ?? 0).toString())
        redirectTo.set("dewasa", initData?.dewasa!!)
        redirectTo.set("anak", initData?.anak!!)
        redirectTo.set("jumlahKamar", initData?.jumlahKamar!!)
        const param = redirectTo.toString()
        navigate(`/login?${new URLSearchParams({ redirect: `/search?${param}` }).toString()}`)
    }

    const updateKamarDipesan = (tarifKamar: TarifKamar, count: -1 | 1) => {
        const jenisKamar = tarifKamar.jenis_kamar
        const rincianTarif = tarifKamar.rincian_tarif
        const index = kamarDipesan.findIndex(item => item.idJK === jenisKamar.id)
        if (index === -1) {
            setKamarDipesan(prev => {
                const newKamarDipesan = [...prev]
                newKamarDipesan.push({
                    idJK: jenisKamar.id,
                    nama: jenisKamar.nama,
                    gambar: jenisKamar.gambar,
                    count: 1,
                    harga: rincianTarif.harga,
                    harga_diskon: rincianTarif.harga_diskon
                })
                return newKamarDipesan
            })
        } else {
            setKamarDipesan(prev => {
                const newKamarDipesan = [...prev]
                newKamarDipesan[index].count += count
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

        const kamarDipesanFromLS = Formatter.formatJSON<KamarDipesan[]>(localStorage.getItem("kamarDipesan") ?? "[]")
        if (Array.isArray(kamarDipesanFromLS)) {
            setKamarDipesan(kamarDipesanFromLS)
        }

        setPageTitle(`Cari Kamar ${Formatter.formatDateShort(fromDate)} - ${Formatter.formatDateShort(toDate)}`)
    }, [memoizedParams])

    useEffect(() => {
        if (AuthHelper.getUserCustomer()) {
            setUserType("c")
        } else if (AuthHelper.getUserPegawai()) {
            setUserType("p")
        } else {
            setUserType(null)
        }
        fetchData()
    }, [initData])

    useEffect(() => {
        localStorage.setItem("kamarDipesan", JSON.stringify(kamarDipesan.map(item => ({ idJK: item.idJK, count: item.count }))))

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
        <section className="pb-8 pt-32 shadow-lg relative">
            <img src={AbstractBG} className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-b-3xl object-cover" />
            <div className="container relative">
                <h3 className="text-3xl font-bold mb-4">
                    Temukan <mark>Kamar</mark> Anda
                </h3>
                <RoomSearch initData={initData} showIntro={false} className="shadow-none border-0 bg-transparent" innerClassName="p-0" />
            </div>
        </section>

        <section className="py-4 border-b">
            <div className="container flex items-center space-x-4 h-6">
                <p>Ketersediaan kamar untuk</p>
                <Separator orientation="vertical" />
                <strong>{Formatter.formatDate(initData?.date.from!!)} - {Formatter.formatDate(initData?.date.to!!)}</strong>
                <Separator orientation="vertical" />
                <strong>{initData?.dewasa} dewasa, {initData?.anak} anak</strong>
                <Separator orientation="vertical" />
                <strong>{initData?.jumlahKamar} kamar</strong>
            </div>
        </section>

        <section className="py-8">
            <div className="container relative">
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
                            <span className="w-28 text-secondary-foreground">Check in:</span>
                            <strong>{Formatter.formatDate(initData?.date.from!!)}</strong>
                        </li>
                        <li className="flex items-center">
                            <span className="w-28 text-secondary-foreground">Check out:</span>
                            <strong>{Formatter.formatDate(initData?.date.to!!)} ({jumlahMalam} malam)</strong>
                        </li>
                        <li className="flex items-center">
                            <span className="w-28 text-secondary-foreground">Jumlah tamu:</span>
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
                        <AlertDescription>
                            <p className="mb-2">Pastikan rincian di atas sudah benar sebelum melanjutkan ke halaman booking.</p>
                            <p>Setelah melanjutkan ke halaman booking, kami akan mengunci harga ini untuk Anda dan Anda diberi waktu 20 menit untuk menyelesaikan pembayaran.</p>
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

        <Dialog modal={true} open={showDialogLogin} onOpenChange={setShowDialogLogin}>
            <DialogContent className="text-center">
                <div>
                    <img src={InlineLogo} className="w-48 h-auto mx-auto mb-4" />
                    <p>Anda harus masuk ke <strong>Grand Atma Account</strong> terlebih dahulu untuk melanjutkan ke halaman booking.</p>
                </div>
                <DialogFooter className="!justify-center mt-4">
                    <Button variant="secondary" onClick={() => setShowDialogLogin(false)}><BanIcon className="w-4 h-4 me-2" /> Batal</Button>
                    <Button variant="default" onClick={redirectToLoginWithParams}>Login <ArrowRightIcon className="ms-2 w-4 h-4" /></Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <GeneralLoadingDialog show={showDialogMengamankanHarga} text="Mengamankan harga untuk Anda…" />
    </>
}