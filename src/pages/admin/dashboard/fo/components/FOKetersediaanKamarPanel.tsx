import { Button } from "@/cn/components/ui/button"
import IconSelect from "@/components/IconSelect"
import LoadingSpinner from "@/components/LoadingSpinner"
import ModalDetailReservasi from "@/components/modals/ModalDetailReservasi"
import { CheckInKamar } from "@/pages/admin/trx-cico/components/ModalCheckIn"
import { ApiResponse, JenisKamar, KamarAvailibility, Reservasi, apiAuthenticated, apiPublic } from "@/utils/ApiModels"
import Formatter from "@/utils/Formatter"
import { HashIcon } from "lucide-react"
import { useEffect, useState } from "react"


export default function FOKetersediaanKamarPanel({
    containerClassName = "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-4 text-center",
    initLantai,
    initIdJK,
    currentlySelectedKamars,
    onKamarClicked
}: {
    containerClassName?: string,
    initLantai?: string,
    initIdJK?: string,
    currentlySelectedKamars?: CheckInKamar[],
    onKamarClicked?: (item: KamarAvailibility) => void
}) {
    const [list, setList] = useState<KamarAvailibility[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout>()
    const [detailReservasi, setDetailReservasi] = useState<Reservasi>()
    const [showDialog, setShowDialog] = useState(false)
    const [detailLoading, setDetailLoading] = useState(false)
    const [listJK, setListJK] = useState<JenisKamar[]>([])
    const [noLantai, setNoLantai] = useState(initLantai ?? "0")
    const [idJenisKamar, setIdJenisKamar] = useState(initIdJK ?? "0")

    const fetchData = () => {
        const query = new URLSearchParams({ no_lantai: noLantai })
        if (idJenisKamar) {
            query.append("id_jk", idJenisKamar.toString())
        }

        setIsLoading(true)
        apiAuthenticated.get<ApiResponse<KamarAvailibility[]>>(`pegawai/fo/ketersediaan?${query.toString()}`).then((res) => {
            const data = res.data
            setList(data.data)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const fetchJenisKamar = () => {
        apiPublic.get<ApiResponse<JenisKamar[]>>("public/jenis-kamar").then((res) => {
            const data = res.data
            data.data.forEach((item) => {
                delete item.fasilitas
                delete item.rincian
                delete item.fasilitas_unggulan
            })
            setListJK(data.data)
        })
    }

    const onKamarSelected = (item: KamarAvailibility) => {
        if (onKamarClicked) {
            onKamarClicked(item)
        } else {
            getDetailReservasi(item.reservasi)
        }
    }

    const getDetailReservasi = (reservasi: Reservasi | null) => {
        if (reservasi) {
            setDetailLoading(true)
            setShowDialog(true)
            apiAuthenticated.get<ApiResponse<Reservasi>>(`pegawai/reservasi/${reservasi.id_customer}/${reservasi.id}`).then((res) => {
                const data = res.data
                setDetailReservasi(data.data)
                setDetailLoading(false)
            })
        }
    }

    useEffect(() => {
        fetchJenisKamar()
    }, [])

    useEffect(() => {
        fetchData()
    }, [noLantai, idJenisKamar])

    useEffect(() => {
        if (refreshInterval) {
            clearInterval(refreshInterval)
        }
        const interval = setInterval(() => {
            fetchData()
        }, 10000)
        setRefreshInterval(interval)
        return () => {
            clearInterval(interval)
        }
    }, [list])

    return (
        <>
            <div className="flex items-center justify-between mb-4">
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

                <div className="flex gap-2">
                    <IconSelect
                        className="mb-0"
                        icon={<HashIcon className="w-full h-full" />}
                        placeholder="Pilih Jenis Kamar"
                        value={idJenisKamar}
                        onValueChange={setIdJenisKamar}
                        values={[
                            {
                                value: "0",
                                label: "Semua Jenis Kamar"
                            },
                            ...listJK.map((item) => ({
                                value: item.id.toString(),
                                label: item.nama
                            }))
                        ]} />

                    <IconSelect
                        className="mb-0"
                        icon={<HashIcon className="w-full h-full" />}
                        placeholder="Pilih Nomor Lantai"
                        value={noLantai}
                        onValueChange={setNoLantai}
                        values={[
                            { value: "0", label: "Semua Lantai" },
                            { value: "1", label: "Lantai 1" },
                            { value: "2", label: "Lantai 2" },
                            { value: "3", label: "Lantai 3" },
                            { value: "4", label: "Lantai 4" },
                        ]}
                    />
                </div>
            </div>

            <div className={containerClassName}>
                {isLoading ? (
                    <div className="col-span-6 text-center">
                        <LoadingSpinner />
                        Memuat…
                    </div>
                ) : list.map((item) => {
                    let className = item.status === 'TSD' ? 'bg-green-500 text-white' : item.status === 'TRS' ? 'bg-yellow-500' : item.status === 'COT' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                    const kamarSudahDipilih = currentlySelectedKamars?.find((kamar) => kamar.no_kamar === item.no_kamar)
                    if (kamarSudahDipilih) {
                        className = 'bg-secondary  cursor-not-allowed'
                    }
                    return (
                        <Button key={item.no_kamar} className={`${className} p-4 rounded block h-full`} variant="ghost" onClick={() => onKamarSelected(item)} style={{ height: "6rem" }}>
                            <div className="font-bold text-lg">{item.no_kamar}</div>
                            <div className="text-sm">{item.jenis_kamar.nama}</div>
                            {item.status === "TSD" ? <>
                                <div className="text-sm"></div>
                                {kamarSudahDipilih && (
                                    <div className="font-bold text-xs">SUDAH DIPILIH</div>
                                )}
                            </> : (item.reservasi ? (item.status !== "UNV" ? <>
                                <div className="text-sm truncate">{item.reservasi.user_customer?.nama}</div>
                            </> : <>
                                <div className="text-sm">Perawatan hingga</div>
                                <div className="text-sm">{Formatter.formatDateShort(new Date(item.reservasi.departure_date))}</div>
                            </>) : (
                                <div className="text-sm">Tidak tersedia</div>
                            ))}
                        </Button>
                    )
                })}
            </div>

            <ModalDetailReservasi show={showDialog} onOpenChange={setShowDialog} data={detailReservasi} loading={detailLoading} />
        </>
    )
}